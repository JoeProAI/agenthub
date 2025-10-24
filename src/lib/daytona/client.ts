// Daytona.io Client for Cloud Development Environments
// https://www.daytona.io/

interface DaytonaWorkspace {
  id: string
  name: string
  status: 'starting' | 'running' | 'stopped'
  url: string
}

interface ExecutionResult {
  stdout: string
  stderr: string
  exitCode: number
  duration: number
}

class DaytonaClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.DAYTONA_API_KEY || ''
    this.baseUrl = process.env.DAYTONA_API_URL || 'https://api.daytona.io'
  }

  /**
   * Create a new workspace with specific runtime
   */
  async createWorkspace(config: {
    name: string
    runtime: 'node' | 'python' | 'go' | 'rust'
    ttl?: number // Time to live in seconds
  }): Promise<DaytonaWorkspace> {
    const response = await fetch(`${this.baseUrl}/workspaces`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: config.name,
        image: this.getRuntimeImage(config.runtime),
        ttl: config.ttl || 3600, // Default 1 hour
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create workspace: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Execute code in a workspace
   */
  async executeCode(workspaceId: string, code: string, language: string): Promise<ExecutionResult> {
    const startTime = Date.now()
    
    const response = await fetch(`${this.baseUrl}/workspaces/${workspaceId}/exec`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        command: this.getExecutionCommand(code, language),
        timeout: 30000, // 30 second timeout
      }),
    })

    if (!response.ok) {
      throw new Error(`Execution failed: ${response.statusText}`)
    }

    const result = await response.json()
    
    return {
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      exitCode: result.exitCode || 0,
      duration: Date.now() - startTime,
    }
  }

  /**
   * Write a file to the workspace
   */
  async writeFile(workspaceId: string, path: string, content: string): Promise<void> {
    await fetch(`${this.baseUrl}/workspaces/${workspaceId}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path, content }),
    })
  }

  /**
   * Read a file from the workspace
   */
  async readFile(workspaceId: string, path: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/workspaces/${workspaceId}/files/${encodeURIComponent(path)}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to read file: ${response.statusText}`)
    }

    const data = await response.json()
    return data.content
  }

  /**
   * Delete a workspace
   */
  async deleteWorkspace(workspaceId: string): Promise<void> {
    await fetch(`${this.baseUrl}/workspaces/${workspaceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    })
  }

  private getRuntimeImage(runtime: string): string {
    const images = {
      node: 'node:20-alpine',
      python: 'python:3.11-slim',
      go: 'golang:1.21-alpine',
      rust: 'rust:1.75-slim',
    }
    return images[runtime as keyof typeof images] || images.node
  }

  private getExecutionCommand(code: string, language: string): string[] {
    const commands: Record<string, string[]> = {
      javascript: ['node', '-e', code],
      python: ['python3', '-c', code],
      go: ['go', 'run', '-'],
      rust: ['rustc', '-', '-o', '/tmp/out', '&&', '/tmp/out'],
    }
    return commands[language] || ['sh', '-c', code]
  }
}

// Singleton instance
let daytonaClient: DaytonaClient | null = null

export function getDaytonaClient(): DaytonaClient {
  if (!daytonaClient) {
    daytonaClient = new DaytonaClient()
  }
  return daytonaClient
}

export type { DaytonaWorkspace, ExecutionResult }
