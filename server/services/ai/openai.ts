import { createOpenAI as createOpenAIBase } from "@ai-sdk/openai"
import { generateText as aiGenerateText, streamText as aiStreamText } from "ai"
import type { IAIProvider } from "./provider.interface"

const API_BASE_URL = "https://api.chatanywhere.tech"

const createOpenAI: IAIProvider<{ apiKey: string }> = ({ apiKey }) => {
	const openai = createOpenAIBase({
		baseURL: API_BASE_URL,
		apiKey,
	})

	return {
		generateText: async ({ system, prompt }) => {
			const { text } = await aiGenerateText({
				model: openai("gpt-4.1-mini"),
				system,
				prompt,
			})
			return text
		},
		streamText: async ({ system, prompt }) => {
			const { textStream } = await aiStreamText({
				model: openai("gpt-4.1-mini"),
				system,
				prompt,
			})

			return textStream
		},
	}
}

export default createOpenAI
