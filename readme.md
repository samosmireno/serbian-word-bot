# 📘 Serbian Word of the Day Discord Bot

A Discord bot that posts a random Serbian word with definitions and synonyms daily using GitHub Actions automation.

## Features

- 🔄 Posts a random Serbian word daily at chosen time
- 📚 Includes word definitions, synonyms, and hyphenation
- 🧠 Loads words from an XML dictionary file using streaming parser
- ⏰ Runs automatically via GitHub Actions (no server hosting required)
- 🆓 Cost-effective solution using GitHub's free tier
- 🔒 Secure secret management through GitHub repository secrets

## How It Works

This bot runs as a scheduled GitHub Action that:

1. Loads the Serbian dictionary from XML
2. Selects a random word with its definitions and synonyms
3. Posts it to your Discord channel
4. Exits (no continuous running required)

## Setup Instructions

### Prerequisites

- A GitHub account
- A Discord bot token ([How to create a bot](https://discordjs.guide/preparations/setting-up-a-bot-application.html))
- A Discord server where you have permission to add bots
- Your `dictionary.xml` file in the repository root

### Installation

1. Fork or clone this repository:

   ```bash
   git clone https://github.com/samosmireno/serbian-word-bot.git
   cd serbian-word-bot
   ```

2. Add your `dictionary.xml` file to the project root

3. Set up GitHub repository secrets:
   - Go to your repository Settings → Secrets and variables → Actions
   - Add these repository secrets:
     - `BOT_TOKEN`: Your Discord bot token
     - `CHANNEL_ID`: Discord channel ID where bot should post

### Discord Bot Setup

1. **Create Discord Application**: Go to [Discord Developer Portal](https://discord.com/developers/applications)

2. **Bot Permissions**: In OAuth2 URL Generator, select:

   - **Scopes**: `bot`
   - **Bot Permissions**:
     - View Channels
     - Send Messages

3. **Invite Bot**: Use the generated OAuth2 URL to add bot to your server

4. **Get Channel ID**:
   - Enable Developer Mode in Discord Settings
   - Right-click your target channel → Copy Channel ID

### Running the Bot

The bot runs automatically via GitHub Actions at chosen time daily. You can also:

**Manual Trigger:**

- Go to Actions tab in your GitHub repository
- Select "Daily Serbian Word" workflow
- Click "Run workflow"

**Local Testing:**

```bash
npm install
npm run daily-word
```

## Configuration

### Changing Schedule

Edit `.github/workflows/daily-word.yml` and modify the cron expression:

```yaml
schedule:
  - cron: "15 11 * * *" # 11:15 AM UTC daily
```

### Message Format

The bot posts messages in this format:

```
📘 **Reč dana:** **[word]**
✂️ Podela na slogove: [hyphenation]

📖 **Definicije:**
1. [definition 1]
2. [definition 2]

🔄 **Sinonimi:**
[synonym1], [synonym2], [synonym3]...
```

## Project Structure

```
serbian-word-bot/
├── .github/workflows/
│   └── daily-word.yml         # GitHub Actions workflow
├── daily-word.js              # Main execution script for Actions
├── index.js                   # Development/testing version
├── loadDictionary.js          # XML dictionary parser
├── dictionary.xml             # Serbian dictionary data
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## Scripts

- `npm run daily-word` - Run once and exit (used by GitHub Actions)
- `npm run start` - Start persistent bot (for local hosting)
- `npm run dev` - Development mode with memory optimization

## Dependencies

- **discord.js**: Discord API wrapper
- **fast-xml-parser**: Efficient XML parsing with streaming
- **dotenv**: Environment variable management
- **node-cron**: Cron scheduling (for local development)

## Troubleshooting

### Bot Not Posting

1. Check GitHub Actions logs in your repository's Actions tab
2. Verify bot has correct permissions in Discord channel
3. Ensure `BOT_TOKEN` and `CHANNEL_ID` secrets are set correctly

### Dictionary Issues

1. Ensure `dictionary.xml` is in repository root
2. Check file encoding (should be UTF-8)
3. Verify XML structure matches expected format
