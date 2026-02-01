import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const runtime = {
      agent: process.env.AGENT_ID || 'dmitry',
      host: process.env.VERCEL_URL || 'local',
      os: process.platform,
      node: process.version,
      repo: '/Users/northsea/clawd-dmitry/transcription-app',
      model: 'zai/glm-4.7',
      default_model: 'zai/glm-4.7',
      channel: 'telegram',
      capabilities: ['inlineButtons'],
      thinking: process.env.THINKING || 'off'
    };

    return NextResponse.json({
      agent: runtime.agent,
      status: 'operational',
      model: runtime.model,
      runtime,
      capabilities: runtime.capabilities,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to fetch status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
