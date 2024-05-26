import {
	ApplicationCommandType,
	ContextMenuCommandBuilder,
	UserContextMenuCommandInteraction
} from 'discord.js';
import { getPerson } from '../lib/database';

export const data = new ContextMenuCommandBuilder()
	.setName('User Stats')
	.setType(ApplicationCommandType.User)
	.setDMPermission(false);

export async function execute(interaction: UserContextMenuCommandInteraction) {
	if (!interaction.inGuild()) return;

	await interaction.deferReply();

	const user = interaction.targetUser;

	const person = (await getPerson(interaction.guildId, user.id))?.value;

	if (!person)
		await interaction.editReply({
			content: 'No stats found for this user.'
		});
	else
		await interaction.editReply({
			content: `Stats for ${user.username}:\nScore: ${person.score}`
		});
}
