import { test, describe, expect } from "bun:test"
import createGemini from "../gemini"

describe("gemini", () => {
	test(
		"generate",
		async () => {
			const apiKey = process.env.TEST_GEMINI_API_KEY

			if (!apiKey) {
				throw new Error("GEMINI_API_KEY is not set")
			}

			const text = await createGemini({ apiKey }).generateText({
				system: "翻译并分析句子成分：",
				prompt:
					"The code-first automation platform to seamlessly create and integrate custom JavaScript logic into any system, allowing you to easily extend your tools",
			})

			expect(text).toMatchSnapshot()
		},
		{
			timeout: 60 * 1000,
		},
	)
})
