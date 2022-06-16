const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Intents } = require("discord.js");
const WebSocket = require('ws');

const BOT_AUTH_TOKEN = process.env.BOT_AUTH_TOKEN;
const BOT_CLIENT_ID = process.env.BOT_CLIENT_ID;
const BOT_GUILD_ID = process.env.BOT_GUILD_ID;
const TAU_AUTH_TOKEN = process.env.TAU_AUTH_TOKEN;

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

const ws = new WebSocket('wss://tau.cgs.dev/ws/twitch-events/');

ws.onopen = () => {
	ws.send(JSON.stringify({token: TAU_AUTH_TOKEN}));
};

ws.onmessage = async (msg) => {
	const data = JSON.parse(msg.data);
	if (data.event_type === "stream-online") {
		const twitch_url=`https://twitch.tv/${data.event_data.broadcaster_user_login}`;
		const message=`${data.event_data.broadcaster_user_name} just went live! Come hang out at ${twitch_url}`;
		const channel = await client.channels.cache.get('957859250296721421');
		channel.send(message);
	}
}
