const { SlashCommandBuilder } = require('discord.js');
// const { google } = require('googleapis');

const {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} = require('@google/generative-ai');

const { google_api_key } = require('../../config.json');

const MODEL_NAME = 'gemini-1.0-pro';

async function runChat(question) {
	const genAI = new GoogleGenerativeAI(google_api_key);
	const model = genAI.getGenerativeModel({ model: MODEL_NAME });

	const generationConfig = {
		temperature: 0.9,
		topK: 1,
		topP: 1,
		maxOutputTokens: 2048,
	};

	const safetySettings = [
		{
			category: HarmCategory.HARM_CATEGORY_HARASSMENT,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
	];

	console.log('-------------------------------------------------');
	const chat = model.startChat({
		generationConfig,
		safetySettings,
		history: [
		],
	});


	try {
		const result = await chat.sendMessage(question);
		const response = result.response;
		console.log(response.text());
		return response.text();
	}
	catch (error) {
		console.log(error);
		return error;
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ask')
		.setDescription('Pose une question à Google Gemini.')
		.addStringOption(option =>
			option.setName('question')
				.setDescription('La question que vous voulez poser à Google Gemini.')
				.setRequired(true)),
	async execute(interaction) {
		const question = interaction.options.getString('question');

		await interaction.deferReply();
		try {
			const response = await runChat(question);
			await interaction.editReply(response);
		}
		catch (error) {
			console.error('Erreur lors de la recherche sur Google Gemini :', error);
			await interaction.reply('Une erreur s\'est produite lors de la requête à Google Gemini');
		}
	},
};
