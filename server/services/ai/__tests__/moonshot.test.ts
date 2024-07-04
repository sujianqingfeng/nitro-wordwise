import { test, describe, expect } from "bun:test"
import { SYSTEM_ROLE } from "./constants"
import createMoonshot from "../moonshot"

describe("moonshot", () => {
	test(
		"generate",
		async () => {
			const apiKey = process.env.TEST_MOONSHOT_API_KEY

			if (!apiKey) {
				throw new Error("DEEP_SEEK_API_KEY is not set")
			}

			const text = await createMoonshot({ apiKey }).generateText({
				system: SYSTEM_ROLE,
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
