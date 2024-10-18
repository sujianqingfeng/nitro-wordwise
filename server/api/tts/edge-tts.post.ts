import { z } from "zod"
import { EdgeTTS } from "@andresaya/edge-tts"

const EdgeTTSSchema = z.object({
	text: z.string().min(1),
	rate: z.number().min(-100).max(100).default(0),
})

const defaultVoice = "en-GB-RyanNeural"

export default defineEventHandler(async (e) => {
	const { text, rate } = await readValidatedBody(e, EdgeTTSSchema.parse)

	const tts = new EdgeTTS()

	await tts.synthesize(text, defaultVoice, {
		rate: `${rate}%`,
		volume: "0%",
		pitch: "0Hz",
	})

	tts.toRaw()

	const base64 = tts.toBase64()

	return createBaseResponse({
		base64: `data:audio/mpeg;base64,${base64}`,
	})
})
