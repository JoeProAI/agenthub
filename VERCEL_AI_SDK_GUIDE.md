# Vercel AI SDK - Complete Integration Guide

## 🎯 What is Vercel AI SDK?

**Vercel AI SDK** is a powerful framework for building AI applications with:
- **Multi-step agents** (tool calling, reasoning)
- **Streaming responses** (real-time UX)
- **Multi-modal inputs** (text, images, audio, video)
- **Model routing** (fallbacks, load balancing)
- **Structured outputs** (type-safe responses)
- **Framework agnostic** (works with Next.js, Express, etc.)

**NOT just a wrapper** - it's a complete agentic framework.

---

## 📦 What We're Currently Using

### **Basic Text Generation**
```typescript
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Write a blog post...'
})
```

### **Structured Outputs**
```typescript
import { generateObject } from 'ai'
import { z } from 'zod'

const result = await generateObject({
  model: openai('gpt-4o'),
  schema: z.object({
    title: z.string(),
    sentiment: z.enum(['positive', 'neutral', 'negative'])
  }),
  prompt: 'Analyze this content...'
})
// result.object is type-safe!
```

---

## 🔥 What We're MISSING (The Good Stuff)

### **1. Tool Calling & Multi-Step Agents**

**Real agentic behavior** - the agent can plan, use tools, and reason across multiple steps.

```typescript
import { generateText, tool } from 'ai'
import { z } from 'zod'

const result = await generateText({
  model: openai('gpt-4o'),
  tools: {
    searchWeb: tool({
      description: 'Search the web for information',
      parameters: z.object({
        query: z.string(),
      }),
      execute: async ({ query }) => {
        const response = await fetch(`https://api.search.com?q=${query}`)
        return response.json()
      },
    }),
    
    readFile: tool({
      description: 'Read a file from disk',
      parameters: z.object({
        path: z.string(),
      }),
      execute: async ({ path }) => {
        return fs.readFileSync(path, 'utf-8')
      },
    }),
    
    analyzeCode: tool({
      description: 'Run linting and security analysis',
      parameters: z.object({
        code: z.string(),
        language: z.string(),
      }),
      execute: async ({ code, language }) => {
        // Use Daytona for real execution
        const workspace = await daytona.createWorkspace({ runtime: 'node' })
        await daytona.writeFile(workspace.id, '/app/code.js', code)
        const result = await daytona.executeCode(
          workspace.id,
          'npx eslint /app/code.js',
          'javascript'
        )
        await daytona.deleteWorkspace(workspace.id)
        return result
      },
    }),
  },
  maxSteps: 5, // Allow up to 5 tool calls/reasoning steps
  prompt: 'Research React hooks, analyze this code, and write a report',
})

// The agent will:
// 1. Call searchWeb("React hooks best practices")
// 2. Call analyzeCode(userCode, "javascript")
// 3. Reason about the results
// 4. Generate final report

console.log(result.text) // Final answer
console.log(result.steps) // All steps taken
console.log(result.toolResults) // Tool call results
```

**This is REAL AI agents** - not just text generation.

---

### **2. Streaming Responses**

Real-time token streaming for better UX:

**Backend:**
```typescript
// app/api/chat/route.ts
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    tools: {
      // Your tools here
    },
  })

  return result.toDataStreamResponse()
}
```

**Frontend:**
```typescript
'use client'
import { useChat } from 'ai/react'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  })

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          <strong>{m.role}:</strong> {m.content}
        </div>
      ))}
      
      <form onSubmit={handleSubmit}>
        <input 
          value={input} 
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

**Tokens stream in real-time** as they're generated!

---

### **3. Multi-Modal Inputs**

Process images, audio, PDFs with vision models:

```typescript
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const result = await generateText({
  model: openai('gpt-4o'), // Vision-capable
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Analyze this architecture diagram' },
        { 
          type: 'image',
          image: 'https://example.com/architecture.png'
        }
      ]
    }
  ]
})

// Works with:
// - Images (PNG, JPG, WebP)
// - PDFs (with vision models)
// - Audio (with Whisper)
```

---

### **4. Model Router (Fallbacks)**

Automatically fallback between models:

```typescript
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'

const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Analyze this data...',
  
  // If GPT-4o fails, try Claude
  experimental_fallback: [
    anthropic('claude-3-5-sonnet-20241022')
  ],
})
```

---

### **5. Custom Middleware**

Add logging, rate limiting, caching:

```typescript
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai'

const loggedModel = wrapLanguageModel({
  model: openai('gpt-4o'),
  middleware: {
    transformParams: async ({ params }) => {
      console.log('Request:', params)
      return params
    },
    
    wrapGenerate: async ({ doGenerate, params }) => {
      const start = Date.now()
      const result = await doGenerate()
      const duration = Date.now() - start
      
      console.log('Generation took:', duration, 'ms')
      console.log('Tokens:', result.usage)
      
      return result
    },
  },
})

const result = await generateText({
  model: loggedModel,
  prompt: 'Hello world'
})
```

