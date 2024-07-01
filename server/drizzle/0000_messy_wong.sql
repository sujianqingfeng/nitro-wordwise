DO $$ BEGIN
 CREATE TYPE "public"."engine" AS ENUM('deepSeek', 'openAI');
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
CREATE TABLE IF NOT EXISTS "ai-engines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"" "engine",
	"invalidate" boolean DEFAULT false,
	"config" json,
	"profile_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dictionary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" varchar(20),
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
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"" "translator",
	"invalidate" boolean DEFAULT false,
	"config" json,
	"profile_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" varchar(20),
	"simple_translate" varchar(100),
	"user_id" uuid NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "words_word_unique" UNIQUE("word")
);
