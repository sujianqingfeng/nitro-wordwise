import { and, eq } from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"
import type { z } from "zod"
import { useProfile } from "~/composables/profile"
import db, { schema } from "~/lib/drizzle"

const SelectSchema = createSelectSchema(schema.aiEngines).pick({
	engine: true,
})

export default defineEventHandler(async (e) => {
	const { engine } = (await getValidatedQuery(
		e,
		SelectSchema.parse,
	)) as z.infer<typeof SelectSchema>

	const { id } = await useProfile()
	const first = await db.query.aiEngines.findFirst({
		where: and(
			eq(schema.aiEngines.profileId, id),
			eq(schema.aiEngines.engine, engine),
		),
	})

	return createBaseResponse(first)
})
