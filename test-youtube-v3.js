const { YoutubeTranscript } = require('youtube-transcript')

async function test(url) {
  try {
    console.log(`\n=== Testing: ${url} ===`)
    const transcript = await YoutubeTranscript.fetchTranscript(url, { lang: 'en' })
    console.log('Success! Transcript items:', transcript.length)

    if (transcript.length > 0) {
      console.log('\nSample transcript (first 300 chars):')
      console.log(transcript.map(t => t.text).join(' ').substring(0, 300))
    } else {
      console.log('No transcript available for this video.')
    }
  } catch (error) {
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
  }
}

// Test the original URL
test('Cc6hPxJXREM')

// Also try with a video known to have captions
test('https://www.youtube.com/watch?v=jNQXAC9IVRw')  // "Me at the zoo" - first YouTube video
