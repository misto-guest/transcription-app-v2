import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get git commit info
    const { execSync } = require('child_process')
    const commit = execSync('git log -1 --pretty=%H', { cwd: process.cwd() }).toString().trim()
    const commitMessage = execSync('git log -1 --pretty=%s', { cwd: process.cwd() }).toString().trim()
    const commitTime = execSync('git log -1 --pretty=%ct', { cwd: process.cwd() }).toString().trim()

    return NextResponse.json({
      deploy: {
        deployedAt: new Date(parseInt(commitTime) * 1000).toISOString(),
        commit: commit,
        message: commitMessage,
        environment: process.env.VERCEL_ENV || 'development',
        region: process.env.VERCEL_REGION || 'unknown'
      }
    })
  } catch (error) {
    // Fallback if git commands fail (e.g., in production)
    return NextResponse.json({
      deploy: {
        deployedAt: new Date().toISOString(),
        commit: 'unknown',
        message: 'Production deployment',
        environment: process.env.VERCEL_ENV || 'production',
        region: process.env.VERCEL_REGION || 'unknown'
      }
    })
  }
}
