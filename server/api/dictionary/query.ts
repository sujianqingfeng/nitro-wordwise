import { z } from "zod"
import { useZodValidQuery } from "~/composables/validation"
import { dictionary } from "~/services/dictionary"

const Schema = z.object({
	word: z.string().min(1),
})

export default defineEventHandler(async () => {
	const { data } = useZodValidQuery(Schema)

	const result = await dictionary.query(data.word)

	return createBaseResponse(result)
})
