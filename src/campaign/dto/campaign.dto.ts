import { IsOptional, IsString, Length, IsInt, IsDate, ValidateIf } from 'class-validator';

export class UpdateCampaignDto {
  @IsString()
  Id: number;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  name: string;

  @IsOptional()
  @IsInt()
  budget: number;

  @IsOptional()
  @IsInt()
  monthly_budget: number;

  @IsOptional()
  @IsInt()
  daily_budget: number;

}
