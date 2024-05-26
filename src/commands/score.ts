import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
	userMention
} from 'discord.js';
import { CommandHelpEntry } from '../lib/CommandHelpEntry';
import { bumpScore, getPeopleSortedByScores } from '../lib/database';

export const help = new CommandHelpEntry(
	'score',
	'Manage scores for users',
	'view [user: user]',
	'add <user: user> <points: number>'
);

export const data = new SlashCommandBuilder()
	.setName('score')
	.setDescription('Manage scores for users')
	.setDMPermission(false)
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
	.addSubcommand(cmd =>
		cmd
			.setName('view')
			.setDescription("View a user's score")
			.addUserOption(opt =>
				opt
					.setName('user')
					.setDescription(
						'The user to view the score of (omit to get all users)'
					)
					.setRequired(false)
			)
	)
	.addSubcommand(cmd =>
		cmd
			.setName('add')
			.setDescription('Add points to a user')
			.addUserOption(opt =>
				opt
					.setName('user')
					.setDescription('The user to add points to')
					.setRequired(true)
			)
			.addIntegerOption(opt =>
				opt
					.setName('points')
					.setDescription('The number (+/-) of points to add')
					.setRequired(true)
			)
	);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	if (!interaction.inGuild()) return;

	await interaction.deferReply();

	const subcommand = interaction.options.getSubcommand(true);
	const embed = new EmbedBuilder();

	if (subcommand === 'view') {
		const user = interaction.options.getUser('user', false);
		const scores = (await getPeopleSortedByScores(interaction.guildId)).map(
			v => v.value
		);
		const userScore = user
			? scores.find(v => v.id === user.id)?.score
			: undefined;

		embed
			.setTitle(
				user ? `Score | @${user.displayName ?? user.username}` : 'All Scores'
			)
			.setDescription(
				user
					? (userScore && `${userMention(user.id)} - ${userScore}pts`) ||
							`No score for ${userMention(user.id)}`
					: scores.length > 0
						? scores.map(v => `${userMention(v.id)} - ${v.score}`).join('\n')
						: 'No scores'
			)
			.setTimestamp()
			.setFooter({
				iconURL: interaction.client.user.displayAvatarURL(),
				text: `Requested by ${interaction.user.username}`
			})
			.setColor(0x00ffff);
	} else if (subcommand === 'add') {
		const user = interaction.options.getUser('user', true);
		const points = interaction.options.getInteger('points', true);

		embed
			.setTitle(`Score | @${user.displayName ?? user.username}`)
			.setDescription(
				`Added ${points}pts to ${userMention(user.id)}\nNew score: ${await bumpScore(
					interaction.guildId,
					user.id,
					points
				)}pts`
			)
			.setTimestamp()
			.setFooter({
				iconURL: interaction.client.user.displayAvatarURL(),
				text: `Requested by ${interaction.user.username}`
			})
			.setColor(0x00ff00);
	}

	await interaction.editReply({
		embeds: [embed]
	});
};
