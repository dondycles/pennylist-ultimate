ALTER TABLE "moneys_table" ALTER COLUMN "created_at" DROP EXPRESSION;--> statement-breakpoint
ALTER TABLE "moneys_table" ADD COLUMN "last_update" timestamp with time zone DEFAULT now() NOT NULL;