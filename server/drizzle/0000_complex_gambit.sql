DO $$ BEGIN
 CREATE TYPE "public"."engine" AS ENUM('deepSeek', 'moonshot');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."translator" AS ENUM('deepL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_engines" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"engine" "engine" NOT NULL,
	"valid" boolean DEFAULT false,
	"config" json NOT NULL,
	"profile_id" uuid NOT NULL,
	CONSTRAINT "ai_engines_profile_id_engine_pk" PRIMARY KEY("profile_id","engine")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dictionary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" varchar(20) NOT NULL,
	"sw" varchar(20),
	"uk_phonetic" varchar(30),
	"us_phonetic" varchar(30),
	"uk_speech" varchar(100),
	"us_speech" varchar(100),
	"exam_types" json DEFAULT '[]'::json,
	"translations" json,
	"prototype_id" uuid,
	"form_name" varchar(10),
	"create_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dictionary_word_unique" UNIQUE("word")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "translators" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"translator" "translator" NOT NULL,
	"valid" boolean DEFAULT false,
	"config" json NOT NULL,
	"profile_id" uuid NOT NULL,
	CONSTRAINT "translators_profile_id_translator_pk" PRIMARY KEY("profile_id","translator")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" varchar(20) NOT NULL,
	"simple_translate" varchar(100),
	"user_id" uuid NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "words_word_unique" UNIQUE("word")
);
