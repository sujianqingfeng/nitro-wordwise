import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { useAuth } from "~/composables/auth"
import db, { schema } from "~/lib/drizzle"

const QuerySchema = z.object({
	word: z.string().min(1),
})

export default defineEventHandler(async (e) => {
	const { word } = await getValidatedQuery(e, QuerySchema.parse)
	const { id } = useAuth()

	const first = await db.query.words.findFirst({
		where: and(eq(schema.words.userId, id), eq(schema.words.word, word)),
	})

	return createBaseResponse({
		collected: !!first,
	})
})
