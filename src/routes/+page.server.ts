import type { PageServerLoad } from './$types'
import { mongo } from '$lib/server/mongo'

export const load: PageServerLoad = async () => {
    // Load tasks from Mongo
    const client = await mongo
    const database = client.db("TaskTown")
    const tasks = database.collection("tasks")
    let count = await tasks.countDocuments()
    let allTasks = await tasks.find({}).toArray()
    let taskList = JSON.parse(JSON.stringify(allTasks))

    // Load User Data from Mongo
    let userData = await database.collection("users").findOne({})
    let user = JSON.parse(JSON.stringify(userData))
    return {count, taskList, user}
}