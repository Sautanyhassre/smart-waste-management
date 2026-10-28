const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const outputDir = 'C:\\Users\\Balaji.g\\.gemini\\antigravity\\brain\\09fe82e8-9dd6-4e97-954d-42f66658d757';
  const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  console.log('Launching browser...');
  const browser = await chromium.launch({
    executablePath,
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  console.log('1. Navigating to Login Page...');
  await page.goto('https://smart-waste-management-ruddy.vercel.app/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const loginPath = path.join(outputDir, 'app_01_login_page.png');
  await page.screenshot({ path: loginPath, fullPage: true });
  console.log('Saved: ' + loginPath);

  // 2. Click Admin Demo Login
  console.log('2. Clicking Admin Demo Login button...');
  await page.click('button:has-text("Admin")');
  await page.waitForTimeout(3000);

  // 3. Screenshot Administrator Dashboard
  console.log('3. Capturing Dashboard...');
  const dashPath = path.join(outputDir, 'app_02_admin_dashboard.png');
  await page.screenshot({ path: dashPath, fullPage: false });
  console.log('Saved: ' + dashPath);

  // 4. Navigate to Complaints page
  console.log('4. Navigating to Complaints page...');
  await page.goto('https://smart-waste-management-ruddy.vercel.app/complaints', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const complaintFormPath = path.join(outputDir, 'app_03_complaint_form.png');
  await page.screenshot({ path: complaintFormPath, fullPage: true });
  console.log('Saved: ' + complaintFormPath);

  // 5. Click Complaint Log Tab
  console.log('5. Clicking Complaint Log Tab...');
  await page.click('button:has-text("Complaint Log")');
  await page.waitForTimeout(1500);
  const complaintLogPath = path.join(outputDir, 'app_04_complaint_log.png');
  await page.screenshot({ path: complaintLogPath, fullPage: true });
  console.log('Saved: ' + complaintLogPath);

  // 6. Navigate to Collections page
  console.log('6. Navigating to Collections page...');
  await page.goto('https://smart-waste-management-ruddy.vercel.app/collections', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const collectionsPath = path.join(outputDir, 'app_05_collections_management.png');
  await page.screenshot({ path: collectionsPath, fullPage: true });
  console.log('Saved: ' + collectionsPath);

  // 7. Navigate to Bin Monitoring page
  console.log('7. Navigating to Monitoring page...');
  await page.goto('https://smart-waste-management-ruddy.vercel.app/monitoring', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const monitoringPath = path.join(outputDir, 'app_06_bin_monitoring.png');
  await page.screenshot({ path: monitoringPath, fullPage: true });
  console.log('Saved: ' + monitoringPath);

  // 8. Navigate to Analytics page
  console.log('8. Navigating to Analytics page...');
  await page.goto('https://smart-waste-management-ruddy.vercel.app/analytics', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const analyticsPath = path.join(outputDir, 'app_07_analytics_dashboard.png');
  await page.screenshot({ path: analyticsPath, fullPage: true });
  console.log('Saved: ' + analyticsPath);

  // 9. Navigate to Map page
  console.log('9. Navigating to Map page...');
  await page.goto('https://smart-waste-management-ruddy.vercel.app/map', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const mapPath = path.join(outputDir, 'app_08_gis_map_view.png');
  await page.screenshot({ path: mapPath, fullPage: true });
  console.log('Saved: ' + mapPath);

  await browser.close();
  console.log('All screenshots completed successfully!');
})();
