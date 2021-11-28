// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const keepAlive = require('./server');
const { token } = require('./jsons/config.json');
const { stats, poll } = require('./commands');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Discord Client is ready!');
});

client.on('messageCreate', async (message) => {
	const { content, channel, author } = message;
	const [command] = content.split(' ');

	if (channel.name.includes('slp-tracker')) {
		if (command.toLowerCase() === 'stats') {
			stats(message);
			return;
		}

		// auto delete unrelated messages
		if (author.tag !== 'AmBot#0397') {
			await message.delete();
		}
	}

	if (command.toLowerCase() === 'poll') {
		poll(message);
		return;
	}
});

keepAlive();
// Login to Discord with your client's token
client.login(token);