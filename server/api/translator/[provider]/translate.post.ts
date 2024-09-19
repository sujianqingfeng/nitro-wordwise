import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { useProfile } from "~/composables/profile"
import db, { schema } from "~/lib/drizzle"
import { createTranslatorService } from "~/services/translator"

const TranslateSchema = z.object({
	text: z.string().min(1),
})

const ProviderSchema = z.object({
	provider: z.enum(["deepL", "deepLX"]),
})

export default defineEventHandler(async (e) => {
	const { provider } = await getValidatedRouterParams(e, ProviderSchema.parse)
	const { text } = await readValidatedBody(e, TranslateSchema.parse)

	const { id } = await useProfile()

	const translator = await db.query.translators.findFirst({
		where: and(
			eq(schema.translators.translator, provider),
			eq(schema.translators.profileId, id),
		),
	})

	if (!translator) {
		throw createError("not found translator")
	}

	const result = await createTranslatorService(
		provider,
		translator.config,
	).translate(text)

	return createBaseResponse(result)
})
