#!/usr/bin/env node
/**
 * Puppeteer Automation for YouTube Transcript
 * Fallback method when YouTube Transcript API is depleted
 * Uses youtubetranscript.com web tool
 */

const puppeteer = require('puppeteer');

async function getTranscriptFromWebsite(videoUrl) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Navigate to youtubetranscript.com
    console.log('Navigating to youtubetranscript.com...');
    await page.goto('https://youtubetranscript.com/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for the input field to be available
    await page.waitForSelector('input[type="text"], textarea, input[placeholder*="YouTube"], input[placeholder*="URL"]', {
      timeout: 10000
    });

    // Find and fill the input field
    const inputSelector = await page.evaluate(() => {
      const selectors = [
        'input[type="text"]',
        'textarea',
        'input[placeholder*="YouTube" i]',
        'input[placeholder*="URL" i]',
        '#url-input',
        '.url-input'
      ];

      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          return selector;
        }
      }
      return null;
    });

    if (!inputSelector) {
      throw new Error('Could not find input field on the page');
    }

    console.log('Entering YouTube URL...');
    await page.type(inputSelector, videoUrl);

    // Find and click the submit button
    const submitButton = await page.evaluate(() => {
      const selectors = [
        'button[type="submit"]',
        'button:contains("Get")',
        'button:contains("Extract")',
        'button:contains("Download")',
        '.submit-button',
        '#get-transcript'
      ];

      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          return true;
        }
      }

      // Look for any button
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.length > 0;
    });

    if (submitButton) {
      // Try to click the button
      try {
        await page.click('button[type="submit"], button:contains("Get"), button:contains("Extract"), .submit-button, #get-transcript, button');
      } catch (e) {
        // If clicking fails, try pressing Enter
        await page.keyboard.press('Enter');
      }
    }

    // Wait for the transcript to appear
    console.log('Waiting for transcript...');
    await page.waitForSelector('.transcript, .transcript-text, #transcript, .content, .result', {
      timeout: 30000
    });

    // Extract the transcript text
    const transcript = await page.evaluate(() => {
      const selectors = [
        '.transcript',
        '.transcript-text',
        '#transcript',
        '.content',
        '.result',
        'pre',
        'code'
      ];

      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim()) {
          return element.textContent.trim();
        }
      }

      return null;
    });

    if (!transcript) {
      throw new Error('Could not extract transcript from page');
    }

    console.log('Successfully extracted transcript!');
    return transcript;

  } finally {
    await browser.close();
  }
}

// CLI interface
if (require.main === module) {
  const videoUrl = process.argv[2];

  if (!videoUrl) {
    console.error('Usage: node puppeteer-youtube-transcript.js <YouTube URL>');
    process.exit(1);
  }

  getTranscriptFromWebsite(videoUrl)
    .then(transcript => {
      console.log('\n=== TRANSCRIPT ===');
      console.log(transcript);
      console.log('\n=== END ===');
    })
    .catch(error => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}

module.exports = { getTranscriptFromWebsite };
