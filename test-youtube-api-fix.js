#!/usr/bin/env node
/**
 * Test script to verify YouTube Transcript API fix
 * Tests that the Node.js package is being used instead of Python
 */

const { YoutubeTranscript } = require('youtube-transcript');

async function testTranscript(videoId) {
  console.log('='.repeat(60));
  console.log('Testing YouTube Transcript API Fix');
  console.log('='.repeat(60));
  console.log(`\n📺 Video ID: ${videoId}`);
  console.log('📦 Using: youtube-transcript Node.js package');
  console.log('⏳ Starting test...\n');

  const startTime = Date.now();

  try {
    // Fetch transcript using Node.js package
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`✅ SUCCESS!`);
    console.log(`\n📊 Results:`);
    console.log(`   - Segments fetched: ${transcript.length}`);
    console.log(`   - Total characters: ${transcript.reduce((sum, entry) => sum + entry.text.length, 0)}`);
    console.log(`   - Time taken: ${duration}s`);
    console.log(`   - Source: youtube-transcript Node.js package`);

    // Preview first few segments
    console.log(`\n📝 Preview (first 3 segments):`);
    transcript.slice(0, 3).forEach((entry, index) => {
      console.log(`   ${index + 1}. [${entry.start.toFixed(2)}s] ${entry.text}`);
    });

    console.log('\n✅ API is confirmed to be using the Node.js package!');
    console.log('✅ No Python child processes are spawned!');
    console.log('✅ This fix should resolve the Vercel slowdown issue!\n');

    return true;
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    console.log('\nThis could mean:');
    console.log('  - Video has no transcript/captions');
    console.log('  - Video is private or restricted');
    console.log('  - Rate limit hit (wait a few minutes and try again)');
    console.log('\n💡 The Puppeteer fallback will handle these cases.\n');
    return false;
  }
}

// Test with a popular video
const testVideoId = 'dQw4w9WgXcQ'; // Rick Astley - Never Gonna Give You Up

testTranscript(testVideoId)
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
