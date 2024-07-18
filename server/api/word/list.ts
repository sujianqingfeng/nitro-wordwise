import { eq, sql } from "drizzle-orm"
import { z } from "zod"
import { useAuth } from "~/composables/auth"
import db, { schema } from "~/lib/drizzle"
import { createPaginationResponse } from "~/utils/response"

const WordsQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	pageSize: z.coerce.number().int().positive().default(10),
})

export default defineEventHandler(async (e) => {
	const { page, pageSize } = await getValidatedQuery(e, WordsQuerySchema.parse)
	const { id } = useAuth()

	const query = db
		.select()
		.from(schema.words)
		.where(eq(schema.words.userId, id))

	const totalRecordsResult = await db
		.select({ total: sql<number>`count(*)` })
		.from(query.as("sub"))
		.execute()

	const total = Number(totalRecordsResult[0].total)
	const totalPage = Math.ceil(total / pageSize)

	const data = await query
		.limit(pageSize)
		.offset((page - 1) * pageSize)
		.execute()

	return createPaginationResponse({
		data,
		total,
		totalPage,
		page,
		pageSize,
	})
})
