import { and, eq } from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"
import { useProfile } from "~/composables/profile"
import db, { schema } from "~/lib/drizzle"

const SelectSchema = createSelectSchema(schema.translators).pick({
	translator: true,
})

export default defineEventHandler(async (e) => {
	const { translator } = await getValidatedQuery(e, SelectSchema.parse)

	const { id } = await useProfile()
	const first = await db.query.translators.findFirst({
		where: and(
			eq(schema.translators.profileId, id),
			eq(schema.translators.translator, translator),
		),
	})

	return createBaseResponse(first)
})
