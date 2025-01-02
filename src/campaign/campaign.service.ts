import { Injectable } from '@nestjs/common';

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

  async serveCampaignAd(id: string) {
    const result = await this.campaignRepository.getCampaign(id);
    return result;
  }

  async updateCampaign(body: UpdateCampaignDto) {
    const result = await this.campaignRepository.updateCampaign(body);
    return result;
  }
}
