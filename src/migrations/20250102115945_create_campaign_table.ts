import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("campaign", (table) => {
    table.increments("id").primary();
    table.string("name", 50).notNullable();
    table.string("unique_id", 20).notNullable().unique();
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
    table.decimal("total_budget", 10, 2).defaultTo(0);
    table.decimal("daily_budget", 10, 2).defaultTo(0);
    table.decimal("monthly_budget", 10, 2).defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("campaign");
}
