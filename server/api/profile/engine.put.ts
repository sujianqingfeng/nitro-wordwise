import { z } from "zod"
import { useProfile } from "~/composables/profile"
import db, { schema } from "~/lib/drizzle"

const InsertEngineSchema = z.object({
	config: z.object({
		deepSeekKey: z.string(),
	}),
	engine: z.enum(["deepSeek"]),
})

const ConditionSchema = InsertEngineSchema.refine(
	(data) => {
		if (data.engine === "deepSeek") {
			return data.config.deepSeekKey
		}
	},
	{
		message: "deepSeekKey is required for deepSeek engine",
		path: ["config.deepSeekKey"],
	},
)

export default defineEventHandler(async (e) => {
	const body = await readValidatedBody(e, ConditionSchema.parse)

	const { id } = await useProfile()
	const { config, engine } = body

	const result = await db
		.insert(schema.aiEngines)
		.values({
			profileId: id,
			config,
			engine,
		})
		.onConflictDoUpdate({
			target: [schema.aiEngines.profileId, schema.aiEngines.engine],
			set: {
				config,
			},
		})
		.returning({ id: schema.aiEngines.id })

	return result[0]
})
