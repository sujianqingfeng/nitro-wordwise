import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "~/drizzle/schema"

const connectionString = process.env.NITRO_DATABASE_URL

if (!connectionString) {
	throw new Error("Missing DATABASE_URL")
}

const client = postgres(connectionString)
const db = drizzle(client, { schema })

export { schema }
export default db
