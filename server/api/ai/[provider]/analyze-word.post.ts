import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { useProfile } from "~/composables/profile"
import { ANALYZE_WORD_SYSTEM_ROLE_TEMPLATE } from "~/constants"
import db, { schema } from "~/lib/drizzle"
import { createAiService } from "~/services/ai"
import { readTextStreamToH3EventStream } from "~/utils/stream"

const AnalyzeWordSchema = z.object({
	word: z.string().min(1),
})

const ProviderSchema = z.object({
	provider: z.enum(["deepSeek"]),
})

export default defineEventHandler(async (e) => {
	const { provider } = await getValidatedRouterParams(e, ProviderSchema.parse)
	const { word } = await readValidatedBody(e, AnalyzeWordSchema.parse)

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

	const textStream = await createAiService(
		engine.engine,
		engine.config,
	).streamText({
		system: ANALYZE_WORD_SYSTEM_ROLE_TEMPLATE,
		prompt: `分析这个单词:${word}`,
	})

	const eventStream = createEventStream(e)
	readTextStreamToH3EventStream(textStream, eventStream)
	return eventStream.send()
})
