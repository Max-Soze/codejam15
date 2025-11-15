import type { PageServerLoad, Actions } from './$types';
import { mongo } from '$lib/server/mongo';
import { ObjectId } from 'mongodb';

export const load: PageServerLoad = async () => {
	// Load tasks from Mongo
	const client = await mongo;
	const database = client.db('TaskTown');
	const tasks = database.collection('tasks');
	let count = await tasks.countDocuments();
	let allTasks = await tasks.find({ complete: false }).toArray();
	let taskList = JSON.parse(JSON.stringify(allTasks));

	// Load User Data from Mongo
	let userData = await database.collection('users').findOne({});
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
	}
} satisfies Actions;
