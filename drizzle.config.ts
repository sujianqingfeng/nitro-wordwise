import type { Config } from "drizzle-kit"

const connectionString = process.env.NITRO_DATABASE_URL
console.log("🚀 ~ connectionString:", connectionString)

export default {
	schema: "./server/drizzle/schema.ts",
	out: "./server/drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: connectionString,
	},
} satisfies Config
