import { and, eq, isNotNull } from "drizzle-orm"
import { z } from "zod"
import { useAuth } from "~/composables/auth"
import db, { schema } from "~/lib/drizzle"
import { dictionary } from "~/services/dictionary"
import type { IDictionaryQueryResult } from "~/services/dictionary/provider.interface"
import { stripWord } from "~/services/dictionary/utils"
import logger from "~/utils/logger"

const Schema = z.object({
	word: z.string().min(1),
})

export default defineEventHandler(async (e) => {
	const { word } = await getValidatedQuery(e, Schema.parse)

	const local = await getLocalDictionary(word)
	const { id: userId } = useAuth()

	if (
		local?.ukPhonetic &&
		local.translations &&
		local.translations?.length > 0
	) {
		const prototypes = await db.query.dictionary.findMany({
			where: and(
				eq(schema.dictionary.prototypeId, local.id),
				isNotNull(schema.dictionary.formName),
			),
		})

		const forms = prototypes.map((item) => {
			return {
				name: item.formName,
				value: item.word,
			}
		})

		const result = {
			...local,
			forms,
		}
		addQueryRecord({ userId, word, prototypeId: local.prototypeId })
		return createBaseResponse(result)
	}

	const result = await dictionary.query(word)
	saveDictionary(result)
	const { prototype } = result
	addQueryRecord({ userId, word, prototype })
	return createBaseResponse(result)
})

async function addQueryRecord({
	userId,
	word,
	prototype,
	prototypeId,
}: {
	userId: string
	word: string
	prototype?: string
	prototypeId?: string | null
}) {
	if (prototypeId) {
		const r = await db.query.dictionary.findFirst({
			where: eq(schema.dictionary.id, prototypeId),
		})
		if (r) {
			prototype = r.word
		}
	}

	if (!prototype) {
		prototype = word
	}

	const where = and(
		eq(schema.queryRecords.word, word),
		eq(schema.queryRecords.userId, userId),
	)

	const ifExistRecord = await db.query.queryRecords.findFirst({
		where,
	})

	if (ifExistRecord) {
		db.update(schema.queryRecords)
			.set({
				count: ifExistRecord.count + 1,
				prototype,
			})
			.where(where)
			.execute()
		return
	}

	db.insert(schema.queryRecords)
		.values({
			word,
			userId,
			prototype,
			count: 1,
		})
		.execute()
}

async function getLocalDictionary(word: string) {
	const first = await db.query.dictionary.findFirst({
		where: eq(schema.dictionary.word, word),
	})
	return first
}

async function saveDictionary(dict: IDictionaryQueryResult) {
	const { word } = dict
	try {
		await db.transaction(async (trx) => {
			const { prototype, forms, examTypes, ...rest } = dict

			let prototypeRecord:
				| typeof schema.dictionary.$inferSelect
				| null
				| undefined = null

			if (prototype) {
				prototypeRecord = await trx.query.dictionary.findFirst({
					where: eq(schema.dictionary.word, prototype),
				})
				if (!prototypeRecord) {
					prototypeRecord = (
						await trx
							.insert(schema.dictionary)
							.values({
								word: prototype,
								sw: stripWord(prototype),
								examTypes,
							})
							.returning()
					)[0]
				}
			}

			const current = (
				await trx
					.insert(schema.dictionary)
					.values({
						sw: stripWord(word),
						examTypes,
						...rest,
						prototypeId: prototypeRecord ? prototypeRecord.id : null,
					})
					.onConflictDoUpdate({
						target: schema.dictionary.word,
						set: {
							examTypes,
							...rest,
						},
					})
					.returning()
			)[0]

			if (!prototype && forms.length) {
				for (const form of forms) {
					const { name, value } = form

					await trx
						.insert(schema.dictionary)
						.values({
							word: value,
							examTypes,
							formName: name,
							sw: stripWord(value),
							prototypeId: current.id,
						})
						.onConflictDoUpdate({
							target: schema.dictionary.word,
							set: {
								formName: name,
							},
						})
				}
			}
		})
	} catch (e) {
		logger.error(`saveDictionary failed: ${word}`, e)
	}
}
