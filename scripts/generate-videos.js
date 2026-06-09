const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

// Find chrome executable on Windows
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

async function main() {
  const chromePath = findChrome();
  if (!chromePath) {
    console.error("Could not find Google Chrome installed on this system.");
    process.exit(1);
  }
  console.log("Using Chrome executable:", chromePath);

  const storiesPath = path.join(__dirname, 'stories.json');
  if (!fs.existsSync(storiesPath)) {
    console.error("Could not find stories.json");
    process.exit(1);
  }
  
  const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf8'));

  const outputDir = path.join(__dirname, '..', 'public', 'videos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Starting video generation for ${stories.length} stories...`);

  for (let i = 0; i < stories.length; i++) {
    const story = stories[i];
    console.log(`\n--- Generating Video ${i + 1}/${stories.length}: "${story.title}" ---`);

    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();

      // Configure download behavior
      const client = await page.target().createCDPSession();
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: outputDir,
      });

      // Construct URL (using localized font and gold-dust background by default for premium branding)
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

      console.log("Waiting for canvas/button to be ready...");
      // Wait for the Export button to be visible
      const buttonSelector = 'button';
      await page.waitForFunction(
        (sel) => {
          const buttons = document.querySelectorAll(sel);
          for (const b of buttons) {
            if (b.textContent.includes('Export & Download')) return true;
          }
          return false;
        },
        {},
        buttonSelector
      );

      console.log("Clicking Export & Download...");
      // Click the button
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const b of buttons) {
          if (b.textContent.includes('Export & Download')) {
            b.click();
            break;
          }
        }
      });

      console.log("Export started. Monitoring progress...");
      // Wait for completion message "✓ Export complete!" to appear
      await page.waitForFunction(
        () => {
          const bodyText = document.body.innerText;
          return bodyText.includes('Export complete') || bodyText.includes('downloaded successfully');
        },
        { timeout: 120000 } // 2 minutes timeout (video is 34s, renders in a few seconds on canvas)
      );

      console.log("Export complete page-side. Waiting for download to finish...");
      
      // Wait a few seconds for the file download to actually complete on disk
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Check the output directory for the newly created .webm file and rename it
      const files = fs.readdirSync(outputDir);
      // Find the most recently downloaded .webm file
      const webmFiles = files.filter(f => f.endsWith('.webm') && !f.startsWith('story_'));
      if (webmFiles.length > 0) {
        // Sort by creation time to find the newest
        webmFiles.sort((a, b) => {
          return fs.statSync(path.join(outputDir, b)).mtime.getTime() - fs.statSync(path.join(outputDir, a)).mtime.getTime();
        });
        const newestFile = webmFiles[0];
        const newFileName = `story_${story.id}_${story.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.webm`;
        
        const oldPath = path.join(outputDir, newestFile);
        const newPath = path.join(outputDir, newFileName);
        
        fs.renameSync(oldPath, newPath);
        console.log(`Success! Video saved as: public/videos/${newFileName}`);
      } else {
        console.warn("Could not find the downloaded video file to rename.");
      }

    } catch (err) {
      console.error(`Error generating video for "${story.title}":`, err);
    } finally {
      await browser.close();
    }
  }

  console.log("\nAll video generation tasks finished!");
}

main();
