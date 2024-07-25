import { subYears } from "date-fns"
import { and, eq, gt, lte, sql } from "drizzle-orm"
import { useAuth } from "~/composables/auth"
import db, { schema } from "~/lib/drizzle"

type YearCalendarResp = {
	[key: string]: {
		count: number
	}
}

export default defineEventHandler(async () => {
	const { id: userId } = useAuth()

	const now = new Date()
	const beforeAYear = subYears(now, 1)

	const dateCounts = await db
		.select({
			count: sql<number>`COUNT(${schema.words.id})`.mapWith(Number),
			date: sql<string>`DATE(${schema.words.createAt})`,
		})
		.from(schema.words)
		.where(
			and(
				eq(schema.words.userId, userId),
				gt(schema.words.createAt, beforeAYear),
				lte(schema.words.createAt, now),
			),
		)
		.groupBy(sql`DATE(${schema.words.createAt})`)

	const result: YearCalendarResp = {}
	for (const dateCount of dateCounts) {
		result[dateCount.date] = { count: dateCount.count }
	}

	return createBaseResponse(result)
})
