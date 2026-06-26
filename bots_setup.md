# Chronicled: Bots Setup & Integration Guide
*Step-by-step instructions for running your new content expansion and upload automations.*

---

We have created two core scripts inside your `scripts/` folder:
1.  **[generate-markdown-posts.js](file:///C:/Users/night/Documents/ClaudeAgent/chronicled/scripts/generate-markdown-posts.js)** (The Substack/Reddit Article Generator)
2.  **[upload-to-tiktok.js](file:///C:/Users/night/Documents/ClaudeAgent/chronicled/scripts/upload-to-tiktok.js)** (The Headless TikTok Draft Uploader)

Here is how to set up, test, and automate them:

---

## ✍️ Bot 1: The Markdown Article Generator
This script reads `stories.json`, initializes the Anthropic SDK with your API key, and calls Claude 3.5 Sonnet to expand each video's captions into a 400-word atmospheric story.

### How to Run:
Open your terminal in `C:\Users\night\Documents\ClaudeAgent\chronicled` and run:
```bash
node scripts/generate-markdown-posts.js
```

### What Happens:
*   It checks your `stories.json`.
*   It creates a new folder named `posts/` in your workspace.
*   It saves each expanded narrative as a `.md` (Markdown) file (e.g., `posts/story_15_the_secret_diary.md`).
*   It automatically skips stories that have already been generated to save you API costs.

---

## 📤 Bot 2: The TikTok Headless Upload Automation
This script uses Puppeteer (via Google Chrome) and a persistent session database folder (`tiktok_session/`) to bypass login bot detectors and save videos to drafts.

### First Run (Initial Authentication):
1.  Open your terminal and execute the script:
    ```bash
    node scripts/upload-to-tiktok.js --video "C:\Users\night\Documents\ClaudeAgent\chronicled\story_15_the_secret_diary.webm" --caption "The diary they tried to burn. Comment CHRONICLED to get the link. #history #diary"
    ```
2.  A Chrome browser window will open displaying the TikTok login page.
3.  **Manually log into your account** (via QR Code, Email, or Google).
4.  Once logged in and you see the upload dashboard, return to your command terminal and press **[ENTER]**.
5.  The script will complete the upload, save the draft, and close Chrome.
6.  *Your login session cookies are now securely saved in your local folder `tiktok_session/`.*

### Subsequent Runs:
For all future runs, the script will load the saved cookies and execute automatically in the background. It will navigate, log in, drag-and-drop the video file, write the caption, and save it as a draft without requiring manual intervention.

---

## 🚦 n8n Integration Blueprints

To connect these to your n8n workflow, use the **Execute Command** node:

### 1. For Article Generation:
Place an **Execute Command** node in n8n and set the command to:
```bash
node C:\Users\night\Documents\ClaudeAgent\chronicled\scripts\generate-markdown-posts.js
```
*Trigger this whenever you add a new story line or daily cron.*

### 2. For Video Uploads:
Place an **Execute Command** node immediately following your video render step:
```bash
node C:\Users\night\Documents\ClaudeAgent\chronicled\scripts\upload-to-tiktok.js --video "{{ $json.videoPath }}" --caption "{{ $json.storyTitle }}. Comment CHRONICLED to get the link. #history #diary"
```
*(Make sure to pass the dynamic JSON variables from your previous n8n nodes for `videoPath` and `storyTitle`)*
