import { eq } from "drizzle-orm"
import { z } from "zod"
import { useProfile } from "~/composables/profile"
import db, { schema } from "~/lib/drizzle"
import { verifyAiService } from "~/services/ai"

const InsertEngineSchema = z.object({
	config: z.object({
		apiKey: z.string(),
	}),
	engine: z.enum(["deepSeek", "moonshot", "openai"]),
})

const ConditionSchema = InsertEngineSchema.refine(
	(data) => {
		if (
			data.engine === "deepSeek" ||
			data.engine === "moonshot" ||
			data.engine === "openai"
		) {
			return data.config.apiKey
		}
	},
	{
		message: "apiKey is required",
		path: ["config.apiKey"],
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

	verifyAiService(engine, config).then((valid) => {
		db.update(schema.aiEngines)
			.set({ valid })
			.where(eq(schema.aiEngines.id, result[0].id))
	})

	return result[0]
})
