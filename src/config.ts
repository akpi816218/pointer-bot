import { PermissionFlagsBits, PermissionsBitField } from 'discord.js';

export const clientId = '1150536178714554459';

export const permissionsBits = new PermissionsBitField().add(
	PermissionFlagsBits.AddReactions,
	PermissionFlagsBits.AttachFiles,
	PermissionFlagsBits.EmbedLinks,
	PermissionFlagsBits.ManageMessages,
	PermissionFlagsBits.MentionEveryone,
	PermissionFlagsBits.ReadMessageHistory,
	PermissionFlagsBits.SendMessages,
	PermissionFlagsBits.SendMessagesInThreads,
	PermissionFlagsBits.ViewChannel
).bitfield;

export const PORT = 8000;

export const DENO_KV_URL =
	'https://api.deno.com/databases/5e0e377b-ecc7-4195-94d2-cfd04b04316e/connect';
