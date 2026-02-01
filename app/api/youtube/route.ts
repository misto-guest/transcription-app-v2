import { NextRequest, NextResponse } from 'next/server';

// YouTube transcript API integration
async function getYouTubeTranscript(videoId: string): Promise<{ text: string; source: string }> {
  try {
    // Call our Python script
    const { spawn } = require('child_process');
    const scriptPath = '/Users/northsea/clawd-dmitry/transcription-app/scripts/youtube_transcript.py';

    return new Promise((resolve, reject) => {
      const python = spawn('python3', [scriptPath, `https://www.youtube.com/watch?v=${videoId}`, '-f', 'json']);
      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      python.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      python.on('close', (code: number) => {
        if (code !== 0) {
          reject(new Error(`Python script failed: ${stderr}`));
          return;
        }

        try {
          const transcriptData = JSON.parse(stdout);
          const text = transcriptData.map((entry: any) => entry.text).join(' ');
          resolve({ text, source: 'youtube-transcript-api' });
        } catch (e) {
          reject(new Error('Failed to parse transcript output'));
        }
      });

      // Timeout after 60 seconds
      setTimeout(() => {
        python.kill();
        reject(new Error('Transcript extraction timeout'));
      }, 60000);
    });
  } catch (error) {
    throw new Error(`YouTube transcript extraction failed: ${error}`);
  }
}

// AssemblyAI fallback (original method)
async function getAssemblyAITranscript(videoUrl: string): Promise<{ text: string; source: string }> {
  try {
    const ytDlp = require('yt-dlp-exec');
    const fs = require('fs');
    const path = require('path');
    const { exec } = require('child_process');

    // Download audio
    const audioPath = `/tmp/audio_${Date.now()}.mp3`;
    await ytDlp(videoUrl, {
      extractAudio: true,
      audioFormat: 'mp3',
      output: audioPath,
    });

    // Upload to AssemblyAI
    const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'Authorization': process.env.ASSEMBLYAI_API_KEY!,
      },
      body: fs.createReadStream(audioPath),
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload audio to AssemblyAI');
    }

    const { upload_url } = await uploadResponse.json();

    // Transcribe
    const transcribeResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': process.env.ASSEMBLYAI_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: upload_url,
      }),
    });

    if (!transcribeResponse.ok) {
      throw new Error('Failed to start transcription');
    }

    const { id } = await transcribeResponse.json();

    // Poll for completion
    let transcript = null;
    let attempts = 0;
    while (attempts < 60) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
        headers: {
          'Authorization': process.env.ASSEMBLYAI_API_KEY!,
        },
      });

      transcript = await statusResponse.json();

      if (transcript.status === 'completed') {
        // Cleanup
        fs.unlinkSync(audioPath);

        return { text: transcript.text, source: 'assemblyai' };
      }

      if (transcript.status === 'error') {
        throw new Error(`AssemblyAI error: ${transcript.error}`);
      }

      attempts++;
    }

    throw new Error('Transcription timeout');

  } catch (error) {
    throw new Error(`AssemblyAI fallback failed: ${error}`);
  }
}

// Generate 10 key takeaways using AI
async function generateKeyTakeaways(transcript: string): Promise<string> {
  try {
    // Use OpenRouter API with zai/glm-4.7
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'zai/glm-4.7',
        messages: [
          {
            role: 'system',
            content: `You are an expert at extracting actionable insights from video transcripts. Your task is to analyze the transcript and generate exactly 10 key takeaways that are:

1. **Specific and actionable** - Clear steps the reader can implement
2. **Practical** - Can be applied to real-world workflows immediately
3. **Concise** - Each takeaway should be 1-2 sentences max
4. **Prioritized** - Most important insights first

Format each takeaway as:
**#. [Title]** - Actionable description

Example:
**1. Automate Repetitive Tasks** - Use AI agents to handle routine operations like email management and scheduling, freeing up time for high-value work.

Generate exactly 10 takeaways. No intro, no outro, just the numbered list.`
          },
          {
            role: 'user',
            content: `Please analyze this transcript and generate 10 key takeaways:\n\n${transcript.slice(0, 15000)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate takeaways');
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error('Failed to generate takeaways:', error);
    return '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Extract video ID
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (!videoIdMatch) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    const videoId = videoIdMatch[1];
    let transcript = '';
    let source = '';
    let fallbackUsed = false;

    // Method 1: Try YouTube Transcript API (fast, free)
    try {
      console.log('Attempting YouTube transcript API...');
      const result = await getYouTubeTranscript(videoId);
      transcript = result.text;
      source = result.source;
      console.log('YouTube transcript API succeeded!');
    } catch (error) {
      console.error('YouTube transcript API failed:', error);
      fallbackUsed = true;

      // Method 2: Fallback to AssemblyAI
      try {
        console.log('Falling back to AssemblyAI...');
        const result = await getAssemblyAITranscript(url);
        transcript = result.text;
        source = result.source;
        console.log('AssemblyAI succeeded!');
      } catch (error2) {
        console.error('AssemblyAI also failed:', error2);

        return NextResponse.json({
          error: 'Failed to extract transcript',
          note: 'No transcript available on YouTube. Video may not have captions, or access is restricted.',
          details: 'YouTube transcript API not available. Audio download/transcription failed.',
          fallbackAttempted: true,
          allMethodsFailed: true,
        }, { status: 400 });
      }
    }

    // Generate key takeaways
    console.log('Generating key takeaways...');
    const takeaways = await generateKeyTakeaways(transcript);

    return NextResponse.json({
      success: true,
      transcript,
      takeaways,
      source,
      fallbackUsed,
      videoId,
      stats: {
        characters: transcript.length,
        words: transcript.split(/\s+/).length,
      },
    });

  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json({
      error: 'Failed to process video',
      note: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
