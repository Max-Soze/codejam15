import { MongoClient } from "mongodb";
import dotenv from 'dotenv'

dotenv.config()
const uri = process.env.MONGO_URI!;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!globalThis.__mongoClientPromise) {
	client = new MongoClient(uri);
	globalThis.__mongoClientPromise = client.connect();
}

clientPromise = globalThis.__mongoClientPromise;

export { clientPromise as mongo };
