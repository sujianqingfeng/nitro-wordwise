import { and, eq } from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"
import { useAuth } from "~/composables/auth"
import { useZodValidBody } from "~/composables/validation"
import db, { schema } from "~/lib/drizzle"

const SelectSchema = createSelectSchema(schema.words).pick({
	word: true,
})

export default defineEventHandler(async () => {
	const { id } = useAuth()

	const {
		data: { word },
	} = await useZodValidBody(SelectSchema)

	await db
		.delete(schema.words)
		.where(and(eq(schema.words.userId, id), eq(schema.words.word, word)))
})
