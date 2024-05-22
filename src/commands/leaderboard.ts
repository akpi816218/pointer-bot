import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	userMention
} from 'discord.js';
import { CommandHelpEntry } from '../lib/CommandHelpEntry';
import { getPeopleSortedByScores } from '../lib/database';

export const help = new CommandHelpEntry(
	'help',
	'Shows general help or help for a specific command',
	'[command: string]'
);

export const data = new SlashCommandBuilder()
	.setName('help')
	.setDescription('Shows help')
	.setDMPermission(false);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply();

	const scores = await getPeopleSortedByScores();

	await interaction.editReply({
		embeds: [
			new EmbedBuilder()
				.setTitle('Leaderboard')
				.setDescription(
					scores
						.map(
							(entry, i) =>
								`${i + 1}. ${userMention(entry.value.id)} - ${entry.value.score}pts`
						)
						.join('\n')
				)
				.setTimestamp()
				.setFooter({
					iconURL: interaction.client.user.displayAvatarURL(),
					text: `Requested by ${interaction.user.username}`
				})
				.setColor(0xffff00)
		]
		// @napi-rs/canvas leaderboard image
		// attachments: []
	});
};
