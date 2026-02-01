import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)

interface HistoryItem {
  id: string
  date: string
  type: 'commit' | 'deployment' | 'documentation' | 'milestone'
  title: string
  description?: string
  author?: string
  commit?: string
  url?: string
  status?: 'success' | 'failed' | 'pending'
}

export async function GET() {
  const history: HistoryItem[] = []

  try {
    // Get git history
    const gitLog = await execAsync(
      'git log --all --pretty=format:"%H|%ai|%s|%an" -30',
      { cwd: process.cwd() }
    )

    const commits = gitLog.stdout.trim().split('\n')

    for (const commit of commits) {
      const [hash, date, message, author] = commit.split('|')

      // Skip if not a valid commit line
      if (!hash || !date) continue

      const type: HistoryItem['type'] = message.includes('feat:')
        ? 'milestone'
        : message.includes('fix:')
        ? 'commit'
        : message.includes('docs:')
        ? 'documentation'
        : 'commit'

      history.push({
        id: hash,
        date,
        type,
        title: message,
        author,
        commit: hash.substring(0, 7),
        url: `https://github.com/misto-guest/transcription-app-v2/commit/${hash}`,
      })
    }
  } catch (error) {
    console.error('Failed to fetch git history:', error)
  }

  // Read markdown documentation files for progress reports
  const docsDir = process.cwd()
  const docFiles = [
    'PROGRESS-REPORT.md',
    'README.md',
    'DEPLOYMENT.md',
    'AUTO-DEPLOY.md',
  ]

  for (const docFile of docFiles) {
    try {
      const filePath = path.join(docsDir, docFile)
      const content = await fs.readFile(filePath, 'utf-8')

      // Extract date from file if present (YYYY-MM-DD format)
      const dateMatch = content.match(/\*\*Date:\*\*\s*(\d{4}-\d{2}-\d{2})/)
      const date = dateMatch ? dateMatch[1] + 'T12:00:00Z' : new Date().toISOString()

      // Extract title/summary
      const titleMatch = content.match(/^#\s+(.+)$/m)
      const title = titleMatch ? titleMatch[1] : docFile.replace('.md', '').replace(/-/g, ' ')

      // Extract first paragraph as description
      const descMatch = content.match(/\*\*Date:\*\*[\s\S]*?\n\n([^\n]+)/)
      const description = descMatch ? descMatch[1].trim() : ''

      history.push({
        id: `doc-${docFile}`,
        date,
        type: 'documentation',
        title: `📄 ${title}`,
        description: description.substring(0, 200),
        url: `https://github.com/misto-guest/transcription-app-v2/blob/main/${docFile}`,
      })
    } catch (error) {
      // File might not exist, skip
    }
  }

  // Add deployment milestones
  const deployments: HistoryItem[] = [
    {
      id: 'deploy-initial',
      date: '2026-01-20T00:00:00Z',
      type: 'milestone',
      title: '🚀 Initial MVP Deployment',
      description: 'First deployment of Transcription App to Vercel',
      url: 'https://transcription-app-woad.vercel.app',
      status: 'success',
    },
    {
      id: 'deploy-ssh',
      date: '2026-01-25T00:00:00Z',
      type: 'milestone',
      title: '🔐 SSH Access Setup Complete',
      description: 'Multi-user SSH access and security hardening',
      status: 'success',
    },
    {
      id: 'deploy-fix',
      date: '2026-01-30T13:45:00Z',
      type: 'milestone',
      title: '🔧 Vercel Filesystem Fix',
      description: 'Fixed /var/task/temp error by using /tmp directory',
      url: 'https://github.com/misto-guest/transcription-app-v2/commit/87ac8ff',
      status: 'success',
    },
    {
      id: 'deploy-status',
      date: new Date().toISOString(),
      type: 'milestone',
      title: '📊 Status Page Launched',
      description: 'Public status page with automatic history tracking',
      url: 'https://transcription-app-woad.vercel.app/status',
      status: 'success',
    },
  ]

  history.push(...deployments)

  // Sort by date (newest first)
  history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return NextResponse.json({
    history,
    meta: {
      total: history.length,
      lastUpdated: new Date().toISOString(),
      repository: 'https://github.com/misto-guest/transcription-app-v2',
    },
  })
}
