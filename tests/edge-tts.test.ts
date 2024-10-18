import { test, describe, expect } from "bun:test"
import { Client } from "@gradio/client"
import type { EdgeTTSResultItem } from "~~/types"

describe("edge-tts", () => {
	test(
		"tts",
		async () => {
			const client = await Client.connect("innoai/Edge-TTS-Text-to-Speech")
			const result = await client.predict("/predict", {
				text: "Hello",
				voice: "en-GB-RyanNeural - en-GB (Male)",
				rate: 0,
				pitch: 0,
			})

			const data = result.data as EdgeTTSResultItem[]
			expect(data.length).toBeGreaterThanOrEqual(1)
		},
		{
			timeout: 10 * 1000,
		},
	)
})
