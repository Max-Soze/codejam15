import type { PageServerLoad, Actions } from './$types';
import { mongo } from '$lib/server/mongo';
import { roboFace, systemPrompt, entrySchema } from '$lib/gemini';
import { zodToJsonSchema } from 'zod-to-json-schema';

async function makeEntry(
	social: number,
	health: number,
	discipline: number,
	intellect: number,
	entry: string,
	entryDate: string
) {
	const client = await mongo;
	const entries = client.db('TaskTown').collection('entries');
	const users = client.db('TaskTown').collection('users');
	let newEntry = {
		journalEntry: entry,
		xpSocial: social,
		xpHealth: health,
		xpDiscipline: discipline,
		xpIntellect: intellect,
		entryDate: entryDate
	};
	await entries.insertOne(newEntry);
	await users.updateOne(
		{},
		{
			$inc: {
				xpTotal: social + health + discipline + intellect,
				xpSocial: social,
				xpHealth: health,
				xpDiscipline: discipline,
				xpIntellect: intellect
			},
			$set: {
				lastEntry: new Date().toISOString().slice(0, 10)
			}
		}
	);
}

export const load: PageServerLoad = async () => {
	let currentDay = new Date();

	// Load entries from Mongo
	const client = await mongo;
	const entries = client.db('TaskTown').collection('entries');
	const users = client.db('TaskTown').collection('users');
	let allEntries = await entries.find({}).toArray();
	let entryList = JSON.parse(JSON.stringify(allEntries));
	let count = entryList.length;

	// Load User Data from Mongo
	let userData = await users.findOne({});
	if (!userData) {
		users.insertOne({
			xpTotal: 0,
			xpSocial: 0,
			xpHealth: 0,
			xpDiscipline: 0,
			xpIntellect: 0,
			lastEntry: null,
			lastDecayed: null
		});
		userData = await users.findOne({});
	}
	let user = JSON.parse(JSON.stringify(userData));
	return { entryList, user, count };
};

export const actions = {
	createEntry: async ({ request }) => {
		let entryData = await request.formData();
		let social = Number(entryData.get('xpSocial'));
		let health = Number(entryData.get('xpHealth'));
		let discipline = Number(entryData.get('xpDiscipline'));
		let intellect = Number(entryData.get('xpIntellect'));
		await makeEntry(
			social,
			health,
			discipline,
			intellect,
			entryData.get('entry')?.toString() || '',
			entryData.get('entryDate')?.toString() || new Date().toISOString().slice(0, 10)
		);
	},

	generateEntry: async ({ request }) => {
		let data = await request.formData();
		let description = data.get('description');
		let prompt: string;
		if (!description) {
			return;
		} else {
			prompt = description.toString();
		}
		const response = await roboFace.models.generateContent({
			model: 'gemini-flash-latest',
			contents: prompt,
			config: {
				responseMimeType: 'application/json',
				responseJsonSchema: zodToJsonSchema(entrySchema),
				systemInstruction: systemPrompt
			}
		});

		if (response.text == undefined) {
			console.log('Failed to generate model response.');
		} else {
			const entry = entrySchema.parse(JSON.parse(response.text));
			let entryDate = data.get('entryDate')?.toString() || new Date().toISOString().slice(0, 10);
			await makeEntry(
				entry.social_points,
				entry.health_points,
				entry.discipline_points,
				entry.intellect_points,
				entry.journal_entry,
				entryDate
			);
		}
	}
} satisfies Actions;
