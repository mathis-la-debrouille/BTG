const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('helloworld')
		.setDescription('Says hello world.'),
	async execute(interaction) {
		await interaction.reply('Hello world !');
	},
};