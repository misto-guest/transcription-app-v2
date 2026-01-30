const { YoutubeTranscript } = require('youtube-transcript')

async function test() {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript('Cc6hPxJXREM')
    console.log('Transcript items:', transcript.length)
    console.log('First 3 items:', transcript.slice(0, 3))
    console.log('Full text:', transcript.map(t => t.text).join(' ').substring(0, 500))
  } catch (error) {
    console.error('Error:', error.message)
  }
}

test()
