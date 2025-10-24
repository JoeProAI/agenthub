import { NextRequest, NextResponse } from 'next/server'
import { executeContentWizard, streamContentWizard, ContentWizardInput } from '@/lib/agents/content-wizard'
import { db } from '@/lib/firebase/config'
import { doc, setDoc, updateDoc, increment } from 'firebase/firestore'
import { z } from 'zod'

// Input validation schema
const contentWizardSchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters'),
  format: z.enum(['blog', 'social', 'documentation', 'email']),
  tone: z.enum(['professional', 'casual', 'technical', 'friendly']).optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
  userId: z.string(),
  stream: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedInput = contentWizardSchema.parse(body)
    const { userId, stream, ...agentInput } = validatedInput

    // Check user credits
    const userRef = doc(db, 'users', userId)
    const userDoc = await userRef.get()
    
    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userData = userDoc.data()
    const credits = userData.credits || 0

    if (credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      )
    }

    // Deduct credit immediately
    await updateDoc(userRef, {
      credits: increment(-1),
      totalExecutions: increment(1),
    })

    // Create execution record
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const executionRef = doc(db, 'executions', executionId)
    
    await setDoc(executionRef, {
      userId,
      agentId: 'content-wizard',
      agentName: 'Content Wizard',
      input: agentInput,
      status: 'running',
      createdAt: new Date().toISOString(),
      cost: 1, // Free agent (demo)
    })

    // Execute agent
    if (stream) {
      // Streaming response
      const encoder = new TextEncoder()
      const customStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamContentWizard(agentInput)) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`))
            }
            
            // Update execution status
            await updateDoc(executionRef, {
              status: 'completed',
              completedAt: new Date().toISOString(),
            })
            
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          } catch (error: any) {
            await updateDoc(executionRef, {
              status: 'failed',
              error: error.message,
              completedAt: new Date().toISOString(),
            })
            controller.error(error)
          }
        },
      })

      return new NextResponse(customStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    } else {
      // Non-streaming response
      const result = await executeContentWizard(agentInput)
      
      // Update execution with result
      await updateDoc(executionRef, {
        output: result,
        status: 'completed',
        completedAt: new Date().toISOString(),
      })

      return NextResponse.json({
        executionId,
        result,
        creditsRemaining: credits - 1,
      })
    }
  } catch (error: any) {
    console.error('Content Wizard error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get execution status
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
    const executionDoc = await executionRef.get()

    if (!executionDoc.exists()) {
      return NextResponse.json(
        { error: 'Execution not found' },
        { status: 404 }
      )
    }

    const execution = executionDoc.data()

    // Verify ownership
    if (execution.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json(execution)
  } catch (error: any) {
    console.error('Get execution error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
