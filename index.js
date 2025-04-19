const { Client, GatewayIntentBits } = require("discord.js");
const loadWords = require("./loadDictionary");
const cron = require("node-cron");
const fs = require("fs");
require("dotenv").config();

// Load token from environment variables instead of hardcoding
const TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

// Add more intents for better functionality
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let dictionary = [];

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    dictionary = await loadWords("./dictionary.xml");
    console.log(`Loaded ${dictionary.length} words from dictionary`);

    // Schedule task every day at 09:00 AM (fix cron syntax)
    cron.schedule("0 9 * * *", () => {
      postWordOfTheDay();
    });

    // Post one on startup too (optional)
    postWordOfTheDay();
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});

async function postWordOfTheDay() {
  try {
    if (!dictionary || !dictionary.length) {
      console.error("Dictionary is empty or not loaded");
      return;
    }

    const randomWord =
      dictionary[Math.floor(Math.random() * dictionary.length)];

    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) {
      console.error(`Channel with ID ${CHANNEL_ID} not found`);
      return;
    }

    const message = formatWordMessage(randomWord);
    await channel.send(message);
    console.log(`Posted word of the day: ${randomWord.word}`);
  } catch (error) {
    console.error("Error posting word of the day:", error);
  }
}

function formatWordMessage(wordData) {
  let message = `📘 **Reč dana:** **${wordData.word}**`;

  // Add hyphenation if available
  if (wordData.hyphenation) {
    message += `\n✂️ Podela na slogove: ${wordData.hyphenation}`;
  }

  // Add pronunciation if available
  message += `\n🔊 ${wordData.pronunciation || "nema izgovora"}`;

  // Add definitions
  if (wordData.definitions && wordData.definitions.length > 0) {
    message += `\n\n📖 **Definicije:**`;
    message += `\n${wordData.definitions
      .map((def, index) => `${index + 1}. ${def}`)
      .join("\n")}`;
  }

  // Add synonyms if available
  if (wordData.synonyms && wordData.synonyms.length > 0) {
    message += `\n\n🔄 **Sinonimi:**`;
    message += `\n${wordData.synonyms.slice(0, 10).join(", ")}`;

    // If there are more than 10 synonyms, add indication
    if (wordData.synonyms.length > 10) {
      message += `, i još ${wordData.synonyms.length - 10}...`;
    }
  }

  return message;
}

// Add error handling for client connection
client.on("error", (error) => {
  console.error("Discord client error:", error);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("Bot shutting down...");
  client.destroy();
  process.exit(0);
});

// Login with error handling
client.login(TOKEN).catch((error) => {
  console.error("Failed to login to Discord:", error);
  process.exit(1);
});
