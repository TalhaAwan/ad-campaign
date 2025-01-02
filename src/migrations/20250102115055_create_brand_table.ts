import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("brand", (table) => {
    table.increments("id").primary();
    table.string("name", 50).notNullable();
    table.string("logo", 255).notNullable();
    table.string("unique_id", 8).notNullable().unique();
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());
    table.boolean("deleted").defaultTo(false);
    table.timestamp("deleted_at", { useTz: true }).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("brand");
}
