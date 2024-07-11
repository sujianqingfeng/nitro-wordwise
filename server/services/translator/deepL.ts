import type { TranslatorDeepLConfig } from "~/drizzle/schema"
import type { ITranslatorProvider } from "./translator.interface"

type DeepLResp = {
	translations: {
		text: string
	}[]
}

const FREE_API_DOMAIN = "https://api-free.deepl.com"

const deepLTranslator: ITranslatorProvider<TranslatorDeepLConfig> = ({
	deepLKey,
}) => {
	const translate = async (text: string) => {
		const data = await $fetch<DeepLResp>(`${FREE_API_DOMAIN}/v2/translate`, {
			method: "POST",
			body: {
				text: [text],
				target_lang: "ZH",
			},
			headers: {
				Authorization: `DeepL-Auth-Key ${deepLKey}`,
				"Content-Type": "application/json",
			},
		})

		const { translations } = data
		let result = ""
		if (translations.length) {
			result = translations[0].text
		}

		return result
	}

	return {
		translate,
	}
}

export default deepLTranslator
