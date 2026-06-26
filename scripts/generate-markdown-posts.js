const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

// Load environment variables manually from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  });
}

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("❌ Error: ANTHROPIC_API_KEY is not defined in .env.local!");
  process.exit(1);
}

// Initialize Anthropic SDK
const anthropic = new Anthropic({ apiKey });

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
    bot: "Substack & Reddit Article Promoter",
    level,
    message
  });
  if (logs.length > 200) logs = logs.slice(0, 200);
  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2), 'utf8');
}

async function generateArticle(story) {
  const prompt = `
You are a master creative author and historian. Below is a raw video script containing short, fast-paced captions for a 46-second visual history story.

Story Title: "${story.title}"
Hook: "${story.hook}"
Beats:
- Beat 1: ${story.body1}
- Beat 2: ${story.body2}
- Beat 3: ${story.body3}
- Beat 4: ${story.body4}
- Beat 5: ${story.body5}
Takeaway: "${story.takeaway}"

Your task is to rewrite this into a highly engaging, long-form historical narrative or Bridgerton-style diary entry (approx 300-450 words) suitable for a Substack newsletter or a Reddit text post.

Requirements:
- Write in a captivating, atmospheric narrative voice (e.g. elegant, suspenseful, historical romance, or mysterious).
- Flesh out descriptions, emotions, and pacing so it reads like a premium short story, rather than brief slides.
- Use clean Markdown formatting. Use scene dividers (✦ ✦ ✦) if appropriate.
- Include a compelling title at the top (e.g. "# [Title]").
- At the very bottom, append this exact call to action footer:

---
*Enjoy this chronicle? The complete story collection and custom physical diary journals are available at [getchronicled.art](https://getchronicled.art). Comment **CHRONICLED** on our social media posts to get your custom family story animated on the spot.*
  `.trim();

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1200,
      system: "You write rich, atmospheric historical narratives and Bridgerton-style diary logs.",
      messages: [{ role: "user", content: prompt }]
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return text;
  } catch (err) {
    console.error(`❌ API Error for "${story.title}":`, err.message);
    addLog('error', `API Error for "${story.title}": ${err.message}`);
    return null;
  }
}

async function main() {
  const storiesPath = path.join(__dirname, 'stories.json');
  if (!fs.existsSync(storiesPath)) {
    console.error("❌ Error: stories.json not found!");
    addLog('error', 'stories.json not found!');
    process.exit(1);
  }

  const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf8'));
  const postsDir = path.join(__dirname, '../posts');

  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
    console.log(`📁 Created directory: ${postsDir}`);
  }

  console.log(`🚀 Starting long-form article generation for ${stories.length} stories...`);
  addLog('info', `Started generating long-form articles for ${stories.length} stories.`);

  for (let i = 0; i < stories.length; i++) {
    const story = stories[i];
    const slug = story.title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const outputFilename = `story_${story.id}_${slug}.md`;
    const outputPath = path.join(postsDir, outputFilename);

    // Skip if already generated to save tokens
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️ Skipping Story #${story.id} (already generated)`);
      continue;
    }

    console.log(`⏳ Generating article for Story #${story.id}: "${story.title}"...`);
    addLog('info', `Generating article for Story #${story.id}: "${story.title}"`);
    const articleContent = await generateArticle(story);

    if (articleContent) {
      fs.writeFileSync(outputPath, articleContent, 'utf8');
      console.log(`✅ Saved article: posts/${outputFilename}`);
      addLog('info', `Saved article: posts/${outputFilename}`);
      // Sleep a bit to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  console.log("🎉 All articles generated successfully!");
  addLog('info', 'All articles generated successfully!');
}

main();
