import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("campaign", (table) => {
    table.increments("id").primary();
    table.string("name", 50).notNullable();
    table.string("unique_id", 8).notNullable().unique();
    table.timestamp("start", { useTz: true }).notNullable();
    table.timestamp("end", { useTz: true }).notNullable();
    table
      .integer("brand_id")
      .notNullable()
      .references("id")
      .inTable("brand");
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());
    table.boolean("deleted").defaultTo(false);
    table.timestamp("deleted_at", { useTz: true }).nullable();
    table.integer("budget").defaultTo(0);
    table.integer("daily_budget").defaultTo(0);
    table.integer("monthly_budget").defaultTo(0);
    table.jsonb("day_parting").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("campaign");
}
