CREATE TABLE IF NOT EXISTS "logs_table" (
	"id" serial NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"lister" text NOT NULL,
	"action" text,
	"reason" text NOT NULL,
	"changes" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "moneys_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"amount" real NOT NULL,
	"lister" text NOT NULL
);
--> statement-breakpoint
DROP TABLE "posts_table";--> statement-breakpoint
DROP TABLE "users_table";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "logs_table" ADD CONSTRAINT "logs_table_id_moneys_table_id_fk" FOREIGN KEY ("id") REFERENCES "public"."moneys_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
