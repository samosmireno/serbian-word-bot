const { Client, GatewayIntentBits } = require("discord.js");
const loadWords = require("./loadDictionary");
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

async function sendDailyWord() {
  try {
    console.log("Starting daily word task...");

    const dictionary = await loadWords("./dictionary.xml");
    console.log(`Loaded ${dictionary.length} words from dictionary`);

    if (!dictionary || !dictionary.length) {
      console.error("Dictionary is empty or not loaded");
      process.exit(1);
    }

    const randomWord =
      dictionary[Math.floor(Math.random() * dictionary.length)];

    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) {
      console.error(`Channel with ID ${CHANNEL_ID} not found`);
      process.exit(1);
    }

    const message = formatWordMessage(randomWord);
    await channel.send(message);
    console.log(`Posted word of the day: ${randomWord.word}`);

    console.log("Daily word task completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error in daily word task:", error);
    process.exit(1);
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

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  await sendDailyWord();
});

client.on("error", (error) => {
  console.error("Discord client error:", error);
  process.exit(1);
});

client.login(TOKEN).catch((error) => {
  console.error("Failed to login to Discord:", error);
  process.exit(1);
});

setTimeout(() => {
  console.error("Task timeout - exiting");
  process.exit(1);
}, 30000);
