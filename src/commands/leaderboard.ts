import {
	AttachmentBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	userMention
} from 'discord.js';
import { CommandHelpEntry } from '../lib/CommandHelpEntry';
import { getPeopleSortedByScores } from '../lib/database';
import { Canvas, GlobalFonts, Image } from '@napi-rs/canvas';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { truncString } from '../lib/util';

export const help = new CommandHelpEntry(
	'leaderboard',
	'Shows the current leaderboard',
	'[image: boolean]'
);

export const data = new SlashCommandBuilder()
	.setName('leaderboard')
	.setDescription('Shows the current leaderboard')
	.setDMPermission(false)
	.addBooleanOption(option =>
		option
			.setName('image')
			.setDescription(
				'Whether to show the leaderboard as a dynamically generated image'
			)
			.setRequired(false)
	);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	if (!interaction.inGuild()) return;

	await interaction.deferReply();

	const scores = await getPeopleSortedByScores(interaction.guildId);

	const embed = new EmbedBuilder()
		.setTitle('Leaderboard')
		.setTimestamp()
		.setFooter({
			iconURL: interaction.client.user.displayAvatarURL(),
			text: `Requested by ${interaction.user.username}`
		})
		.setColor(0xffff00);

	if (interaction.options.getBoolean('image', false)) {
		embed.setImage('attachment://leaderboard.png');

		await interaction.editReply({
			embeds: [embed],
			files: [
				new AttachmentBuilder(
					await generateLeaderboardImage(
						scores.map(v => v.value),
						interaction
					),
					{
						name: 'leaderboard.png',
						description: 'Leaderboard image'
					}
				)
			]
		});
	} else {
		embed.setDescription(
			scores.length > 0
				? scores
						.map(
							(entry, i) =>
								`${i + 1}. ${userMention(entry.value.id)} - ${entry.value.score}pts`
						)
						.join('\n')
				: 'No scores to display'
		);

		await interaction.editReply({
			embeds: [embed]
		});
	}
};

async function generateLeaderboardImage(
	scores: { id: string; score: number }[],
	interaction: ChatInputCommandInteraction
) {
	const canvas = new Canvas(1280, 800);
	const ctx = canvas.getContext('2d');

	const bg = new Image(1280, 800);
	bg.src = await readFile(
		join(
			dirname(fileURLToPath(import.meta.url)),
			'..',
			'..',
			'assets',
			'leaderboard_bg.svg'
		)
	);
	ctx.drawImage(bg, 0, 0);

	GlobalFonts.registerFromPath(
		join(
			dirname(fileURLToPath(import.meta.url)),
			'..',
			'..',
			'assets',
			'static',
			'OpenSans-Bold.ttf'
		)
	);
	ctx.fillStyle = 'white';
	ctx.lineWidth = 10;
	ctx.font = 'bold 80px Open Sans';
	ctx.fillText('Leaderboard', 100, 100);

	await Promise.all([
		scores.slice(0, 5).map(
			(data, i) =>
				new Promise(() =>
					interaction.guild!.members.fetch(data.id).then(user => {
						ctx.fillText(`${i + 1}.`, 100, 200 + i * 100);
						ctx.fillText(truncString(user.displayName, 10), 200, 200 + i * 100);
						ctx.fillText(`${data.score}pts`, 1000, 200 + i * 100);
					})
				)
		)
	]);

	return await canvas.encode('png');
}
