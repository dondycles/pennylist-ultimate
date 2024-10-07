ALTER TABLE "logs_table" DROP CONSTRAINT "logs_table_id_moneys_table_id_fk";
--> statement-breakpoint
ALTER TABLE "logs_table" ADD COLUMN "money_id" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "logs_table" ADD CONSTRAINT "logs_table_money_id_moneys_table_id_fk" FOREIGN KEY ("money_id") REFERENCES "public"."moneys_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
