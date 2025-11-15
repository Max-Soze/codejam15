import type { PageServerLoad } from './$types'
import { mongo } from '$lib/server/mongo'

export const load: PageServerLoad = async () => {
    const client = await mongo
    const database = client.db("TaskTown")
    const tasks = database.collection("tasks")
    let count = await tasks.countDocuments()
    return {count}
}