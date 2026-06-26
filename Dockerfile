# ── Chronicled — Railway production image ──────────────────────────────
# Uses a real system Chromium so Puppeteer can render book PDFs reliably.
FROM node:20-slim

# Install Chromium + the shared libraries and fonts it needs to run headless
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN apt-get update && apt-get install -y --no-install-recommends \
      chromium \
      ca-certificates \
      fonts-liberation \
      fonts-dejavu-core \
      libnss3 \
      libatk1.0-0 \
      libatk-bridge2.0-0 \
      libcups2 \
      libdrm2 \
      libxkbcommon0 \
      libxcomposite1 \
      libxdamage1 \
      libxfixes3 \
      libxrandr2 \
      libgbm1 \
      libasound2 \
      libpango-1.0-0 \
      libcairo2 \
    && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer where the system Chromium lives
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Build the app
COPY . .
RUN npm run build

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
