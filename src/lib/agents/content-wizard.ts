import { openai } from '@ai-sdk/openai'
import { generateText, streamText } from 'ai'

export interface ContentWizardInput {
  content: string
  format: 'blog' | 'social' | 'documentation' | 'email'
  tone?: 'professional' | 'casual' | 'technical' | 'friendly'
  length?: 'short' | 'medium' | 'long'
}

export interface ContentWizardOutput {
  title: string
  content: string
  metadata: {
    wordCount: number
    estimatedReadTime: number
  }
}

const SYSTEM_PROMPTS = {
  blog: `You are an expert blog writer. Transform the provided notes into a well-structured, engaging blog post with:
- Compelling headline
- Clear introduction
- Well-organized body with subheadings
- Strong conclusion
- SEO-friendly content`,
  
  social: `You are a social media expert. Transform the content into engaging social media posts optimized for:
- Platform-specific best practices
- Attention-grabbing hooks
- Clear call-to-action
- Optimal length for engagement`,
  
  documentation: `You are a technical writer. Transform the content into clear, comprehensive documentation with:
- Logical structure and hierarchy
- Code examples where relevant
- Step-by-step instructions
- Clear explanations of technical concepts`,
  
  email: `You are a professional email writer. Transform the content into a well-crafted email with:
- Clear subject line
- Professional greeting
- Concise and purposeful body
- Appropriate closing
- Professional tone`
}

export async function executeContentWizard(
  input: ContentWizardInput
): Promise<ContentWizardOutput> {
  const systemPrompt = SYSTEM_PROMPTS[input.format]
  const toneInstruction = input.tone ? `\nTone: ${input.tone}` : ''
  const lengthInstruction = input.length ? `\nLength: ${input.length}` : ''

  const prompt = `${systemPrompt}${toneInstruction}${lengthInstruction}

Source Content:
${input.content}

Generate the ${input.format} now:`

  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt,
    temperature: 0.7,
    maxTokens: 2000,
  })

  // Extract title (first line or generate from content)
  const lines = text.split('\n')
  const title = lines[0].replace(/^#\s*/, '').trim()
  const content = lines.slice(1).join('\n').trim()

  const wordCount = content.split(/\s+/).length
  const estimatedReadTime = Math.ceil(wordCount / 200) // Average reading speed

  return {
    title,
    content,
    metadata: {
      wordCount,
      estimatedReadTime,
    },
  }
}

export async function* streamContentWizard(
  input: ContentWizardInput
): AsyncGenerator<string, void, unknown> {
  const systemPrompt = SYSTEM_PROMPTS[input.format]
  const toneInstruction = input.tone ? `\nTone: ${input.tone}` : ''
  const lengthInstruction = input.length ? `\nLength: ${input.length}` : ''

  const prompt = `${systemPrompt}${toneInstruction}${lengthInstruction}

Source Content:
${input.content}

Generate the ${input.format} now:`

  const result = await streamText({
    model: openai('gpt-4o'),
    prompt,
    temperature: 0.7,
    maxTokens: 2000,
  })

  for await (const chunk of result.textStream) {
    yield chunk
  }
}
