import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { UpdateCampaignDto } from './dto/campaign.dto';

@Controller("api")
export class CampaignController {
  constructor(
    private readonly campaignService: CampaignService) { }

  @Get("/campaign/:id")
  async getCampaign(@Param() params: { id: string }) {
    return await this.campaignService.getCampaign(params.id);
  }

  @Patch("/campaign")
  updateCampaign(@Body() body: UpdateCampaignDto) {
    return this.campaignService.updateCampaign(body);
  }

  @Get("/campaign/:id/serve")
  async serveCampaignAd(@Param() params: { id: string }) {
    return await this.campaignService.serveCampaignAd(params.id);
  }

}
