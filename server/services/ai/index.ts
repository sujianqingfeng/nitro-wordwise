import type { schema } from "~/lib/drizzle"
import createDeepSeek from "./deep-seek"
import createMoonshot from "./moonshot"
import type { AIEngineConfig } from "~/drizzle/schema"

export function createAiService(
	engine: typeof schema.aiEngines.$inferSelect.engine,
	config: AIEngineConfig,
) {
	switch (engine) {
		case "deepSeek":
			return createDeepSeek(config)

		case "moonshot":
			return createMoonshot(config)

		default:
			return createDeepSeek(config)
	}
}

export async function verifyAiService(
	engine: typeof schema.aiEngines.$inferSelect.engine,
	config: AIEngineConfig,
) {
	const result = await createAiService(engine, config).generateText({
		system: "",
		prompt: "hello",
	})

	return !!result
}
