import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { useProfile } from "~/composables/profile"
import { TRANSLATE_SYSTEM_ROLE_TEMPLATE } from "~/constants"
import db, { schema } from "~/lib/drizzle"
import { createAiService } from "~/services/ai"

const AnalyzeSchema = z.object({
	text: z.string().min(1),
})

const ProviderSchema = z.object({
	provider: z.enum(["deepSeek", "moonshot", "openai"]),
})

export default defineEventHandler(async (e) => {
	const { provider } = await getValidatedRouterParams(e, ProviderSchema.parse)
	const { text } = await readValidatedBody(e, AnalyzeSchema.parse)

	const { id } = await useProfile()

	const engine = await db.query.aiEngines.findFirst({
		where: and(
			eq(schema.aiEngines.engine, provider),
			eq(schema.aiEngines.profileId, id),
		),
	})

	if (!engine) {
		throw createError("not found engine")
	}

	const result = await createAiService(
		engine.engine,
		engine.config,
	).generateText({
		system: TRANSLATE_SYSTEM_ROLE_TEMPLATE,
		prompt: `翻译这句话：${text}`,
	})

	return createBaseResponse(result)
})
