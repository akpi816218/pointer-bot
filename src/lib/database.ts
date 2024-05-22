import { openKv } from '@deno/kv';
import { DENO_KV_URL } from '../config';
import { arrayFromAsync } from './util';

export async function DenoKV() {
	return await openKv(DENO_KV_URL);
}

export enum DatabaseKeys {
	Devs = 'devs',
	Challenges = 'challenges',
	People = 'people'
}

export async function getPeople() {
	return await arrayFromAsync(
		(await DenoKV()).list<PersonData>({ prefix: [DatabaseKeys.People] })
	);
}

export async function getPerson(id: string) {
	return (await DenoKV()).get<PersonData>([DatabaseKeys.People, id]);
}

export async function setPerson(id: string, data: PersonData) {
	return (await DenoKV()).set([DatabaseKeys.People, id], data);
}

export async function getChallenges() {
	return arrayFromAsync(
		(await DenoKV()).list<ChallengeData>({
			prefix: [DatabaseKeys.Challenges]
		})
	);
}

export async function getChallenge(id: string) {
	return (await DenoKV()).get<ChallengeData>([DatabaseKeys.Challenges, id]);
}

export async function setChallenge(id: string, data: ChallengeData) {
	return (await DenoKV()).set([DatabaseKeys.Challenges, id], data);
}

export async function getPeopleSortedByScores() {
	return (await getPeople()).sort((a, b) => b.value.score - a.value.score);
}

export interface ChallengeData {
	/**
	 * @prop {string} id The ID of the challenge
	 */
	id: string;
	/**
	 * @prop {string} name The name of the challenge
	 */
	name: string;
	/**
	 * @prop {string} description The description of the challenge
	 */
	description: string;
	/**
	 * @prop {number} maxScore The maximum score of the challenge
	 */
	maxScore: number;
	/**
	 * @prop {string} timestamp The ISO 8601 timestamp of challenge's creation or end
	 */
	timestamp: string;
	/**
	 * @prop {string[]} scorers The IDs of the people who have completed the challenge
	 */
	scorers: string[];
}

export interface PersonData {
	/**
	 * @prop {string} id The ID of the person
	 */
	id: string;
	/**
	 * @prop {number} score The score of the person
	 */
	score: number;
	/**
	 * @prop {string[]} challenges The IDs of the challenges the person has completed
	 */
	challenges: string[];
}
