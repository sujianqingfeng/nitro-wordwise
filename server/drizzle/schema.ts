import {
	pgTable,
	varchar,
	uuid,
	timestamp,
	json,
	pgEnum,
	boolean,
	primaryKey,
	integer,
} from "drizzle-orm/pg-core"

const defaultId = uuid("id").defaultRandom().notNull().primaryKey()
const createAt = timestamp("create_at", { mode: "date" }).notNull().defaultNow()
const updateAt = timestamp("update_at", { mode: "date" })
	.notNull()
	.defaultNow()
	.$onUpdate(() => new Date())

// profiles
export const profiles = pgTable("profiles", {
	id: defaultId,
	userId: uuid("user_id").notNull(),
	createAt,
})

export type TranslatorDeepLConfig = { deepLKey: string }
export const translatorEnum = pgEnum("translator", ["deepL", "deepLX"])
export const translators = pgTable(
	"translators",
	{
		id: uuid("id").defaultRandom().notNull(),
		translator: translatorEnum("translator").notNull(),
		valid: boolean("valid").default(false),
		config: json("config").notNull().$type<TranslatorDeepLConfig>(),
		profileId: uuid("profile_id").notNull(),
		updateAt,
	},
	(table) => {
		return {
			pk: primaryKey({
				columns: [table.profileId, table.translator],
			}),
		}
	},
)

type AIEngineDeepSeekConfig = { apiKey: string }
type AIEngineMoonshotConfig = { apiKey: string }
export type AIEngineConfig = AIEngineDeepSeekConfig | AIEngineMoonshotConfig
export const aiEngineEnum = pgEnum("engine", ["deepSeek", "moonshot"])
export const aiEngines = pgTable(
	"ai_engines",
	{
		id: uuid("id").defaultRandom().notNull(),
		engine: aiEngineEnum("engine").notNull(),
		valid: boolean("valid").default(false),
		config: json("config").notNull().$type<AIEngineConfig>(),
		profileId: uuid("profile_id").notNull(),
		updateAt,
	},
	(table) => {
		return {
			pk: primaryKey({
				columns: [table.profileId, table.engine],
			}),
		}
	},
)

// dictionary
export const dictionary = pgTable("dictionary", {
	id: defaultId,
	word: varchar("word", { length: 20 }).unique().notNull(),
	sw: varchar("sw", { length: 20 }),
	ukPhonetic: varchar("uk_phonetic", { length: 30 }),
	usPhonetic: varchar("us_phonetic", { length: 30 }),
	ukSpeech: varchar("uk_speech", { length: 100 }),
	usSpeech: varchar("us_speech", { length: 100 }),

	examTypes: json("exam_types").$type<string[]>().default([]),
	translations:
		json("translations").$type<{ partName: string; translation: string }[]>(),

	prototypeId: uuid("prototype_id"),
	formName: varchar("form_name", { length: 10 }),

	createAt,
})

// words
export const words = pgTable("words", {
	id: defaultId,
	word: varchar("word", { length: 20 }).unique().notNull(),
	simpleTranslation: varchar("simple_translate", { length: 100 }),
	userId: uuid("user_id").notNull(),
	createAt,
})

// query_records
export const queryRecords = pgTable("query_records", {
	id: defaultId,
	word: varchar("word", { length: 20 }).notNull(),
	prototype: varchar("prototype", { length: 20 }),
	userId: uuid("user_id").notNull(),
	count: integer("count").notNull().default(0),
	createAt,
	updateAt,
})
