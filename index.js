const { Client, GatewayIntentBits } = require("discord.js");
const loadWords = require("./loadDictionary");
const cron = require("node-cron");
const fs = require("fs");
require("dotenv").config();

const TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

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

    cron.schedule("1 0 * * *", () => {
      postWordOfTheDay();
    });

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

  if (wordData.hyphenation) {
    message += `\n✂️ Podela na slogove: ${wordData.hyphenation}`;
  }

  if (wordData.definitions && wordData.definitions.length > 0) {
    message += `\n\n📖 **Definicije:**`;
    message += `\n${wordData.definitions
      .map((def, index) => `${index + 1}. ${def}`)
      .join("\n")}`;
  }

  if (wordData.synonyms && wordData.synonyms.length > 0) {
    message += `\n\n🔄 **Sinonimi:**`;
    message += `\n${wordData.synonyms.slice(0, 10).join(", ")}`;

    if (wordData.synonyms.length > 10) {
      message += `, i još ${wordData.synonyms.length - 10}...`;
    }
  }

  return message;
}

client.on("error", (error) => {
  console.error("Discord client error:", error);
});

process.on("SIGINT", () => {
  console.log("Bot shutting down...");
  client.destroy();
  process.exit(0);
});

client.login(TOKEN).catch((error) => {
  console.error("Failed to login to Discord:", error);
  process.exit(1);
});
