import type { Config } from "drizzle-kit"

const connectionString = process.env.NITRO_DATABASE_URL

if (!connectionString) {
	throw new Error("Missing DATABASE_URL")
}

export default {
	schema: "./server/drizzle/schema.ts",
	out: "./server/drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: connectionString,
	},
} satisfies Config
