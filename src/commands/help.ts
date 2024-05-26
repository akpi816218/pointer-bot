import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	inlineCode
} from 'discord.js';
import { CommandHelpEntry } from '../lib/CommandHelpEntry';
import { Jsoning } from 'jsoning';
import { Collection } from '@discordjs/collection';

const db = new Jsoning('botfiles/cmnds.db.json');

export const help = new CommandHelpEntry(
	'help',
	'Shows general help or help for a specific command',
	'[command: string]'
);

export const data = new SlashCommandBuilder()
	.setName('help')
	.setDescription('Shows help')
	.addStringOption(option => {
		return option
			.setName('command')
			.setDescription('The command to show help for')
			.setChoices(
				...Object.keys(db.all()).map(key => {
					return { name: key, value: key };
				})
			)
			.setRequired(false);
	});

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const embed = new EmbedBuilder()
		.setTitle('Command Help')
		.setDescription(
			`\`[argument: type]\` represents an optional argument. \`<argument: type>\` represents a required argument.\n\`@self\` represents the user who ran the command.\n\`type || default\` means an option of type \`type\`with a default value of \`default\`.\n\`[argument: a < number < b]\` represents an optional argument of type \`number\` between \`a\` and \`b\` (exclusive). `
		)
		.setTimestamp()
		.setFooter({
			iconURL: interaction.client.user.displayAvatarURL(),
			text: `Requested by ${interaction.user.username}`
		})
		.setColor(0x00ff00);
	const command = interaction.options.getString('command');
	const fields = new Collection(
		Object.values(db.all()).map(v => [v.name, CommandHelpEntry.fromJSON(v)])
	);
	if (!command) embed.setFields(...fields.map(v => v.toDiscordAPIEmbedField()));
	else if (fields.has(command))
		embed.setFields(fields.get(command)!.toDiscordAPIEmbedField());
	else
		embed.setDescription(
			`Command ${inlineCode(command)} not found. Use ${inlineCode(
				'/help'
			)} to see all commands.`
		);

	await interaction.reply({
		embeds: [embed]
	});
};
