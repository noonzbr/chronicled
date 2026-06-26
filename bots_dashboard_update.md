# Chronicled: Admin Bot Dashboard Integration
*Control Center for Video Generation, Article Creation, and Publishing Automations.*

---

We have built a fully functional visual dashboard and integrated it into the Next.js `chronicled` application. This dashboard allows you to trigger each bot and monitor their execution logs in real-time.

## 📁 Integrated Components:

1.  **Dashboard Frontend UI:** **[page.tsx](file:///C:/Users/night/Documents/ClaudeAgent/chronicled/src/app/admin/bots/page.tsx)**
    *   Designed using the Midnight & Champagne brand palette (`--ink`, `--gold-light`, `--parchment`).
    *   Displays 4 distinct bot cards, active/running states, and a terminal console window.
    *   Auto-scrolls new log entries and polls every 3 seconds for live logging.
2.  **API Log Fetcher:** **[route.ts (Logs API)](file:///C:/Users/night/Documents/ClaudeAgent/chronicled/src/app/api/admin/bots/logs/route.ts)**
    *   Reads and serves the content of the local logs database.
3.  **API Command Executor:** **[route.ts (Run API)](file:///C:/Users/night/Documents/ClaudeAgent/chronicled/src/app/api/admin/bots/run/route.ts)**
    *   Maps control panel clicks to system actions, running the CLI scripts asynchronously to prevent webpage timeouts.
4.  **Logging Database:** **[bot-logs.json](file:///C:/Users/night/Documents/ClaudeAgent/chronicled/public/bot-logs.json)**
    *   A local file that stores timestamped, level-coded (info/warn/error) log items.

---

## ⚡ How to Run locally:
1.  Start your local Next.js development server:
    ```bash
    npm run dev
    ```
2.  Open your browser and navigate to:
    `http://localhost:3005/admin/bots` (or your active local port)
3.  Click any **"Trigger"** button on the cards to execute a script and see the console terminal update automatically.
