const { YoutubeTranscript } = require('youtube-transcript')

async function test(url) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(url)
    console.log(`URL: ${url}`)
    console.log('Transcript items:', transcript.length)
    if (transcript.length > 0) {
      console.log('Full text (first 500 chars):', transcript.map(t => t.text).join(' ').substring(0, 500))
    }
    console.log('---')
  } catch (error) {
    console.error(`Error for ${url}:`, error.message)
    console.log('---')
  }
}

// Test the original URL
test('Cc6hPxJXREM')

// Test with a common TED talk that should have subtitles
test('https://www.youtube.com/watch?v=tgbNymZ7vqY')
