import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
        [
          this.pg.query(campaignQuery, values),
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

  async getCampaignByUniqueId(uniqueId: string) {
    const campaignQuery = `
      SELECT * 
      FROM campaign 
      WHERE unique_id = $1 AND deleted = false
    `;
    const result = await this.pg.query(campaignQuery, [uniqueId]);
    return result.rows[0];
  }

  async getMonthlyConsumption(campaignId: string, month: string) {
    const query = `
      SELECT * 
      FROM ad_consumption 
      WHERE campaign_id = $1 AND month = $2
    `;
    const result = await this.pg.query(query, [campaignId, month]);
    return result.rows[0];
  }

  async getDailyConsumption(campaignId: string, day: string) {
    const query = `
      SELECT * 
      FROM ad_consumption 
      WHERE campaign_id = $1 AND day = $2
    `;
    const result = await this.pg.query(query, [campaignId, day]);
    return result.rows[0];
  }

  async incrementConsumption(campaignId: string, period: 'month' | 'day', value: string) {
    const query = `
      UPDATE ad_consumption 
      SET count = count + 1 
      WHERE campaign_id = $1 AND ${period} = $2
    `;
    await this.pg.query(query, [campaignId, value]);
  }

  async createMonthlyConsumption(campaignId: string, month: string) {
    const query = `
      INSERT INTO ad_consumption (campaign_id, month, count) 
      VALUES ($1, $2, 1)
    `;
    await this.pg.query(query, [campaignId, month]);
  }

  async createDailyConsumption(campaignId: string, day: string) {
    const query = `
      INSERT INTO ad_consumption (campaign_id, day, count) 
      VALUES ($1, $2, 1)
    `;
    await this.pg.query(query, [campaignId, day]);
  }

  async getTotalConsumption(campaignId: string) {
    const query = `
      SELECT SUM(count) as total 
      FROM ad_consumption 
      WHERE campaign_id = $1
    `;
    const result = await this.pg.query(query, [campaignId]);
    return result.rows[0]?.total || 0;
  }

  async logAdServe(campaignId: string, adId: number) {
    const query = `
      INSERT INTO ad_serve (campaign_id, ad_id, serve_time) 
      VALUES ($1, $2, NOW())
    `;
    await this.pg.query(query, [campaignId, adId]);
  }

  async getFirstAdByCampaignId(campaignId: string) {
    const query = `
      SELECT id, name, description 
      FROM ad 
      WHERE campaign_id = $1 AND deleted = false 
      ORDER BY id ASC 
      LIMIT 1
    `;
    const result = await this.pg.query(query, [campaignId]);
    return result.rows[0];
  }


  async updateCampaign(body: UpdateCampaignDto) {
    const { id, name, budget, monthly_budget, daily_budget, start, end, day_parting } = body;

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

    if (start && end) {
      updates.push(`start = $${placeholderIndex++}`);
      values.push(new Date(start));

      updates.push(`"end" = $${placeholderIndex++}`);
      values.push(new Date(end));
    }

    if (day_parting) {
      updates.push(`day_parting = $${placeholderIndex++}`);
      values.push(JSON.stringify(day_parting));
    }

    if (updates.length === 0) {
      throw new HttpException({ message: "No fields provided for update." }, HttpStatus.BAD_REQUEST);
    }

    values.push(id);

    const query = `
      UPDATE campaign
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE unique_id = $${placeholderIndex} AND deleted = false
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
