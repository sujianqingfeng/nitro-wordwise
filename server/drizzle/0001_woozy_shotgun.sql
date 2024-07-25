CREATE TABLE IF NOT EXISTS "query_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" varchar(20) NOT NULL,
	"prototype" varchar(20),
	"user_id" uuid NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"update_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_engines" ADD COLUMN "update_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "translators" ADD COLUMN "update_at" timestamp DEFAULT now() NOT NULL;