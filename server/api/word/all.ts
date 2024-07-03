import { eq } from "drizzle-orm"
import { useAuth } from "~/composables/auth"
import db, { schema } from "~/lib/drizzle"

export default defineEventHandler(async () => {
	const { id } = useAuth()

	const words = await db.query.words.findMany({
		where: eq(schema.words.userId, id),
	})

	return createBaseResponse(words)
})
