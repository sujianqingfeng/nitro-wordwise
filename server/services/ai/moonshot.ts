import { createOpenAI } from "@ai-sdk/openai"
import { generateText as aiGenerateText } from "ai"
import type { IAIProvider } from "./provider.interface"

const API_BASE_URL = "https://api.moonshot.cn/v1"

const createMoonshot: IAIProvider<{ apiKey: string }> = ({ apiKey }) => {
	const openai = createOpenAI({
		baseURL: API_BASE_URL,
		apiKey,
	})

	return {
		generateText: async ({ system, prompt }) => {
			const { text } = await aiGenerateText({
				model: openai("moonshot-v1-8k"),
				system,
				prompt,
			})
			return text
		},
	}
}

export default createMoonshot