import { NextRequest, NextResponse } from 'next/server'
import { generateText, generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { doc, getDoc, updateDoc, addDoc, collection, increment } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { getDaytonaClient } from '@/lib/daytona/client'

// Input validation schema
const contentEngineSchema = z.object({
  userId: z.string(),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  format: z.enum(['blog', 'social', 'documentation', 'email', 'landing-page']),
  tone: z.enum(['professional', 'casual', 'technical', 'friendly', 'persuasive']),
  options: z.object({
    seoOptimize: z.boolean().default(true),
    factCheck: z.boolean().default(false),
    includeImages: z.boolean().default(false),
    targetWordCount: z.number().optional(),
  }).optional(),
})

interface ContentAnalysis {
  sentiment: string
  readingLevel: number
  keyTopics: string[]
  suggestedImprovements: string[]
}

interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  slug: string
}

/**
 * PRODUCTION-GRADE CONTENT ENGINE
 * Multi-step orchestration with validation, analysis, and optimization
 */
export async function POST(request: NextRequest) {
  const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    // 1. Parse and validate input
    const body = await request.json()
    const input = contentEngineSchema.parse(body)

    // 2. Check user credits
    const userRef = doc(db, 'users', input.userId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = userDoc.data()
    const credits = userData?.credits || 0

    if (credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 })
    }

    // 3. Deduct credit immediately
    await updateDoc(userRef, {
      credits: increment(-1),
      totalExecutions: increment(1),
    })

    // 4. Create execution record
    const executionRef = await addDoc(collection(db, 'executions'), {
      id: executionId,
      agentId: 'content-engine',
      userId: input.userId,
      status: 'running',
      input: {
        format: input.format,
        tone: input.tone,
        contentLength: input.content.length,
      },
      startedAt: new Date().toISOString(),
      cost: 1,
    })

    // 5. STEP 1: Content Analysis
    const analysis = await analyzeContent(input.content)

    // 6. STEP 2: Generate structured outline
    const outline = await generateOutline(input.content, input.format, input.tone)

    // 7. STEP 3: Generate optimized content
    const generatedContent = await generateOptimizedContent({
      originalContent: input.content,
      outline,
      format: input.format,
      tone: input.tone,
      analysis,
      targetWordCount: input.options?.targetWordCount,
    })

    // 8. STEP 4: SEO Optimization (if enabled)
    let seoMetadata: SEOMetadata | null = null
    if (input.options?.seoOptimize) {
      seoMetadata = await generateSEOMetadata(generatedContent, input.format)
    }

    // 9. STEP 5: Fact checking (if enabled)
    let factCheckResults: any = null
    if (input.options?.factCheck) {
      factCheckResults = await performFactCheck(generatedContent)
    }

    // 10. Update execution record
    await updateDoc(doc(db, 'executions', executionRef.id), {
      status: 'completed',
      completedAt: new Date().toISOString(),
      output: {
        wordCount: generatedContent.split(' ').length,
        readingTime: Math.ceil(generatedContent.split(' ').length / 200),
      },
    })

    // 11. Return comprehensive result
    return NextResponse.json({
      executionId,
      content: generatedContent,
      analysis,
      outline,
      seo: seoMetadata,
      factCheck: factCheckResults,
      metadata: {
        wordCount: generatedContent.split(' ').length,
        readingTime: Math.ceil(generatedContent.split(' ').length / 200),
        characterCount: generatedContent.length,
      },
      creditsRemaining: credits - 1,
    })

  } catch (error: any) {
    console.error('Content engine error:', error)
    
    // Refund credit on error
    try {
      const userRef = doc(db, 'users', (await request.json()).userId)
      await updateDoc(userRef, { credits: increment(1) })
    } catch (refundError) {
      console.error('Failed to refund credit:', refundError)
    }

    return NextResponse.json(
      { error: error.message || 'Content generation failed', executionId },
      { status: 500 }
    )
  }
}

/**
 * Analyze content quality and characteristics
 */
async function analyzeContent(content: string): Promise<ContentAnalysis> {
  const result = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: z.object({
      sentiment: z.enum(['positive', 'neutral', 'negative']),
      readingLevel: z.number().min(1).max(20),
      keyTopics: z.array(z.string()).max(5),
      suggestedImprovements: z.array(z.string()).max(3),
    }),
    prompt: `Analyze this content and provide insights:

${content}

Provide:
1. Overall sentiment
2. Reading level (Flesch-Kincaid grade)
3. Key topics (max 5)
4. Top 3 improvement suggestions`,
  })

  return result.object
}

