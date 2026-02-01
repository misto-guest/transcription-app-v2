import { NextRequest, NextResponse } from 'next/server';

// Podcast Index API integration
async function getPodcastFromSpotify(spotifyUrl: string) {
  try {
    // Extract Spotify episode/show ID
    const episodeMatch = spotifyUrl.match(/spotify\.com\/episode\/([a-zA-Z0-9]+)/);
    const showMatch = spotifyUrl.match(/spotify\.com\/show\/([a-zA-Z0-9]+)/);

    if (!episodeMatch && !showMatch) {
      throw new Error('Invalid Spotify URL format');
    }

    const spotifyId = episodeMatch ? episodeMatch[1] : showMatch[1];

    // Use Listen Notes API (has Spotify integration)
    const listenNotesApiKey = process.env.LISTENNOTES_API_KEY;

    if (!listenNotesApiKey) {
      throw new Error('Listen Notes API key not configured');
    }

    // First, try to search for the podcast by Spotify ID
    const searchResponse = await fetch(
      `https://listen-api.listennotes.com/api/v2/search?` +
      new URLSearchParams({
        q: spotifyUrl,
        type: 'episodes',
        offset: '0',
        language: 'English'
      }),
      {
        headers: {
          'X-ListenAPI-Key': listenNotesApiKey
        }
      }
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to search Listen Notes');
    }

    const searchData = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) {
      throw new Error('Podcast episode not found');
    }

    const episode = searchData.results[0];

    return {
      title: episode.title_original,
      audio: episode.audio,
      podcast: episode.podcast_title_original,
      thumbnail: episode.thumbnail,
      transcript: episode.transcript || null,
      listenNotesId: episode.id
    };

  } catch (error) {
    throw new Error(`Podcast API failed: ${error}`);
  }
}

// Fallback: Try to extract audio from Spotify using yt-dlp alternative
async function downloadSpotifyAudio(spotifyUrl: string): Promise<Buffer> {
  const { spawn } = require('child_process');
  const fs = require('fs');
  const path = require('path');

  return new Promise((resolve, reject) => {
    const tempFile = `/tmp/spotify_${Date.now()}.mp3`;

    // Use spotdl to download (already installed)
    const spotdl = spawn('spotdl', [
      'download',
      '--output', tempFile,
      spotifyUrl
    ]);

    let stderr = '';

    spotdl.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    spotdl.on('close', async (code: number) => {
      if (code !== 0) {
        reject(new Error(`spotdl failed: ${stderr}`));
        return;
      }

      try {
        const buffer = fs.readFileSync(tempFile);
        fs.unlinkSync(tempFile); // Cleanup
        resolve(buffer);
      } catch (e) {
        reject(new Error('Failed to read audio file'));
      }
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      spotdl.kill();
      reject(new Error('Download timeout'));
    }, 300000);
  });
}

// AssemblyAI transcription
async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  const FormData = require('form-data');

  // Upload to AssemblyAI
  const uploadForm = new FormData();
  uploadForm.append('file', audioBuffer, {
    filename: 'audio.mp3',
    contentType: 'audio/mpeg'
  });

  const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: {
      'Authorization': process.env.ASSEMBLYAI_API_KEY!,
    },
    body: uploadForm as any,
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload audio');
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
  let attempts = 0;
  while (attempts < 60) {
    await new Promise(resolve => setTimeout(resolve, 3000));

    const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
      headers: {
        'Authorization': process.env.ASSEMBLYAI_API_KEY!,
      },
    });

    const transcript = await statusResponse.json();

    if (transcript.status === 'completed') {
      return transcript.text;
    }

    if (transcript.status === 'error') {
      throw new Error(`Transcription error: ${transcript.error}`);
    }

    attempts++;
  }

  throw new Error('Transcription timeout');
}

// Generate 10 key takeaways
async function generateKeyTakeaways(transcript: string, podcastTitle: string): Promise<string> {
  try {
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
            content: `You are an expert at extracting actionable insights from podcast transcripts. Generate exactly 10 key takeaways that are:

1. **Specific and actionable** - Clear steps the reader can implement
2. **Practical** - Can be applied to real-world workflows immediately
3. **Concise** - Each takeaway should be 1-2 sentences max
4. **Prioritized** - Most important insights first

Format each takeaway as:
**#. [Title]** - Clear, actionable description

For podcast: "${podcastTitle}"

Generate exactly 10 takeaways. No intro, no outro, just the numbered list.`
          },
          {
            role: 'user',
            content: `Please analyze this podcast transcript and generate 10 key takeaways:\n\n${transcript.slice(0, 15000)}`
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

    // Validate Spotify URL
    if (!url.includes('spotify.com')) {
      return NextResponse.json({
        error: 'Invalid Spotify URL',
        note: 'Please provide a valid Spotify URL (episode or show)'
      }, { status: 400 });
    }

    let transcript = '';
    let source = '';
    let metadata: any = {};
    let audioUsed = false;

    // Method 1: Try Podcast Index / Listen Notes API
    try {
      console.log('Attempting Podcast API...');
      const podcastData = await getPodcastFromSpotify(url);

      if (podcastData.transcript) {
        // Has built-in transcript!
        transcript = podcastData.transcript;
        source = 'podcast-api-transcript';
        metadata = {
          title: podcastData.title,
          podcast: podcastData.podcast,
          thumbnail: podcastData.thumbnail
        };
      } else {
        // Download audio and transcribe
        console.log('No transcript found, downloading audio...');
        const audioBuffer = await downloadSpotifyAudio(url);
        transcript = await transcribeAudio(audioBuffer);
        source = 'assemblyai';
        audioUsed = true;
        metadata = {
          title: podcastData.title,
          podcast: podcastData.podcast,
          thumbnail: podcastData.thumbnail
        };
      }
    } catch (error) {
      console.error('Podcast API failed:', error);

      // Method 2: Direct download with spotdl
      try {
        console.log('Falling back to direct download...');
        const audioBuffer = await downloadSpotifyAudio(url);
        transcript = await transcribeAudio(audioBuffer);
        source = 'assemblyai-fallback';
        audioUsed = true;
      } catch (error2) {
        console.error('Download also failed:', error2);

        return NextResponse.json({
          error: 'Failed to process Spotify URL',
          note: 'Unable to download audio or find transcript. Episode may be DRM-protected or region-locked.',
          details: 'Try using the "Upload File" tab with a manually recorded version.',
          allMethodsFailed: true,
        }, { status: 400 });
      }
    }

    // Generate key takeaways
    console.log('Generating key takeaways...');
    const takeaways = await generateKeyTakeaways(transcript, metadata.title || 'Spotify Episode');

    return NextResponse.json({
      success: true,
      transcript,
      takeaways,
      source,
      audioUsed,
      metadata,
      stats: {
        characters: transcript.length,
        words: transcript.split(/\s+/).length,
      },
    });

  } catch (error) {
    console.error('Spotify API error:', error);
    return NextResponse.json({
      error: 'Failed to process Spotify URL',
      note: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
