import {
	AttachmentBuilder,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	SlashCommandBuilder
} from 'discord.js';
import { CommandHelpEntry } from '../lib/CommandHelpEntry';
import { getPeople } from '../lib/database';

export const help = new CommandHelpEntry('backup', 'Backup the database');

export const data = new SlashCommandBuilder()
	.setName('backup')
	.setDescription('Backup the database')
	.setDMPermission(false)
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	if (!interaction.inGuild()) return;

	await interaction.deferReply();

	const scores = (await getPeople(interaction.guildId)).map(v => v.value);

	const date = new Date();

	if (scores.length === 0) await interaction.editReply('No data to backup');
	else
		await interaction.editReply({
			content:
				'Backed up! Keep this file somewhere safe. Maybe in multiple somewheres.',
			files: [
				new AttachmentBuilder(Buffer.from(JSON.stringify(scores)), {
					name: `pointerbot_backup-guild_${interaction.guildId}-${date.getMonth()}${date.getDate()}${date.getFullYear()}.json`,
					description: "Backup of this guild's data stored with Pointer."
				})
			]
		});
};
