import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  const nikeId = await knex("brand")
    .select("id")
    .where({ unique_id: "BRAND001" })
    .first()
    .then((row) =>
      row?.id ??
      knex("brand")
        .insert({
          name: "Nike",
          logo: "nike-logo.png",
          unique_id: "BRAND001",
        })
        .returning("id")
        .then(([newRow]) => newRow.id)
    );

  const adidasId = await knex("brand")
    .select("id")
    .where({ unique_id: "BRAND002" })
    .first()
    .then((row) =>
      row?.id ??
      knex("brand")
        .insert({
          name: "Adidas",
          logo: "adidas-logo.png",
          unique_id: "BRAND002",
        })
        .returning("id")
        .then(([newRow]) => newRow.id)
    );

  const pumaId = await knex("brand")
    .select("id")
    .where({ unique_id: "BRAND003" })
    .first()
    .then((row) =>
      row?.id ??
      knex("brand")
        .insert({
          name: "Puma",
          logo: "puma-logo.png",
          unique_id: "BRAND003",
        })
        .returning("id")
        .then(([newRow]) => newRow.id)
    );

  const campaignId = await knex("campaign")
    .select("id")
    .where({ unique_id: "CAMP001" })
    .first()
    .then((row) =>
      row?.id ??
      knex("campaign")
        .insert({
          name: "Q1 2025",
          unique_id: "CAMP001",
          start: new Date("2025-01-01T00:00:00Z").toISOString(),
          end: new Date("2025-03-31T23:59:59Z").toISOString(),
          brand_id: nikeId,
          budget: 60,
          monthly_budget: 20,
          daily_budget: 5,
        })
        .returning("id")
        .then(([newRow]) => newRow.id)
    );

  await knex("ad")
    .select("id")
    .where({ unique_id: "AD001" })
    .first()
    .then((row) => {
      if (!row) {
        return knex("ad").insert({
          name: "Nike Air Campaign",
          description:
            "Promoting the new Nike Air collection for Q1 2025. Revolutionary comfort, unmatched style.",
          unique_id: "AD001",
          campaign_id: campaignId,
        });
      }
    });
}
