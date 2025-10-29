import { NextRequest } from 'next/server'
import { streamText, tool } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { adminDb } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * Streaming Chat API - Real-time agent interaction
 * Shows tool calls, reasoning steps, and streams tokens as they generate
 */

// Define tools available to the chat agent
const chatTools = {
  searchWeb: tool({
    description: 'Search the web for information on a topic. Returns relevant articles and sources.',
    parameters: z.object({
      query: z.string().describe('The search query'),
      limit: z.number().optional().describe('Max results to return (default 5)'),
    }),
    execute: async ({ query, limit = 5 }) => {
      // In production, use real search API (Brave, Serper, etc)
      // For now, simulate search results
      return {
        results: [
          {
            title: `Research on ${query}`,
            url: `https://example.com/research/${encodeURIComponent(query)}`,
            snippet: `Comprehensive analysis of ${query} with data-driven insights...`,
            date: new Date().toISOString(),
          },
          {
            title: `Latest findings: ${query}`,
            url: `https://journal.example.com/${encodeURIComponent(query)}`,
            snippet: `Recent studies show significant developments in ${query}...`,
            date: new Date().toISOString(),
          },
        ].slice(0, limit),
        query,
        totalResults: 150,
      }
    },
  }),

  analyzeCode: tool({
    description: 'Analyze code for best practices, potential bugs, and improvements',
    parameters: z.object({
      code: z.string().describe('Code to analyze'),
      language: z.string().describe('Programming language'),
    }),
    execute: async ({ code, language }) => {
      // Simulate code analysis
      // In production, this would use Daytona for real execution
      return {
        language,
        issues: [
          {
            type: 'best-practice',
            severity: 'medium',
            message: 'Consider adding error handling',
            line: 5,
          },
        ],
        suggestions: [
          'Add type annotations for better type safety',
          'Consider extracting complex logic into separate functions',
        ],
        complexity: 'moderate',
        score: 7.5,
      }
    },
  }),

  calculateMath: tool({
    description: 'Perform mathematical calculations or solve equations',
    parameters: z.object({
      expression: z.string().describe('Mathematical expression to evaluate'),
    }),
    execute: async ({ expression }) => {
      try {
        // Safe math evaluation using Function constructor
        // Only allows basic arithmetic operations
        const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, '')
        if (!sanitized || sanitized.length === 0) {
          return { expression, error: 'Invalid mathematical expression' }
        }
        
        // Use Function constructor instead of eval (safer)
        const result = new Function(`return ${sanitized}`)()
        
        if (typeof result !== 'number' || !isFinite(result)) {
          return { expression, error: 'Invalid result' }
        }
        
        return {
          expression,
          result,
          formatted: `${expression} = ${result}`,
        }
      } catch (error: any) {
        return {
          expression,
          error: 'Invalid mathematical expression',
        }
      }
    },
  }),

  getDateTime: tool({
    description: 'Get current date, time, or timezone information',
    parameters: z.object({
      timezone: z.string().optional().describe('Timezone (e.g., "America/New_York")'),
    }),
    execute: async ({ timezone = 'UTC' }) => {
      const now = new Date()
      return {
        timestamp: now.toISOString(),
        timezone,
        formatted: now.toLocaleString('en-US', { timeZone: timezone }),
        unix: Math.floor(now.getTime() / 1000),
      }
    },
  }),
}

// Cost per message
const COST_PER_MESSAGE = 5

export async function POST(req: NextRequest) {
  const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  let userId: string | undefined

  try {
    const body = await req.json()
    userId = body.userId
    const { messages } = body

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check credits
    const userRef = adminDb.collection('users').doc(userId)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const userData = userDoc.data()
    const credits = userData?.credits || 0

    if (credits < COST_PER_MESSAGE) {
      return new Response(
        JSON.stringify({
          error: `Insufficient credits. Need ${COST_PER_MESSAGE}, have ${credits}`
        }),
        { status: 402, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Deduct credits
    await userRef.update({
      credits: FieldValue.increment(-COST_PER_MESSAGE),
      totalExecutions: FieldValue.increment(1),
    })

    // Create execution record
    const executionRef = await adminDb.collection('executions').add({
      id: executionId,
      agentId: 'streaming-chat',
      userId,
      status: 'running',
      input: {
        messageCount: messages.length,
        lastMessage: messages[messages.length - 1].content.substring(0, 100),
      },
      startedAt: new Date().toISOString(),
      cost: COST_PER_MESSAGE,
    })

    // Create streaming response
    const result = streamText({
      model: openai('gpt-4o'),
      messages,
      tools: chatTools,
      maxSteps: 5, // Allow up to 5 tool calls/reasoning steps
      system: `You are a helpful AI assistant with access to tools.

When users ask questions:
- Use searchWeb to find current information
- Use analyzeCode when they share code snippets
- Use calculateMath for mathematical problems
- Use getDateTime for time-related queries

Be concise, professional, and accurate. Show your reasoning process.`,

      // Callback when generation finishes
      onFinish: async (result) => {
        // Update execution record
        await executionRef.update({
          status: 'completed',
          completedAt: new Date().toISOString(),
          output: {
            stepsExecuted: result.steps?.length || 0,
            toolCallsMade: result.toolCalls?.length || 0,
            finishReason: result.finishReason,
          },
        })
      },
    })

    // Return streaming response
    return result.toDataStreamResponse()

  } catch (error: any) {
    console.error('Streaming chat error:', error)

    // Refund credits on error
    try {
      if (userId) {
        const userRef = adminDb.collection('users').doc(userId)
        await userRef.update({
          credits: FieldValue.increment(COST_PER_MESSAGE),
          totalExecutions: FieldValue.increment(-1),
        })
      }
    } catch (refundError) {
      console.error('Failed to refund credits:', refundError)
    }

    return new Response(
      JSON.stringify({
        error: error.message || 'Chat failed',
        executionId,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
