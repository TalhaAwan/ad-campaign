import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CampaignRepository } from './campaign.repository';
import { UpdateCampaignDto } from './dto/campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    private readonly campaignRepository: CampaignRepository,
  ) { }

  async getCampaign(id: string) {
    const result = await this.campaignRepository.getCampaign(id);
    return result;
  }

  async serveCampaignAd(uniqueId: string) {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const currentDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const currentHour = now.getUTCHours();

    const campaign = await this.campaignRepository.getCampaignByUniqueId(uniqueId);
    if (!campaign) {
      throw new HttpException({ message: `Campaign with unique_id ${uniqueId} not found or deleted` }, HttpStatus.BAD_REQUEST);
    }

    const { id: campaignId, monthly_budget, daily_budget, budget, day_parting } = campaign;

    const isWithinDayParting = day_parting.some(([start, end]) => currentHour >= start && currentHour <= end);

    if (!isWithinDayParting) {
      throw new HttpException({
        message: "Current hour is outside of allowed day parting hours",
        currentHour,
        allowedHours: day_parting
      }, HttpStatus.FORBIDDEN);
    }

    const [
      monthlyConsumption,
      dailyConsumption,
      totalConsumption
    ] = await Promise.all([
      this.campaignRepository.getMonthlyConsumption(campaignId, currentMonth),
      this.campaignRepository.getDailyConsumption(campaignId, currentDay),
      this.campaignRepository.getTotalConsumption(campaignId)
    ]);

    if (monthlyConsumption && monthlyConsumption.count >= monthly_budget) {
      throw new HttpException({ message: "Monthly budget exceeded" }, HttpStatus.FORBIDDEN);
    }

    if (dailyConsumption && dailyConsumption.count >= daily_budget) {
      throw new HttpException({ message: "Daily budget exceeded" }, HttpStatus.FORBIDDEN);
    }

    if (totalConsumption >= budget) {
      throw new HttpException({ message: "Total budget exceeded" }, HttpStatus.FORBIDDEN);
    }

    if (monthlyConsumption) {
      await this.campaignRepository.incrementConsumption(campaignId, "month", currentMonth);
    } else {
      await this.campaignRepository.createMonthlyConsumption(campaignId, currentMonth);
    }

    if (dailyConsumption) {
      await this.campaignRepository.incrementConsumption(campaignId, "day", currentDay);
    } else {
      await this.campaignRepository.createDailyConsumption(campaignId, currentDay);
    }

    const ad = await this.campaignRepository.getFirstAdByCampaignId(campaignId);
    if (!ad) {
      throw new HttpException({ message: "No ads available for the campaign" }, HttpStatus.BAD_REQUEST);
    }

    await this.campaignRepository.logAdServe(campaignId, ad.id);

    return {
      name: ad.name,
      description: ad.description,
    };
  }


  async updateCampaign(body: UpdateCampaignDto) {
    const result = await this.campaignRepository.updateCampaign(body);
    return result;
  }
}
