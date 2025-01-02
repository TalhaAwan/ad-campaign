import { Inject, Injectable } from '@nestjs/common';
import { Pool as MyPGPool } from 'pg';
import { UpdateCampaignDto } from './dto/campaign.dto';

@Injectable()
export class CampaignRepository {
  constructor(@Inject('POSTGRESQL_CONNECTION') private pg: MyPGPool) { }

  async getCampaign(id: string) {
    const campaignQuery = `
    SELECT * 
    FROM campaign 
    WHERE unique_id = $1 AND deleted = false
  `;
    const adConsumptionQuery = `
    SELECT * 
    FROM ad_consumption 
    WHERE campaign_id = (
      SELECT id FROM campaign WHERE unique_id = $1 AND deleted = false
    )
  `;
    const values = [id];
    try {
      const [campaignResult, adConsumptionResult] = await Promise.all(
        [this.pg.query(campaignQuery, values),
        this.pg.query(adConsumptionQuery, values)
        ]);


      if (!campaignResult.rows[0]) {
        throw new Error(`Campaign with unique_id ${id} not found or deleted`);
      }

      return {
        campaign: campaignResult.rows[0],
        adConsumption: adConsumptionResult.rows,
      };
    } catch (error) {
      throw new Error(`Failed to retrieve campaign and ad consumption: ${error.message}`);
    }
  }

  async updateCampaign(body: UpdateCampaignDto) {
    const { Id, name, budget, monthly_budget, daily_budget } = body;

    const updates = [];
    const values = [];
    let placeholderIndex = 1;

    if (name) {
      updates.push(`name = $${placeholderIndex++}`);
      values.push(name);
    }

    if (budget) {
      updates.push(`budget = $${placeholderIndex++}`);
      values.push(budget);
    }

    if (monthly_budget) {
      updates.push(`monthly_budget = $${placeholderIndex++}`);
      values.push(monthly_budget);
    }

    if (daily_budget) {
      updates.push(`daily_budget = $${placeholderIndex++}`);
      values.push(daily_budget);
    }

    if (updates.length === 0) {
      throw new Error('No fields provided for update.');
    }

    values.push(Id);

    const query = `
      UPDATE campaign
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${placeholderIndex} AND deleted = false
      RETURNING *;
    `;

    try {
      const { rows } = await this.pg.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error(`Failed to update campaign: ${error.message}`);
    }
  }
}