---

## 🎯 Real-World Agent Examples

### **Example 1: Code Review Agent**

```typescript
const codeReviewAgent = {
  tools: {
    lintCode: tool({
      description: 'Run ESLint on JavaScript/TypeScript code',
      parameters: z.object({ code: z.string() }),
      execute: async ({ code }) => {
        const workspace = await daytona.createWorkspace({ runtime: 'node' })
        await daytona.writeFile(workspace.id, '/app/code.js', code)
        const result = await daytona.executeCode(
          workspace.id,
          'npx eslint /app/code.js --format json',
          'javascript'
        )
        await daytona.deleteWorkspace(workspace.id)
        return JSON.parse(result.stdout)
      },
    }),
    
    securityScan: tool({
      description: 'Run security vulnerability scan',
      parameters: z.object({ code: z.string() }),
      execute: async ({ code }) => {
        // Run Snyk or similar
        return { vulnerabilities: [], score: 9.5 }
      },
    }),
    
    checkPerformance: tool({
      description: 'Analyze performance issues',
      parameters: z.object({ code: z.string() }),
      execute: async ({ code }) => {
        // Analyze complexity, memory usage, etc.
        return { issues: [], recommendations: [] }
      },
    }),
  },
}

const result = await generateText({
  model: openai('gpt-4o'),
  tools: codeReviewAgent.tools,
  maxSteps: 6,
  prompt: `Review this code:
${userCode}

Check for:
1. Linting errors
2. Security vulnerabilities
3. Performance issues
4. Best practices

Provide comprehensive feedback.`,
})
```

---

### **Example 2: Data Analysis Agent**

```typescript
const dataAnalysisAgent = {
  tools: {
    loadDataset: tool({
      description: 'Load CSV data',
      parameters: z.object({ url: z.string() }),
      execute: async ({ url }) => {
        const response = await fetch(url)
        const csv = await response.text()
        return Papa.parse(csv).data
      },
    }),
    
    runQuery: tool({
      description: 'Run SQL query on data',
      parameters: z.object({ 
        sql: z.string(),
        data: z.any(),
      }),
      execute: async ({ sql, data }) => {
        // Use Daytona to run Python pandas
        const workspace = await daytona.createWorkspace({ runtime: 'python' })
        await daytona.writeFile(workspace.id, '/app/data.csv', data)
        await daytona.writeFile(workspace.id, '/app/query.py', `
import pandas as pd
df = pd.read_csv('data.csv')
result = df.query('${sql}')
print(result.to_json())
        `)
        const result = await daytona.executeCode(workspace.id, 'python /app/query.py', 'python')
        await daytona.deleteWorkspace(workspace.id)
        return JSON.parse(result.stdout)
      },
    }),
    
    generateVisualization: tool({
      description: 'Create chart from data',
      parameters: z.object({ 
        data: z.any(),
        chartType: z.enum(['bar', 'line', 'scatter', 'pie']),
      }),
      execute: async ({ data, chartType }) => {
        // Generate chart (Matplotlib, Chart.js, etc.)
        return { chartUrl: '...', insights: [] }
      },
    }),
  },
}

const result = await generateText({
  model: openai('gpt-4o'),
  tools: dataAnalysisAgent.tools,
  maxSteps: 8,
  prompt: `Analyze this sales dataset:
${datasetUrl}

1. Load the data
2. Find top products
3. Analyze trends
4. Create visualizations
5. Provide insights`,
})
```

---

### **Example 3: Content Pipeline Agent**

```typescript
const contentPipelineAgent = {
  tools: {
    researchTopic: tool({
      description: 'Research a topic online',
      parameters: z.object({ topic: z.string() }),
      execute: async ({ topic }) => {
        const results = await searchAPI(topic)
        return results
      },
    }),
    
    extractKeyPoints: tool({
      description: 'Extract key points from text',
      parameters: z.object({ text: z.string() }),
      execute: async ({ text }) => {
        const { object } = await generateObject({
          model: openai('gpt-4o-mini'),
          schema: z.object({
            keyPoints: z.array(z.string()),
          }),
          prompt: `Extract key points from: ${text}`,
        })
        return object
      },
    }),
    
    generateSEO: tool({
      description: 'Generate SEO metadata',
      parameters: z.object({ content: z.string() }),
      execute: async ({ content }) => {
        const { object } = await generateObject({
          model: openai('gpt-4o-mini'),
          schema: z.object({
            title: z.string().max(60),
            description: z.string().max(160),
            keywords: z.array(z.string()),
          }),
          prompt: `Generate SEO for: ${content}`,
        })
        return object
      },
    }),
    
    checkGrammar: tool({
      description: 'Check grammar and style',
      parameters: z.object({ text: z.string() }),
      execute: async ({ text }) => {
        // Use LanguageTool API or similar
        return { errors: [], suggestions: [] }
      },
    }),
  },
}

const result = await generateText({
  model: openai('gpt-4o'),
  tools: contentPipelineAgent.tools,
  maxSteps: 10,
  prompt: `Create a blog post about: ${topic}

