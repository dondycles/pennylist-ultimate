DO $$ BEGIN
 ALTER TABLE "logs_table" ADD CONSTRAINT "logs_table_money_id_moneys_table_id_fk" FOREIGN KEY ("money_id") REFERENCES "public"."moneys_table"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
