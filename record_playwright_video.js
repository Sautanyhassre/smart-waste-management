const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const htmlPath = 'file:///' + path.resolve(__dirname, 'video_presentation.html').replace(/\\/g, '/');
  const targetVideoPath = path.join(__dirname, 'smart_waste_management_presentation.webm');

  console.log('Launching Chrome in headless mode with video recording...');
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ['--disable-web-security', '--allow-file-access-from-files']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: __dirname,
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();
  console.log('Opening player:', htmlPath);
  await page.goto(htmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click Play to start the animated 6-scene presentation
  console.log('Starting automated video playback across all 6 scenes...');
  await page.click('#playBtn');

  // Let it play for 31 seconds to capture all 6 scenes (5s each)
  const totalPlayTimeMs = 31000;
  const start = Date.now();
  while (Date.now() - start < totalPlayTimeMs) {
    const elapsed = Math.round((Date.now() - start) / 1000);
    process.stdout.write(`\rRecording scene progress: ${elapsed}s / 31s...`);
    await page.waitForTimeout(2000);
  }
  console.log('\nPlayback finished. Closing browser to finalize video file...');

  // Closing page flushes the recorded video file
  const videoObj = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (videoObj) {
    const rawVideoPath = await videoObj.path();
    console.log('Raw video captured at:', rawVideoPath);
    if (fs.existsSync(targetVideoPath)) {
      try { fs.unlinkSync(targetVideoPath); } catch (e) {}
    }
    fs.copyFileSync(rawVideoPath, targetVideoPath);
    const stat = fs.statSync(targetVideoPath);
    console.log(`SUCCESS: Video saved to ${targetVideoPath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
  } else {
    console.error('No video object returned by Playwright context');
  }
})().catch(err => {
  console.error('Error during recording:', err);
  process.exit(1);
});
