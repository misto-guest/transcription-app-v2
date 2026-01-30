#!/usr/bin/env node

/**
 * QA Test Script for Transcription App
 * Tests all three endpoints: YouTube, Spotify, and Upload
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3000'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function section(title) {
  console.log('\n' + '='.repeat(60))
  log(title, 'cyan')
  console.log('='.repeat(60))
}

async function testEndpoint(name, endpoint, testData) {
  log(`\n🧪 Testing: ${name}`, 'yellow')
  log(`   Endpoint: ${endpoint}`, 'blue')

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: testData.method || 'POST',
      headers: testData.headers || {},
      body: testData.body ? JSON.stringify(testData.body) : undefined
    })

    const result = await response.json()

    if (response.ok && !result.error) {
      log(`   ✅ PASS`, 'green')
      log(`   Status: ${response.status}`, 'blue')
      if (result.transcript) {
        log(`   Transcript preview: ${result.transcript.substring(0, 100)}...`, 'blue')
      }
      if (result.status) {
        log(`   Status: ${result.status}`, 'blue')
        log(`   Configured: ${result.configured}`, 'blue')
      }
      return { success: true, result }
    } else {
      log(`   ❌ FAIL`, 'red')
      log(`   Status: ${response.status}`, 'red')
      log(`   Error: ${result.error || 'Unknown error'}`, 'red')
      return { success: false, error: result.error }
    }
  } catch (error) {
    log(`   ❌ FAIL`, 'red')
    log(`   Error: ${error.message}`, 'red')
    return { success: false, error: error.message }
  }
}

async function runTests() {
  section('TRANSCRIPTION APP QA TEST SUITE')
  log(`API Base: ${API_BASE}`, 'blue')
  log(`Started: ${new Date().toISOString()}`, 'blue')

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  }

  // Test 1: Upload API Status Check
  section('TEST 1: Upload API Status')
  const test1 = await testEndpoint(
    'Upload API Health Check',
    '/api/upload',
    { method: 'GET' }
  )
  results.tests.push({ name: 'Upload API Health', ...test1 })
  if (test1.success) results.passed++
  else results.failed++

  // Test 2: YouTube URL Validation (invalid URL)
  section('TEST 2: YouTube URL Validation')
  const test2 = await testEndpoint(
    'YouTube Invalid URL',
    '/api/youtube',
    {
      headers: { 'Content-Type': 'application/json' },
      body: { url: 'not-a-valid-url' }
    }
  )
  results.tests.push({ name: 'YouTube URL Validation', ...test2 })
  if (!test2.success && test2.error?.includes('Invalid YouTube URL')) {
    log('   ✅ Validation working correctly', 'green')
    results.passed++
  } else {
    log('   ❌ Validation not working', 'red')
    results.failed++
  }

  // Test 3: YouTube URL Validation (valid format - will fail at download)
  section('TEST 3: YouTube Valid URL Format')
  const test3 = await testEndpoint(
    'YouTube Valid URL Format',
    '/api/youtube',
    {
      headers: { 'Content-Type': 'application/json' },
      body: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
    }
  )
  results.tests.push({ name: 'YouTube URL Format', ...test3 })
  // This might fail at download/transcription, but URL should be valid
  if (test3.error && !test3.error.includes('Invalid YouTube URL')) {
    log('   ✅ URL format accepted (may fail at download)', 'green')
    results.passed++
  } else if (test3.success) {
    log('   ✅ Full transcription successful!', 'green')
    results.passed++
  } else {
    log('   ❌ Unexpected behavior', 'red')
    results.failed++
  }

  // Test 4: Spotify URL Validation
  section('TEST 4: Spotify URL Validation')
  const test4 = await testEndpoint(
    'Spotify Invalid URL',
    '/api/spotify',
    {
      headers: { 'Content-Type': 'application/json' },
      body: { url: 'not-a-spotify-url' }
    }
  )
  results.tests.push({ name: 'Spotify URL Validation', ...test4 })
  if (!test4.success) {
    log('   ✅ Validation working (rejects invalid URLs)', 'green')
    results.passed++
  } else {
    log('   ❌ Should reject invalid URLs', 'red')
    results.failed++
  }

  // Test 5: Upload Missing File
  section('TEST 5: Upload Validation')
  const test5 = await testEndpoint(
    'Upload Missing File',
    '/api/upload',
    { method: 'POST' }
  )
  results.tests.push({ name: 'Upload File Required', ...test5 })
  if (!test5.success && test5.error?.includes('No audio file')) {
    log('   ✅ Validation working correctly', 'green')
    results.passed++
  } else {
    log('   ❌ Should require file', 'red')
    results.failed++
  }

  // Summary
  section('TEST SUMMARY')
  log(`Total Tests: ${results.tests.length}`, 'blue')
  log(`Passed: ${results.passed}`, 'green')
  log(`Failed: ${results.failed}`, 'red')
  log(`Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%`, 'blue')

  // Detailed Results
  console.log('\n📋 Detailed Results:')
  results.tests.forEach((test, i) => {
    log(`\n${i + 1}. ${test.name}`, test.success ? 'green' : 'red')
    if (test.error) log(`   Error: ${test.error}`, 'red')
    if (test.result) log(`   Result: ${JSON.stringify(test.result).substring(0, 100)}...`, 'blue')
  })

  process.exit(results.failed > 0 ? 1 : 0)
}

// Run tests
runTests().catch(error => {
  log(`\n💥 Test suite crashed: ${error.message}`, 'red')
  console.error(error)
  process.exit(1)
})
