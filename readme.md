# Serbian Word of the Day Bot 🇷🇸

A Discord bot that posts a random Serbian word with its pronunciation and definitions to a specified channel every day.

## Features

- Posts a daily Serbian word at a scheduled time (default: 9:00 AM)
- Includes pronunciation, hyphenation, definitions, and synonyms
- Loads words from an XML dictionary file
- Error handling for robust operation
- Formats messages with clear sections for each word component

## Setup Instructions

### Prerequisites

- Node.js (v14 or newer)
- A Discord bot token
- A server with a channel where the bot has permission to post

### Installation

1. Clone this repository or download the files
2. Install dependencies:
   ```
   npm install discord.js node-cron xml2js dotenv
   ```
3. Create a `.env` file based on the provided sample
4. Add your Discord bot token to the `.env` file
5. Update the channel ID in the `.env` file

### Configuration

Edit the `.env` file to customize:

- `BOT_TOKEN`: Your Discord bot token
- `CHANNEL_ID`: The ID of the channel where words will be posted
- Optional settings can be uncommented to customize behavior

### Dictionary Format

The bot expects a dictionary in XML format with this structure:

```xml
<entries>
  <entry xml:id="word_id" xml:lang="sr-Latn">
    <form type="lemma">
      <orth>word</orth>
      <hyph>syllable|division</hyph>
      <pron>pronunciation</pron>
    </form>
    <sense n="1">
      <def>definition</def>
      <xr type="synonymy">
        <innerlink>synonym1</innerlink>
      </xr>
      <xr type="synonymy">
        <innerlink>synonym2</innerlink>
      </xr>
    </sense>
    <!-- Multiple sense elements allowed -->
  </entry>
  <!-- Multiple entry elements -->
</entries>
```

The bot will extract:

- The word (orth)
- Syllable division (hyph)
- Pronunciation (pron)
- Definitions (def)
- Synonyms (innerlink inside xr with type="synonymy")

### Running the Bot

Start the bot with:

```
node index.js
```

For production use, consider using a process manager like PM2:

```
npm install -g pm2
pm2 start index.js --name word-bot
```

## Security Notes

- Never commit your `.env` file or expose your bot token
- The original code contained a hardcoded token which has been removed

## Troubleshooting

- **Bot doesn't post**: Check channel permissions and bot token
- **Empty dictionary**: Verify dictionary.xml format and path
- **Schedule issues**: Make sure server time is correctly set

## License

This project is available under the MIT License.
