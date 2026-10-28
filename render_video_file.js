const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const htmlPath = 'file:///' + path.resolve(__dirname, 'video_presentation.html').replace(/\\/g, '/');
  const downloadDir = path.resolve(__dirname);

  console.log('Launching browser to record video...');
  const browser = await chromium.launch({
    executablePath,
    headless: true
  });

  const context = await browser.newContext({
    acceptDownloads: true
  });

  const page = await context.newPage();

  console.log('Opening player:', htmlPath);
  await page.goto(htmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  console.log('Triggering video export and download...');
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 60000 }),
    page.click('#downloadBtn')
  ]);

  const targetPath = path.join(downloadDir, 'smart_waste_management_presentation.webm');
  console.log('Saving video to:', targetPath);
  await download.saveAs(targetPath);

  await browser.close();

  const stats = fs.statSync(targetPath);
  console.log('Video generated successfully! Size:', stats.size, 'bytes');
})().catch(err => {
  console.error('Error generating video:', err);
  process.exit(1);
});
