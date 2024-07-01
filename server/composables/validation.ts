import type { ZodType } from "zod"

export function useZodValidQuery<T = any>(schema: ZodType<T>) {
	const e = useEvent()
	const query = getQuery(e)

	const { error, data } = schema.safeParse(query)
	if (error) {
		throw createError(error.errors[0].message)
	}

	return { data }
}

export async function useZodValidBody<T = any>(schema: ZodType<T>) {
	const e = useEvent()
	const body = await readBody(e)

	const { error, data } = schema.safeParse(body)
	if (error) {
		throw createError(error.errors[0].message)
	}

	return { data }
}
