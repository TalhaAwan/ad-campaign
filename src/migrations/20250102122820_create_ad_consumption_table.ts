import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("ad_consumption", (table) => {
    table.increments("id").primary();
    table
      .integer("campaign_id")
      .notNullable()
      .references("id")
      .inTable("campaign");
    table.timestamp("month", { useTz: true }).nullable();
    table.timestamp("day", { useTz: true }).nullable();
    table.integer("count").defaultTo(0).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("ad_consumption");
}
