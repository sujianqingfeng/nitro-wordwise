import type { TranslatorDeepLConfig } from "~/drizzle/schema"
import type { ITranslatorProvider } from "./translator.interface"

type DeepLResp = {
	translations: {
		text: string
	}[]
}

const FREE_API_DOMAIN = "https://deeplx.missuo.ru"

const deepLXTranslator: ITranslatorProvider<TranslatorDeepLConfig> = ({
	deepLKey,
}) => {
	const translate = async (text: string) => {
		const data = await $fetch<DeepLResp>(
			`${FREE_API_DOMAIN}/v2/translate?key=${deepLKey}`,
			{
				method: "POST",
				body: {
					text: [text],
					target_lang: "ZH",
				},
				headers: {
					"Content-Type": "application/json",
				},
			},
		)

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

export default deepLXTranslator
