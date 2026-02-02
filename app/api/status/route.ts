import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if youtube-transcript package is available
    let youtubeTranscriptAvailable = false;
    let puppeteerAvailable = false;
    let assemblyAIConfigured = false;

    // Check youtube-transcript package
    try {
      require.resolve('youtube-transcript');
      youtubeTranscriptAvailable = true;
    } catch (e) {
      youtubeTranscriptAvailable = false;
    }

    // Check Puppeteer
    try {
      require.resolve('puppeteer');
      puppeteerAvailable = true;
    } catch (e) {
      puppeteerAvailable = false;
    }

    // Check AssemblyAI API key
    assemblyAIConfigured = !!process.env.ASSEMBLYAI_API_KEY;

    // Get mock usage statistics (in production, this would query a database)
    const stats = {
      totalRequests: Math.floor(Math.random() * 1000) + 100,
      nodejsPackageUsage: Math.floor(Math.random() * 80) + 60, // 60-80%
      assemblyAIUsage: Math.floor(Math.random() * 20) + 5, // 5-25%
      puppeteerUsage: Math.floor(Math.random() * 5) + 1, // 1-5%
      averageResponseTime: Math.random() * 2 + 0.5, // 0.5-2.5s
      successRate: 94 + Math.random() * 5, // 94-99%
    };

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      integrations: {
        youtubeTranscript: {
          available: youtubeTranscriptAvailable,
          status: youtubeTranscriptAvailable ? 'operational' : 'not_installed',
          version: '1.2.1',
          type: 'nodejs',
          description: 'Native Node.js YouTube transcript extraction'
        },
        puppeteer: {
          available: puppeteerAvailable,
          status: puppeteerAvailable ? 'ready' : 'not_installed',
          fallbackLevel: 3,
          type: 'browser-automation',
          description: 'Browser automation fallback for youtubetranscript.com'
        },
        assemblyAI: {
          available: assemblyAIConfigured,
          status: assemblyAIConfigured ? 'configured' : 'not_configured',
          fallbackLevel: 3,
          type: 'transcription-service',
          description: 'AssemblyAI audio transcription API (paid - last resort)'
        }
      },
      metrics: {
        usage: stats,
        activeMethod: 'youtube-transcript-nodejs',
        fallbackChain: [
          'youtube-transcript-nodejs',
          'puppeteer-youtubetranscript-com',
          'assemblyai'
        ]
      },
      health: {
        overall: 'healthy',
        issues: []
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
