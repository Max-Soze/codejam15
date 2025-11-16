import type { PageServerLoad, Actions } from './$types';
import { mongo } from '$lib/server/mongo';
import { ObjectId } from 'mongodb';
import { roboFace, systemPrompt, pointSchema } from '$lib/gemini';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const load: PageServerLoad = async () => {
	const currentDay = new Date();

	// Load tasks from Mongo
	const client = await mongo;
	const tasks = client.db('TaskTown').collection('tasks');
	const users = client.db('TaskTown').collection('users');
	let count = await tasks.countDocuments();
	let allTasks = await tasks.find({ complete: false }).toArray();
	let taskList = JSON.parse(JSON.stringify(allTasks));

	// Load User Data from Mongo
	let userData = await users.findOne({});
	if (!userData) {
		users.insertOne({
			xpTotal: 0,
			xpSocial: 0,
			xpHealth: 0,
			xpDiscipline: 0,
			xpIntellect: 0,
			lastSocial: 0,
			lastHealth: 0,
			lastDiscipline: 0,
			lastIntellect: 0,
			streakSocial: 0,
			streakHealth: 0,
			streakDiscipline: 0,
			streakIntellect: 0,
			decayedSocial: 0,
			decayedHealth: 0,
			decayedDiscipline: 0,
			decayedIntellect: 0
		});
		userData = await users.findOne({});
	}
	let user = JSON.parse(JSON.stringify(userData));
	return { count, taskList, user };
};

export const actions = {
	createTask: async ({ request }) => {
		const client = await mongo;
		const tasks = client.db('TaskTown').collection('tasks');
		let taskData = await request.formData();
		let newTask = {
			task: taskData.get('task'),
			complete: false,
			xpSocial: taskData.get('xpSocial'),
			xpHealth: taskData.get('xpHealth'),
			xpDiscipline: taskData.get('xpDiscipline'),
			xpIntellect: taskData.get('xpIntellect'),
			dueDate: taskData.get('dueDate')
		};
		await tasks.insertOne(newTask);
	},

	completeTask: async ({ request }) => {
		const client = await mongo;
		const tasks = client.db('TaskTown').collection('tasks');
		let data = await request.formData();
		let id = data.get('id')?.toString();
		let xpSocial = Number(data.get('xpSocial'));
		let xpHealth = Number(data.get('xpHealth'));
		let xpDiscipline = Number(data.get('xpDiscipline'));
		let xpIntellect = Number(data.get('xpIntellect'));
		if (
			id == null ||
			xpHealth == null ||
			xpSocial == null ||
			xpDiscipline == null ||
			xpIntellect == null
		) {
			return;
		}
		await tasks.updateOne({ _id: new ObjectId(id) }, { $set: { complete: true } });
		await client
			.db('TaskTown')
			.collection('users')
			.updateOne(
				{},
				{
					$inc: {
						xpSocial: xpSocial,
						xpHealth: xpHealth,
						xpDiscipline: xpDiscipline,
						xpIntellect: xpIntellect,
						xpTotal: xpSocial + xpHealth + xpDiscipline + xpIntellect
					}
				}
			);
	},

	generateTask: async ({ request }) => {
		const client = await mongo;
		const tasks = client.db('TaskTown').collection('tasks');
		let data = await request.formData();
		let task = data.get('task');
		let description = data.get('description');
		let duration = data.get('description');

		let prompt =
			'Task: ' + task + '\n' + 'Description: ' + description + '\n' + 'Duration: ' + duration;
		const response = await roboFace.models.generateContent({
			model: 'gemini-flash-latest',
			contents: prompt,
			config: {
				responseMimeType: 'application/json',
				responseJsonSchema: zodToJsonSchema(pointSchema),
				systemInstruction: systemPrompt
			}
		});

		if (response.text == undefined) {
			console.log('Failed to generate model response.');
		} else {
			const assignment = pointSchema.parse(JSON.parse(response.text));
			let newTask = {
				task: task,
				complete: false,
				xpSocial: assignment.social_points,
				xpHealth: assignment.health_points,
				xpDiscipline: assignment.discipline_points,
				xpIntellect: assignment.intellect_points,
				dueDate: data.get('dueDate')
			};
			await tasks.insertOne(newTask);
		}
	}
} satisfies Actions;
