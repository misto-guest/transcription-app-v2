#!/usr/bin/env python3
"""
YouTube Transcript Extractor
Automated script to extract transcripts from YouTube videos
"""

import sys
import json
import argparse
from datetime import datetime

sys.path.insert(0, '/Users/northsea/Library/Python/3.13/lib/python/site-packages')

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter, SRTFormatter

def extract_video_id(url_or_id):
    """Extract video ID from various YouTube URL formats"""
    import re

    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
        r'^([a-zA-Z0-9_-]{11})$'  # Direct video ID
    ]

    for pattern in patterns:
        match = re.search(pattern, url_or_id)
        if match:
            return match.group(1)

    raise ValueError(f"Could not extract video ID from: {url_or_id}")

def get_transcript(video_id, languages=None):
    """Fetch transcript from YouTube"""
    try:
        if languages:
            transcript = YouTubeTranscriptApi().fetch(video_id, languages=languages)
        else:
            transcript = YouTubeTranscriptApi().fetch(video_id)
        return transcript
    except Exception as e:
        raise Exception(f"Failed to fetch transcript: {e}")

def format_transcript(transcript, output_format='text'):
    """Format transcript in various formats"""
    if output_format == 'text':
        formatter = TextFormatter()
    elif output_format == 'srt':
        formatter = SRTFormatter()
    elif output_format == 'json':
        return json.dumps([{
            'text': entry.text,
            'start': entry.start,
            'duration': entry.duration
        } for entry in transcript], indent=2)
    else:
        raise ValueError(f"Unknown format: {output_format}")

    return formatter.format_transcript(transcript)

def save_transcript(text, output_file, video_id):
    """Save transcript to file"""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"✅ Saved {len(text)} characters to {output_file}")
    return len(text)

def main():
    parser = argparse.ArgumentParser(description='Extract YouTube video transcripts')
    parser.add_argument('url', help='YouTube URL or video ID')
    parser.add_argument('-o', '--output', help='Output file path')
    parser.add_argument('-f', '--format', choices=['text', 'srt', 'json'],
                       default='text', help='Output format')
    parser.add_argument('-l', '--languages', nargs='+', help='Language codes (e.g., en es)')

    args = parser.parse_args()

    try:
        # Extract video ID
        video_id = extract_video_id(args.url)
        print(f"📺 Video ID: {video_id}")

        # Fetch transcript
        print("⏳ Fetching transcript...")
        transcript = get_transcript(video_id, args.languages)

        # Format transcript
        text = format_transcript(transcript, args.format)

        # Determine output file
        if args.output:
            output_file = args.output
        else:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            ext = 'txt' if args.format == 'text' else args.format
            output_file = f'/tmp/transcript_{video_id}_{timestamp}.{ext}'

        # Save transcript
        save_transcript(text, output_file, video_id)

        # Print preview
        print(f"\n📝 Preview (first 500 chars):\n{text[:500]}...")

        return 0

    except Exception as e:
        print(f"❌ Error: {e}")
        return 1

if __name__ == '__main__':
    sys.exit(main())
