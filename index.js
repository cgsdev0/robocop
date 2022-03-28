const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Intents } = require("discord.js");

const BOT_AUTH_TOKEN = process.env.BOT_AUTH_TOKEN;
const BOT_CLIENT_ID = process.env.BOT_CLIENT_ID;
const BOT_GUILD_ID = process.env.BOT_GUILD_ID;

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
];

const rest = new REST({ version: "9" }).setToken(BOT_AUTH_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(BOT_CLIENT_ID, BOT_GUILD_ID),
      {
        body: commands,
      }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});

client.login(BOT_AUTH_TOKEN);
