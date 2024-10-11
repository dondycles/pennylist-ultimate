CREATE TABLE IF NOT EXISTS "moneys_notes_table" (
	"id" serial NOT NULL,
	"note" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moneys_notes_table" ADD CONSTRAINT "moneys_notes_table_id_moneys_table_id_fk" FOREIGN KEY ("id") REFERENCES "public"."moneys_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "moneys_table" DROP COLUMN IF EXISTS "comments";