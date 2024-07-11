import type { schema } from "~/lib/drizzle"
import deepLTranslator from "./deepL"
import type { TranslatorDeepLConfig } from "~/drizzle/schema"

export function createTranslatorService(
	translator: typeof schema.translators.$inferSelect.translator,
	config: TranslatorDeepLConfig,
) {
	switch (translator) {
		case "deepL":
			return deepLTranslator(config)

		default:
			return deepLTranslator(config)
	}
}
