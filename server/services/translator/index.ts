import type { schema } from "~/lib/drizzle"
import deepLTranslator from "./deepL"
import deepLXTranslator from "./deepLX"
import type { TranslatorDeepLConfig } from "~/drizzle/schema"

export function createTranslatorService(
	translator: typeof schema.translators.$inferSelect.translator,
	config: TranslatorDeepLConfig,
) {
	switch (translator) {
		case "deepL":
			return deepLTranslator(config)

		case "deepLX":
			return deepLXTranslator(config)

		default:
			return deepLTranslator(config)
	}
}
