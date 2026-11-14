-- finalized-sqlite-v1
CREATE TABLE `app_metadata` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
) STRICT;
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`tax_id_original` text NOT NULL,
	`tax_id_normalized` text NOT NULL,
	`contact_name` text NOT NULL,
	`contact_email` text NOT NULL,
	`country_code` text NOT NULL,
	`plan_code` text NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT "customer_name_valid" CHECK(length("customers"."company_name") BETWEEN 1 AND 200 AND "customers"."company_name" = trim("customers"."company_name")),
	CONSTRAINT "customer_tax_original_valid" CHECK(length("customers"."tax_id_original") BETWEEN 1 AND 64 AND "customers"."tax_id_original" = trim("customers"."tax_id_original")),
	CONSTRAINT "customer_tax_normalized_valid" CHECK(length("customers"."tax_id_normalized") BETWEEN 1 AND 64 AND "customers"."tax_id_normalized" = trim("customers"."tax_id_normalized")),
	CONSTRAINT "customer_contact_valid" CHECK(length("customers"."contact_name") BETWEEN 1 AND 200 AND "customers"."contact_name" = trim("customers"."contact_name")),
	CONSTRAINT "customer_email_valid" CHECK(length("customers"."contact_email") BETWEEN 1 AND 254 AND "customers"."contact_email" = trim("customers"."contact_email")),
	CONSTRAINT "customer_country_valid" CHECK("customers"."country_code" GLOB '[A-Z][A-Z]'),
	CONSTRAINT "customer_plan_valid" CHECK("customers"."plan_code" IN ('DEMO_BASIC','DEMO_PRO')),
	CONSTRAINT "customer_date_valid" CHECK(length("customers"."created_at") = 24 AND "customers"."created_at" GLOB '????-??-??T??:??:??.???Z')
) STRICT;
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_country_tax_unique` ON `customers` (`country_code`,`tax_id_normalized`);--> statement-breakpoint
CREATE TABLE `simulations` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`users` integer NOT NULL,
	`storage_gb` integer NOT NULL,
	`api_calls` integer NOT NULL,
	`currency` text NOT NULL,
	`base_cents` integer NOT NULL,
	`tax_cents` integer NOT NULL,
	`total_cents` integer NOT NULL,
	`customer_name_snapshot` text NOT NULL,
	`tax_id_snapshot` text NOT NULL,
	`country_code_snapshot` text NOT NULL,
	`plan_code_snapshot` text NOT NULL,
	`pricing_version` text NOT NULL,
	`tax_policy_version` text NOT NULL,
	`tax_rate_bps` integer NOT NULL,
	`breakdown_json` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE restrict ON DELETE restrict,
	CONSTRAINT "users_range" CHECK("simulations"."users" BETWEEN 0 AND 1000),
	CONSTRAINT "storage_range" CHECK("simulations"."storage_gb" BETWEEN 0 AND 10000),
	CONSTRAINT "api_calls_range" CHECK("simulations"."api_calls" BETWEEN 0 AND 10000000),
	CONSTRAINT "currency_eur" CHECK("simulations"."currency" = 'EUR'),
	CONSTRAINT "base_safe" CHECK("simulations"."base_cents" BETWEEN 0 AND 9007199254740991),
	CONSTRAINT "tax_safe" CHECK("simulations"."tax_cents" BETWEEN 0 AND 9007199254740991),
	CONSTRAINT "total_safe" CHECK("simulations"."total_cents" BETWEEN 0 AND 9007199254740991),
	CONSTRAINT "total_matches" CHECK("simulations"."total_cents" = "simulations"."base_cents" + "simulations"."tax_cents"),
	CONSTRAINT "snapshot_name_valid" CHECK(length("simulations"."customer_name_snapshot") BETWEEN 1 AND 200 AND "simulations"."customer_name_snapshot" = trim("simulations"."customer_name_snapshot")),
	CONSTRAINT "snapshot_tax_valid" CHECK(length("simulations"."tax_id_snapshot") BETWEEN 1 AND 64 AND "simulations"."tax_id_snapshot" = trim("simulations"."tax_id_snapshot")),
	CONSTRAINT "snapshot_country_valid" CHECK("simulations"."country_code_snapshot" GLOB '[A-Z][A-Z]'),
	CONSTRAINT "snapshot_plan_valid" CHECK("simulations"."plan_code_snapshot" IN ('DEMO_BASIC','DEMO_PRO')),
	CONSTRAINT "pricing_version_valid" CHECK(length("simulations"."pricing_version") BETWEEN 1 AND 64 AND "simulations"."pricing_version" = trim("simulations"."pricing_version")),
	CONSTRAINT "tax_version_valid" CHECK(length("simulations"."tax_policy_version") BETWEEN 1 AND 64 AND "simulations"."tax_policy_version" = trim("simulations"."tax_policy_version")),
	CONSTRAINT "tax_rate_range" CHECK("simulations"."tax_rate_bps" BETWEEN 0 AND 10000),
	CONSTRAINT "breakdown_array" CHECK(CASE WHEN json_valid("simulations"."breakdown_json") THEN json_type("simulations"."breakdown_json") = 'array' ELSE 0 END),
	CONSTRAINT "simulation_date_valid" CHECK(length("simulations"."created_at") = 24 AND "simulations"."created_at" GLOB '????-??-??T??:??:??.???Z')
) STRICT;
--> statement-breakpoint
CREATE INDEX `simulations_history` ON `simulations` (`customer_id`,"created_at" desc,"id" desc);
CREATE TRIGGER simulations_no_update BEFORE UPDATE ON simulations BEGIN SELECT RAISE(ABORT, 'SIMULATION_IMMUTABLE'); END;
CREATE TRIGGER simulations_no_delete BEFORE DELETE ON simulations BEGIN SELECT RAISE(ABORT, 'SIMULATION_IMMUTABLE'); END;
