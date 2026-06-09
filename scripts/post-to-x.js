const fs = require("fs");
const path = require("path");
const { TwitterApi } = require("twitter-api-v2");

// Load .env.local manually
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const parts = line.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim().replace(/^["']|["']$/g, "");
      process.env[key] = val;
    }
  });
}

const consumerKey = process.env.TWITTER_CONSUMER_KEY;
const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
const accessToken = process.env.TWITTER_ACCESS_TOKEN;
const accessSecret = process.env.TWITTER_ACCESS_SECRET;

if (!consumerKey || !consumerSecret || !accessToken || !accessSecret) {
  console.error("❌ Error: Missing Twitter API credentials in .env.local!");
  console.error("Please add the following to your .env.local:");
  console.error("TWITTER_CONSUMER_KEY");
  console.error("TWITTER_CONSUMER_SECRET");
  console.error("TWITTER_ACCESS_TOKEN");
  console.error("TWITTER_ACCESS_SECRET");
  process.exit(1);
}

const client = new TwitterApi({
  appKey: consumerKey,
  appSecret: consumerSecret,
  accessToken: accessToken,
  accessSecret: accessSecret,
});

async function main() {
  const args = process.argv.slice(2);
  const textIdx = args.indexOf("--text");
  const videoIdx = args.indexOf("--video");

  let text = textIdx !== -1 ? args[textIdx + 1] : "";
  let videoPath = videoIdx !== -1 ? args[videoIdx + 1] : "";

  if (!text && !videoPath) {
    console.log("Usage: node scripts/post-to-x.js --text \"Your tweet text\" [--video \"path/to/video.mp4\"]");
    process.exit(1);
  }

  try {
    let mediaId = null;

    if (videoPath) {
      const absoluteVideoPath = path.isAbsolute(videoPath)
        ? videoPath
        : path.resolve(process.cwd(), videoPath);

      if (!fs.existsSync(absoluteVideoPath)) {
        console.error(`❌ Error: Video file not found at ${absoluteVideoPath}`);
        process.exit(1);
      }

      console.log(`⏳ Uploading video: ${absoluteVideoPath}...`);
      mediaId = await client.v1.uploadMedia(absoluteVideoPath, {
        mimeType: "video/mp4",
        target: "tweet",
      });
      console.log(`✅ Video uploaded successfully! Media ID: ${mediaId}`);
    }

    console.log("⏳ Posting tweet to X...");
    let response;
    if (mediaId) {
      response = await client.v2.tweet({
        text: text,
        media: { media_ids: [mediaId] },
      });
    } else {
      response = await client.v2.tweet(text);
    }

    console.log("🎉 Tweet posted successfully!");
    console.log("Tweet Details:", response.data);
  } catch (err) {
    console.error("❌ Failed to post to X:", err);
    process.exit(1);
  }
}

main();