Pipeline:
1. Research the topic
2. Extract key points
3. Write the article
4. Check grammar
5. Generate SEO metadata
6. Polish and finalize`,
})
```

---

## 📦 Installation

```bash
npm install ai @ai-sdk/openai @ai-sdk/anthropic zod
```

---

## 🎯 Integration Checklist

### **Phase 1: Enable Tool Calling**
- [ ] Add `tool()` to existing agents
- [ ] Define 3-5 useful tools per agent
- [ ] Enable `maxSteps` for multi-step reasoning
- [ ] Log tool calls for debugging

### **Phase 2: Add Streaming**
- [ ] Replace `generateText` with `streamText` in chat routes
- [ ] Add `useChat()` hook in React components
- [ ] Stream tool calls to UI (show thinking process)

### **Phase 3: Multi-Modal**
- [ ] Add image upload to agents
- [ ] Use `gpt-4o` for vision tasks
- [ ] Process PDFs, diagrams, screenshots

### **Phase 4: Production Features**
- [ ] Model fallbacks (GPT-4o → Claude → Gemini)
- [ ] Custom middleware (logging, rate limiting)
- [ ] Caching expensive tool calls
- [ ] Error recovery (retry logic)

---

## 🚀 Quick Start: Upgrade Content Engine

Let's upgrade the existing Content Engine to use tools:

```typescript
// src/app/api/agents/content-engine/route.ts
import { generateText, tool } from 'ai'
import { z } from 'zod'

const contentTools = {
  checkSEO: tool({
    description: 'Check SEO quality of content',
    parameters: z.object({ content: z.string() }),
    execute: async ({ content }) => {
      // Analyze SEO
      return { score: 85, issues: [], suggestions: [] }
    },
  }),
  
  factCheck: tool({
    description: 'Verify factual claims',
    parameters: z.object({ claims: z.array(z.string()) }),
    execute: async ({ claims }) => {
      // Check facts against databases
      return claims.map(claim => ({
        claim,
        verified: true,
        confidence: 0.9,
      }))
    },
  }),
  
  optimizeReadability: tool({
    description: 'Check readability score',
    parameters: z.object({ text: z.string() }),
    execute: async ({ text }) => {
      // Calculate Flesch-Kincaid, etc.
      return { score: 60, level: 'High School', suggestions: [] }
    },
  }),
}

export async function POST(req: Request) {
  const { content, format, tone, userId } = await req.json()
  
  // Check credits, etc...
  
  const result = await generateText({
    model: openai('gpt-4o'),
    tools: contentTools,
    maxSteps: 5,
    prompt: `Transform this content into ${format} with ${tone} tone:
${content}

Use available tools to:
1. Check SEO
2. Verify facts
3. Optimize readability

Then generate polished content.`,
  })
  
  return NextResponse.json({
    content: result.text,
    steps: result.steps.map(s => ({
      type: s.stepType,
      toolCalls: s.toolCalls?.map(tc => tc.toolName),
    })),
    toolResults: result.toolResults,
  })
}
```

---

## 📊 Monitoring & Debugging

### **Log All Agent Activity**

```typescript
const result = await generateText({
  model: openai('gpt-4o'),
  tools: myTools,
  maxSteps: 5,
  prompt: '...',
  
  onStepFinish: (step) => {
    console.log('Step:', step.stepType)
    console.log('Text:', step.text)
    console.log('Tool Calls:', step.toolCalls)
    console.log('Tool Results:', step.toolResults)
  },
})

// Log to Firestore for analytics
await addDoc(collection(db, 'agent_logs'), {
  executionId,
  steps: result.steps.length,
  toolCalls: result.toolResults.length,
  duration: Date.now() - startTime,
  cost: calculateCost(result.usage),
})
```

---

## 🎯 Next Steps

1. **Deploy Research Engine** (already built)
2. **Add tool calling to Content Engine**
3. **Build streaming chat interface**
4. **Add multi-modal support**
5. **Create custom tools for your domain**

---

## 📚 Resources

- **Vercel AI SDK Docs:** https://sdk.vercel.ai/docs
- **Tool Calling Guide:** https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling
- **Streaming Guide:** https://sdk.vercel.ai/docs/ai-sdk-ui/streaming
- **Examples:** https://github.com/vercel/ai/tree/main/examples

---

**This is what Vercel AI SDK can do. Let's use it properly.** 🚀
