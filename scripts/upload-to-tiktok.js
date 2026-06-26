const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const readline = require('readline');

// Find chrome executable on Windows (same helper as generate-videos.js)
function findChrome() {
  const paths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

// Helper to write to local bot-logs.json file
function addLog(level, message) {
  const logPath = path.join(__dirname, '../public/bot-logs.json');
  let logs = [];
  if (fs.existsSync(logPath)) {
    try {
      logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    } catch (e) {
      logs = [];
    }
  }
  logs.unshift({
    timestamp: new Date().toISOString(),
    bot: "Multi-Platform Publisher",
    level,
    message
  });
  if (logs.length > 200) logs = logs.slice(0, 200);
  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2), 'utf8');
}

async function main() {
  const args = process.argv.slice(2);
  const videoIdx = args.indexOf('--video');
  const captionIdx = args.indexOf('--caption');

  let videoPath = videoIdx !== -1 ? args[videoIdx + 1] : '';
  let caption = captionIdx !== -1 ? args[captionIdx + 1] : 'New story #chronicled';

  if (!videoPath) {
    console.log("Usage: node scripts/upload-to-tiktok.js --video \"path/to/video.webm\" [--caption \"My Video Caption\"]");
    process.exit(1);
  }

  const absoluteVideoPath = path.isAbsolute(videoPath)
    ? videoPath
    : path.resolve(process.cwd(), videoPath);

  if (!fs.existsSync(absoluteVideoPath)) {
    console.error(`❌ Error: Video file not found at: ${absoluteVideoPath}`);
    addLog('error', `Video file not found at: ${absoluteVideoPath}`);
    process.exit(1);
  }

  const chromePath = findChrome();
  if (!chromePath) {
    console.error("❌ Error: Could not find Google Chrome installed on this system.");
    process.exit(1);
  }

  const sessionPath = path.join(__dirname, '../tiktok_session');

  console.log("⏳ Initializing browser session...");
  addLog('info', `Starting TikTok upload for: ${path.basename(absoluteVideoPath)}`);
  
  // Launch browser with persistent user data directory to save session cookies
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: false, // Must be visible for initial login or if session expires
    defaultViewport: null,
    userDataDir: sessionPath,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--window-size=1200,800'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set user agent to seem like a standard human browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log("✈️ Navigating to TikTok Creator Center Upload Page...");
    await page.goto('https://www.tiktok.com/creator-center/upload?from=upload', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Check if we are on the login page instead of the upload page
    const currentUrl = page.url();
    if (currentUrl.includes('login') || (await page.$('div[data-e2e="login-container"]')) !== null || (await page.$('input[type="file"]')) === null) {
      console.log("\n⚠️ Session not active or expired.");
      addLog('warn', 'Session expired. Waiting for manual user login in Chrome browser.');
      console.log("👉 Please complete the login process in the open Chrome browser window.");
      await askQuestion("👉 Once you have successfully logged in and see the UPLOAD screen, press [ENTER] here to continue: ");
    }

    console.log("⏳ Waiting for file input selector...");
    // Find the file input element inside iframe if present, otherwise direct page
    let fileInput = await page.$('input[type="file"]');
    
    if (!fileInput) {
      // If inside an iframe, resolve it
      const frames = page.frames();
      for (const frame of frames) {
        fileInput = await frame.$('input[type="file"]');
        if (fileInput) break;
      }
    }

    if (!fileInput) {
      throw new Error("Could not find the video file input element on the upload page.");
    }

    console.log(`📤 Uploading file: ${absoluteVideoPath}...`);
    await fileInput.uploadFile(absoluteVideoPath);
    console.log("✅ Video upload started. Waiting for progress to complete...");

    // Wait for the video preview or progress indicator showing completion
    await page.waitForFunction(
      () => {
        const text = document.body.innerText;
        return text.includes('Upload complete') || text.includes('Edit video') || text.includes('Change video') || text.includes('Cover');
      },
      { timeout: 180000 } // 3 minutes timeout for large files
    );
    console.log("✅ Video uploaded successfully!");
    addLog('info', 'Video uploaded successfully to TikTok. Setting caption.');

    console.log("✍️ Entering caption...");
    // Wait for text editor caption field
    const editorSelector = 'div[contenteditable="true"]';
    await page.waitForSelector(editorSelector, { timeout: 30000 });
    
    // Clear existing text and write the new caption
    await page.click(editorSelector);
    // Select all text to clear it
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    
    // Type caption
    await page.keyboard.type(caption);
    console.log(`✅ Caption set: "${caption}"`);

    // Give it a moment to sync DOM state
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("💾 Clicking 'Save as Draft'...");
    const draftButtonSelector = 'button';
    await page.waitForFunction(
      (sel) => {
        const buttons = document.querySelectorAll(sel);
        for (const b of buttons) {
          if (b.textContent.includes('Save as draft') || b.textContent.includes('Draft')) return true;
        }
        return false;
      },
      {},
      draftButtonSelector
    );

    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const b of buttons) {
        if (b.textContent.includes('Save as draft') || b.textContent.includes('Draft')) {
          b.click();
          break;
        }
      }
    });

    console.log("⏳ Waiting for draft confirmation message...");
    await new Promise(resolve => setTimeout(resolve, 8000)); // wait for submit completion
    console.log("🎉 Success! Video uploaded and saved as a Draft in your TikTok Account!");
    addLog('info', `Successfully uploaded and saved draft to TikTok with caption: "${caption}"`);

  } catch (err) {
    console.error("❌ Automation error during upload:", err.message);
    addLog('error', `TikTok upload failed: ${err.message}`);
  } finally {
    console.log("🔒 Closing browser session.");
    await browser.close();
  }
}

main();
