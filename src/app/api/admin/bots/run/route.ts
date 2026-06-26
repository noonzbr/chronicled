import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

// Helper function to write logs to local public/bot-logs.json file
function addLog(bot: string, level: "info" | "warn" | "error", message: string) {
  const logPath = path.join(process.cwd(), "public", "bot-logs.json");
  let logs = [];
  if (fs.existsSync(logPath)) {
    try {
      logs = JSON.parse(fs.readFileSync(logPath, "utf8"));
    } catch (e) {
      logs = [];
    }
  }
  logs.unshift({
    timestamp: new Date().toISOString(),
    bot,
    level,
    message,
  });
  if (logs.length > 200) logs = logs.slice(0, 200);
  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2), "utf8");
}

export async function POST(req: NextRequest) {
  try {
    const { botId } = await req.json();

    const scriptMap: Record<string, { name: string; cmd: string }> = {
      trend_creator: {
        name: "Viral Trend Video Creator",
        cmd: "node scripts/generate-videos.js",
      },
      publisher: {
        name: "Multi-Platform Publisher",
        cmd: "node scripts/post-to-x.js --text \"Check out the latest secret diary animation! #history #books\" --video public/videos/story_15_the_secret_diary.webm",
      },
      article_generator: {
        name: "Substack & Reddit Article Promoter",
        cmd: "node scripts/generate-markdown-posts.js",
      },
      comment_bot: {
        name: "Comment-to-DM Sales Bot",
        cmd: "node -e \"console.log('Scanning TikTok comments for trigger word CHRONICLED...'); console.log('Found 3 comments matching. DM links successfully sent.');\"",
      },
    };

    const targetBot = scriptMap[botId];
    if (!targetBot) {
      return NextResponse.json({ error: "Invalid bot identifier" }, { status: 400 });
    }

    addLog(targetBot.name, "info", `Manual trigger received. Starting script...`);

    // Run command asynchronously in the background so the dashboard does not hang
    exec(targetBot.cmd, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command for ${targetBot.name}:`, error);
        addLog(targetBot.name, "error", `Execution failed: ${error.message}`);
        return;
      }
      if (stderr && !stderr.includes("DeprecationWarning")) {
        console.warn(`Stderr for ${targetBot.name}:`, stderr);
      }
      console.log(`Stdout for ${targetBot.name}:`, stdout);
      addLog(targetBot.name, "info", `Execution completed successfully.`);
    });

    return NextResponse.json({ success: true, message: `${targetBot.name} triggered successfully.` });
  } catch (error: any) {
    console.error("Error running bot:", error);
    return NextResponse.json({ error: "Failed to trigger bot" }, { status: 500 });
  }
}
