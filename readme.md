# 📘 Serbian Word of the Day Discord Bot

A Discord bot that posts a random Serbian word with definitions and synonyms daily.

## Features

- 🔄 Posts a random Serbian word daily at specified time
- 📚 Includes word definitions and synonyms
- 🧠 Loads words from an XML dictionary file
- ⏰ Customizable posting schedule

## Setup Instructions

### Prerequisites

- Node.js (v14 or newer)
- A Discord bot token ([How to create a bot](https://discordjs.guide/preparations/setting-up-a-bot-application.html))
- A Discord server where you have permission to add bots

### Installation

1. Clone this repository:

   ```
   git clone https://github.com/YourUsername/serbian-word-bot.git
   cd serbian-word-bot
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create your configuration:

   ```
   cp .env.example .env
   ```

4. Edit the `.env` file with your Discord bot token and channel ID

### Running the Bot

Start the bot with:

```
node index.js
```

## Customization

You can customize the bot by editing the `.env` file:

- `CRON_SCHEDULE`: Change when the word is posted (default: 0 10 \* \* \* = 10:00 AM daily)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
