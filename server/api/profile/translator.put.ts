import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { useProfile } from "~/composables/profile"
import { useZodValidBody } from "~/composables/validation"
import db, { schema } from "~/lib/drizzle"

const InsertTranslatorSchema = createInsertSchema(schema.translators, {
	config: z.object({
		deepLKey: z.string(),
	}),
}).omit({
	profileId: true,
})

export default defineEventHandler(async () => {
	const { data } = await useZodValidBody(InsertTranslatorSchema)
	const { id } = await useProfile()
	const { config } = data

	const result = await db
		.insert(schema.translators)
		.values({
			...data,
			profileId: id,
			config,
		})
		.onConflictDoUpdate({
			target: schema.translators.id,
			set: {
				config,
			},
		})
		.returning({ id: schema.translators.id })

	return result[0]
})
