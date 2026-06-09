const fs = require('path');
const fsExtra = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

function findChrome() {
  const paths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
  ];
  for (const p of paths) {
    if (fsExtra.existsSync(p)) {
      return p;
    }
  }
  return null;
}

async function main() {
  const chromePath = findChrome();
  if (!chromePath) {
    console.error("Could not find Google Chrome.");
    process.exit(1);
  }

  const storiesPath = path.join(__dirname, 'sample-story.json');
  const stories = JSON.parse(fsExtra.readFileSync(storiesPath, 'utf8'));
  const story = stories[0];

  const outputDir = path.join(__dirname, '..', 'public', 'videos');
  if (!fsExtra.existsSync(outputDir)) {
    fsExtra.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Starting sample video generation for: "${story.title}" (60 seconds)...`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: outputDir,
    });

    const url = `http://localhost:3099/admin/generator?` +
      `hook=${encodeURIComponent(story.hook)}&` +
      `body1=${encodeURIComponent(story.body1)}&` +
      `body2=${encodeURIComponent(story.body2)}&` +
      `body3=${encodeURIComponent(story.body3)}&` +
      `body4=${encodeURIComponent(story.body4)}&` +
      `body5=${encodeURIComponent(story.body5)}&` +
      `takeaway=${encodeURIComponent(story.takeaway)}`;

    console.log("Navigating to URL...");
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log("Waiting for canvas/button...");
    await page.waitForFunction(
      () => {
        const buttons = document.querySelectorAll('button');
        for (const b of buttons) {
          if (b.textContent.includes('Export & Download')) return true;
        }
        return false;
      },
      { timeout: 30000 }
    );

    console.log("Clicking Export & Download...");
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const b of buttons) {
        if (b.textContent.includes('Export & Download')) {
          b.click();
          break;
        }
      }
    });

    console.log("Export started. Rendering 60 seconds at 30 FPS...");
    await page.waitForFunction(
      () => {
        const bodyText = document.body.innerText;
        return bodyText.includes('Export complete') || bodyText.includes('downloaded successfully');
      },
      { timeout: 180000 } // 3 minutes timeout
    );

    console.log("Export complete page-side. Waiting for download...");
    await new Promise(resolve => setTimeout(resolve, 6000));

    const files = fsExtra.readdirSync(outputDir);
    const webmFiles = files.filter(f => f.endsWith('.webm') && !f.startsWith('sample_'));
    if (webmFiles.length > 0) {
      webmFiles.sort((a, b) => {
        return fsExtra.statSync(path.join(outputDir, b)).mtime.getTime() - fsExtra.statSync(path.join(outputDir, a)).mtime.getTime();
      });
      const newestFile = webmFiles[0];
      const newFileName = `sample_60s_bridgerton_story.webm`;
      
      const oldPath = path.join(outputDir, newestFile);
      const newPath = path.join(outputDir, newFileName);
      
      fsExtra.renameSync(oldPath, newPath);
      console.log(`Success! Video saved as: public/videos/${newFileName}`);
    } else {
      console.warn("Could not find the downloaded video file.");
    }

  } catch (err) {
    console.error("Error during rendering:", err);
  } finally {
    await browser.close();
  }
}

main();
