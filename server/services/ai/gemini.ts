import type { IAIProvider } from "./provider.interface"
import { generateText as aiGenerateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

const createGemini: IAIProvider<{ apiKey: string }> = ({ apiKey }) => {
	const google = createGoogleGenerativeAI({
		apiKey,
	})

	return {
		generateText: async ({ system, prompt }) => {
			const { text } = await aiGenerateText({
				model: google("models/gemini-1.5-flash-latest"),
				system,
				prompt,
			})
			return text
		},
	}
}

export default createGemini