/**
 * Generate structured outline
 */
async function generateOutline(content: string, format: string, tone: string): Promise<string[]> {
  const result = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: z.object({
      outline: z.array(z.string()).min(3).max(8),
    }),
    prompt: `Create a structured outline for ${format} content with ${tone} tone.

Original content:
${content}

Generate 3-8 clear section headers.`,
  })

  return result.object.outline
}

/**
 * Generate optimized content with multi-stage refinement
 */
async function generateOptimizedContent(params: {
  originalContent: string
  outline: string[]
  format: string
  tone: string
  analysis: ContentAnalysis
  targetWordCount?: number
}): Promise<string> {
  const { originalContent, outline, format, tone, analysis, targetWordCount } = params

  // Stage 1: Generate draft
  const draft = await generateText({
    model: openai('gpt-4o'),
    maxTokens: targetWordCount ? Math.ceil(targetWordCount * 1.5) : 2000,
    temperature: 0.7,
    prompt: `Transform this content into a ${format} piece with ${tone} tone.

ORIGINAL CONTENT:
${originalContent}

OUTLINE TO FOLLOW:
${outline.map((item, i) => `${i + 1}. ${item}`).join('\n')}

ANALYSIS INSIGHTS:
- Sentiment: ${analysis.sentiment}
- Key Topics: ${analysis.keyTopics.join(', ')}
- Improvements needed: ${analysis.suggestedImprovements.join(', ')}

Requirements:
- Follow the outline structure
- Maintain ${tone} tone throughout
- Address the improvement suggestions
- Make it engaging and actionable
${targetWordCount ? `- Target approximately ${targetWordCount} words` : ''}
- Use clear, concise language
- Include transitions between sections`,
  })

  // Stage 2: Refinement pass
  const refined = await generateText({
    model: openai('gpt-4o'),
    maxTokens: 1500,
    temperature: 0.3,
    prompt: `Refine and polish this ${format} content. Fix any issues, improve flow, and ensure professional quality.

DRAFT:
${draft.text}

Make it publication-ready. Fix grammar, improve transitions, enhance clarity.`,
  })

  return refined.text
}

/**
 * Generate SEO metadata
 */
async function generateSEOMetadata(content: string, format: string): Promise<SEOMetadata> {
  const result = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: z.object({
      title: z.string().max(60),
      description: z.string().max(160),
      keywords: z.array(z.string()).max(10),
      slug: z.string().regex(/^[a-z0-9-]+$/),
    }),
    prompt: `Generate SEO metadata for this ${format} content:

${content.substring(0, 1000)}

Requirements:
- Title: Compelling, under 60 chars, includes primary keyword
- Description: Engaging, under 160 chars, includes call-to-action
- Keywords: 5-10 relevant keywords/phrases
- Slug: URL-friendly, lowercase, hyphens only`,
  })

  return result.object
}

/**
 * Perform fact checking using LLM + search
 */
async function performFactCheck(content: string): Promise<any> {
  // Extract claims
  const claims = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: z.object({
      factualClaims: z.array(z.object({
        claim: z.string(),
        confidence: z.enum(['high', 'medium', 'low']),
        needsVerification: z.boolean(),
      })),
    }),
    prompt: `Extract factual claims from this content that should be verified:

${content}

Identify specific factual statements, not opinions.`,
  })

  // For now, return the claims
  // In production, you'd verify each claim against external sources
  return {
    totalClaims: claims.object.factualClaims.length,
    needsVerification: claims.object.factualClaims.filter(c => c.needsVerification).length,
    claims: claims.object.factualClaims,
    verified: false, // Would check against fact databases
  }
}

/**
 * GET endpoint - retrieve execution status
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const executionId = searchParams.get('executionId')
  const userId = searchParams.get('userId')

  if (!executionId || !userId) {
    return NextResponse.json(
      { error: 'Missing executionId or userId' },
      { status: 400 }
    )
  }

  try {
    const executionRef = doc(db, 'executions', executionId)
    const executionDoc = await getDoc(executionRef)

    if (!executionDoc.exists()) {
      return NextResponse.json(
        { error: 'Execution not found' },
        { status: 404 }
      )
    }

    const execution = executionDoc.data()

    // Verify ownership
    if (execution?.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json(execution)
  } catch (error: any) {
    console.error('Get execution error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve execution' },
      { status: 500 }
    )
  }
}
