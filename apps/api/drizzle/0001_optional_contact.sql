-- finalized-sqlite-v1
PRAGMA defer_foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_customers` (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`tax_id_original` text NOT NULL,
	`tax_id_normalized` text NOT NULL,
	`contact_name` text,
	`contact_email` text NOT NULL,
	`country_code` text NOT NULL,
	`plan_code` text NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT "customer_name_valid" CHECK(length("__new_customers"."company_name") BETWEEN 1 AND 200 AND "__new_customers"."company_name" = trim("__new_customers"."company_name")),
	CONSTRAINT "customer_tax_original_valid" CHECK(length("__new_customers"."tax_id_original") BETWEEN 1 AND 64 AND "__new_customers"."tax_id_original" = trim("__new_customers"."tax_id_original")),
	CONSTRAINT "customer_tax_normalized_valid" CHECK(length("__new_customers"."tax_id_normalized") BETWEEN 1 AND 64 AND "__new_customers"."tax_id_normalized" = trim("__new_customers"."tax_id_normalized")),
	CONSTRAINT "customer_contact_valid" CHECK(length("__new_customers"."contact_name") BETWEEN 1 AND 200 AND "__new_customers"."contact_name" = trim("__new_customers"."contact_name")),
	CONSTRAINT "customer_email_valid" CHECK(length("__new_customers"."contact_email") BETWEEN 1 AND 254 AND "__new_customers"."contact_email" = trim("__new_customers"."contact_email")),
	CONSTRAINT "customer_country_valid" CHECK("__new_customers"."country_code" GLOB '[A-Z][A-Z]'),
	CONSTRAINT "customer_plan_valid" CHECK("__new_customers"."plan_code" IN ('DEMO_BASIC','DEMO_PRO')),
	CONSTRAINT "customer_date_valid" CHECK(length("__new_customers"."created_at") = 24 AND "__new_customers"."created_at" GLOB '????-??-??T??:??:??.???Z')
) STRICT;
--> statement-breakpoint
INSERT INTO `__new_customers`("id", "company_name", "tax_id_original", "tax_id_normalized", "contact_name", "contact_email", "country_code", "plan_code", "created_at") SELECT "id", "company_name", "tax_id_original", "tax_id_normalized", "contact_name", "contact_email", "country_code", "plan_code", "created_at" FROM `customers`;--> statement-breakpoint
DROP TABLE `customers`;--> statement-breakpoint
ALTER TABLE `__new_customers` RENAME TO `customers`;--> statement-breakpoint
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_country_tax_unique` ON `customers` (`country_code`,`tax_id_normalized`);