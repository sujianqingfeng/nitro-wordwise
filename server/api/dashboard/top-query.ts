import { subMonths, subWeeks, subYears } from "date-fns"
import { and, desc, eq, gt, isNotNull, lte, sum } from "drizzle-orm"
import { z } from "zod"
import { useAuth } from "~/composables/auth"
import db, { schema } from "~/lib/drizzle"

const dateRangeMap: Record<"1" | "2" | "3", () => [Date, Date]> = {
	// week
	1: () => {
		const now = new Date()
		const beforeAWeek = subWeeks(now, 1)
		return [beforeAWeek, now]
	},
	// month
	2: () => {
		const now = new Date()
		const beforeAMonth = subMonths(now, 1)
		return [beforeAMonth, now]
	},
	// year
	3: () => {
		const now = new Date()
		const beforeAYear = subYears(now, 1)
		return [beforeAYear, now]
	},
}

const TopQuerySchema = z.object({
	type: z.enum(["1", "2", "3"]),
})

export default defineEventHandler(async (e) => {
	const { type } = await getValidatedQuery(e, TopQuerySchema.parse)
	const { id: userId } = useAuth()
	const [start, end] = dateRangeMap[type]()

	const topQuery = await db
		.select({
			prototype: schema.queryRecords.prototype,
			count: sum(schema.queryRecords.count),
		})
		.from(schema.queryRecords)
		.where(
			and(
				isNotNull(schema.queryRecords.prototype),
				eq(schema.queryRecords.userId, userId),
				gt(schema.queryRecords.updateAt, start),
				lte(schema.queryRecords.updateAt, end),
			),
		)
		.groupBy(schema.queryRecords.prototype)
		.orderBy(desc(sum(schema.queryRecords.count)))
		.limit(10)

	return createBaseResponse(topQuery)
})
