import { z } from "zod"
import { useProfile } from "~/composables/profile"
import db, { schema } from "~/lib/drizzle"

const InsertTranslatorSchema = z.object({
	config: z.object({
		deepLKey: z.string().min(1),
	}),
	translator: z.enum(["deepL"]),
})

export default defineEventHandler(async (e) => {
	const body = await readValidatedBody(e, InsertTranslatorSchema.parse)

	const { id } = await useProfile()
	const { config, translator } = body

	const result = await db
		.insert(schema.translators)
		.values({
			profileId: id,
			config,
			translator,
		})
		.onConflictDoUpdate({
			target: [schema.translators.profileId, schema.translators.translator],
			set: {
				config,
			},
		})
		.returning({ id: schema.translators.id })

	return result[0]
})
