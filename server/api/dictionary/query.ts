import { eq } from "drizzle-orm"
import { z } from "zod"
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

	if (
		local?.ukPhonetic &&
		local.translations &&
		local.translations?.length > 0
	) {
		return createBaseResponse(local)
	}

	const result = await dictionary.query(word)
	saveDictionary(result)
	return createBaseResponse(result)
})

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
