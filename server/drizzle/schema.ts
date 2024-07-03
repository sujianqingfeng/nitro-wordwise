import {
	pgTable,
	varchar,
	uuid,
	timestamp,
	json,
	pgEnum,
	boolean,
} from "drizzle-orm/pg-core"

const defaultId = uuid("id").defaultRandom().notNull().primaryKey()
const createAt = timestamp("create_at", { mode: "date" }).notNull().defaultNow()

// profiles
export const profiles = pgTable("profiles", {
	id: defaultId,
	userId: uuid("user_id").notNull(),
	createAt,
})

export type TranslatorDeepLConfig = { deepLKey: string }
export const translatorEnum = pgEnum("translator", ["deepL"])
export const translators = pgTable("translators", {
	id: defaultId,
	translator: translatorEnum("").notNull(),
	invalidate: boolean("invalidate").default(false),
	config: json("config").notNull().$type<TranslatorDeepLConfig>(),
	profileId: uuid("profile_id").notNull(),
})

export const aiEngineEnum = pgEnum("engine", ["deepSeek", "openAI"])
export const aiEngines = pgTable("ai-engines", {
	id: defaultId,
	engine: aiEngineEnum("").notNull(),
	invalidate: boolean("invalidate").default(false),
	config: json("config").$type<{ [key: string]: string }>(),
	profileId: uuid("profile_id").notNull(),
})

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
