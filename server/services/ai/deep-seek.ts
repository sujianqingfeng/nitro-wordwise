import { createOpenAI } from "@ai-sdk/openai"
import { generateText as aiGenerateText } from "ai"
import type { IAIProvider } from "./provider.interface"

const API_BASE_URL = "https://api.deepseek.com"

const createDeepSeek: IAIProvider<{ apiKey: string }> = ({ apiKey }) => {
	const openai = createOpenAI({
		baseURL: API_BASE_URL,
		apiKey,
	})

	return {
		generateText: async ({ system, prompt }) => {
			const { text } = await aiGenerateText({
				model: openai("deepseek-chat"),
				system,
				prompt,
			})
			return text
		},
	}
}

export default createDeepSeek