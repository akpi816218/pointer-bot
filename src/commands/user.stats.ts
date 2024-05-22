import {
	ApplicationCommandType,
	ContextMenuCommandBuilder,
	UserContextMenuCommandInteraction
} from 'discord.js';

export const data = new ContextMenuCommandBuilder()
	.setName('User Stats')
	.setType(ApplicationCommandType.User)
	.setDMPermission(false);

export async function execute(interaction: UserContextMenuCommandInteraction) {
	await interaction.deferReply();
}
