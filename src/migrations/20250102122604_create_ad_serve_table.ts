import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("ad_serve", (table) => {
    table.increments("id").primary();
    table
      .integer("campaign_id")
      .notNullable()
      .references("id")
      .inTable("campaign");
    table
      .integer("ad_id")
      .notNullable()
      .references("id")
      .inTable("ad");
    table.timestamp("serve_time", { useTz: true }).defaultTo(knex.fn.now());
    table.string("ip_address", 2048).nullable();
    table.string("user_agent", 2048).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("ad_serve");
}
