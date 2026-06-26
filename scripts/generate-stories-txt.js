const fs = require('fs');
const path = require('path');

function main() {
  const storiesPath = path.join(__dirname, 'stories.json');
  if (!fs.existsSync(storiesPath)) {
    console.error("stories.json not found!");
    return;
  }

  const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf8'));
  let content = "========================================================================\n";
  content += "              CHRONICLED - 15 BRIDGERTON-STYLE DIARY STORIES\n";
  content += "========================================================================\n\n";

  stories.forEach((story) => {
    content += `Story #${story.id}: ${story.title}\n`;
    content += `------------------------------------------------------------------------\n`;
    content += `[Hook (0s-6s)]\n"${story.hook}"\n\n`;
    content += `[Beat 1 (6s-14s)]\n${story.body1}\n\n`;
    content += `[Beat 2 (14s-22s)]\n${story.body2}\n\n`;
    content += `[Beat 3 (22s-30s)]\n${story.body3}\n\n`;
    content += `[Beat 4 (30s-38s)]\n${story.body4}\n\n`;
    content += `[Beat 5 (38s-46s)]\n${story.body5}\n\n`;
    content += `[Takeaway (46s-53s)]\n"${story.takeaway}"\n\n`;
    content += `[Outro (53s-60s)]\n[Visual Brand CTA Outro Card]\n`;
    content += `========================================================================\n\n`;
  });

  // Save to public folder
  const publicPath = path.join(__dirname, '..', 'public', 'stories.txt');
  fs.writeFileSync(publicPath, content, 'utf8');
  console.log(`Stories written to public/stories.txt`);

  // Save to Downloads folder
  const downloadsPath = "C:/Users/night/Downloads/stories.txt";
  try {
    fs.writeFileSync(downloadsPath, content, 'utf8');
    console.log(`Stories written to ${downloadsPath}`);
  } catch (err) {
    console.error(`Failed to write to Downloads folder:`, err.message);
  }
}

main();
