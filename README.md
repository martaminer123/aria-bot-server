# Aria Bot — WhatsApp AI Assistant

Backend server for **Aria**, the WhatsApp AI assistant for Love Beauty Power by Marta. Receives WhatsApp messages, generates replies via Claude AI, and sends them back automatically.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | Home page (confirms server is up) |
| GET | `/api/health` | Health check (returns "Aria is running") |
| GET | `/api/healthz` | Health check JSON (Railway/deployment probes) |
| GET | `/api/privacy` | Privacy policy page |
| GET | `/api/webhook` | WhatsApp webhook verification |
| POST | `/api/webhook` | Incoming WhatsApp messages → Claude → reply |

## Deploy on Railway (5 minutes)

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
2. Push this folder as a GitHub repo, or use [GitHub Desktop](https://desktop.github.com/) to create one
3. Railway auto-detects the Dockerfile and builds it
4. In your Railway project, click **Variables** and add:
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_VERIFY_TOKEN`
   - `PHONE_NUMBER_ID`
   - `CLAUDE_API_KEY`
5. Once deployed, copy your Railway public URL (e.g. `https://aria-bot.up.railway.app`)
6. Go to [Meta Developer Console](https://developers.facebook.com) → your app → WhatsApp → Configuration
7. Set **Callback URL** to: `https://your-url.up.railway.app/api/webhook`
8. Set **Verify Token** to match your `WHATSAPP_VERIFY_TOKEN`
9. Click **Verify and Save** — done!

## Run locally

```bash
cp .env.example .env
# Edit .env with your real values

npm install
npm start
```

## Environment variables

| Variable | Where to get it |
|----------|----------------|
| `WHATSAPP_ACCESS_TOKEN` | Meta Developer Console → WhatsApp → API Setup |
| `WHATSAPP_VERIFY_TOKEN` | Any string you choose — must match Meta webhook config |
| `PHONE_NUMBER_ID` | Meta Developer Console → WhatsApp → API Setup |
| `CLAUDE_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
