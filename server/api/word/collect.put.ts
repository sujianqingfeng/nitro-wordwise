import { eq } from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"
import { useAuth } from "~/composables/auth"
import { useZodValidBody } from "~/composables/validation"
import db, { schema } from "~/lib/drizzle"

const SelectSchema = createSelectSchema(schema.dictionary).pick({
	word: true,
})

export default defineEventHandler(async () => {
	const {
		data: { word },
	} = await useZodValidBody(SelectSchema)

	const translation = await db.query.dictionary.findFirst({
		where: eq(schema.dictionary.word, word),
	})

	if (!translation) {
		throw createError("not found translation")
	}

	const { id } = useAuth()
	await db.insert(schema.words).values({
		word,
		userId: id,
		simpleTranslation: translation.translations?.[0].translation,
	})
})
