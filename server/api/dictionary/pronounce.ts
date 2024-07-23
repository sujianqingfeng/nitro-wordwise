import { z } from "zod"
import { generatePronounceUrl } from "~/services/pronounce/youdao"

const Schema = z.object({
	word: z.string().min(1),
	type: z.enum(["1", "2"]).default("1"),
})

export default defineEventHandler(async (e) => {
	const { word, type } = await getValidatedQuery(e, Schema.parse)
	const url = generatePronounceUrl(word, type)
	return createBaseResponse({ url })
})
