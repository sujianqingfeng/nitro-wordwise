import { test, describe, expect } from "bun:test"
import { EdgeTTS } from "@andresaya/edge-tts"

describe("edge-tts", () => {
	test(
		"tts",
		async () => {
			const tts = new EdgeTTS()
			const voice = "en-GB-RyanNeural"

			await tts.synthesize("Hello, world!", voice, {
				rate: "0%",
				volume: "0%",
				pitch: "0Hz",
			})

			const base64 = tts.toBase64()
			expect(base64).toBeDefined()
		},

		{
			timeout: 60 * 1000,
		},
	)
})
