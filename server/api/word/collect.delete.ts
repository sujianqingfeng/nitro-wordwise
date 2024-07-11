import { and, eq } from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"
import { useAuth } from "~/composables/auth"
import db, { schema } from "~/lib/drizzle"

const SelectSchema = createSelectSchema(schema.words).pick({
	word: true,
})

export default defineEventHandler(async (e) => {
	const { word } = await readValidatedBody(e, SelectSchema.parse)
	const { id } = useAuth()

	await db
		.delete(schema.words)
		.where(and(eq(schema.words.userId, id), eq(schema.words.word, word)))

	return createBaseResponse()
})
