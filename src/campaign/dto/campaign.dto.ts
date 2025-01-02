import {
  IsOptional,
  IsString,
  Length,
  IsInt,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  IsDateString,
} from 'class-validator';

@ValidatorConstraint({ name: 'DayPartingValidation', async: false })
class DayPartingValidation implements ValidatorConstraintInterface {
  validate(dayParting: number[][], args: ValidationArguments) {
    return (
      Array.isArray(dayParting) &&
      dayParting.every(
        (range) =>
          Array.isArray(range) &&
          range.length === 2 &&
          range.every((val) => Number.isInteger(val) && val >= 0 && val <= 23) &&
          (range[0] < range[1] || (range[0] === 23 && range[1] === 0))
      )
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'Each day_parting range must be an array of two integers (0-23), with the first value less than the second, except for [23, 0].';
  }
}

export class UpdateCampaignDto {
  @IsString()
  id: string;

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

  @IsOptional()
  @Validate(DayPartingValidation)
  day_parting: number[][];

  @IsOptional()
  @IsDateString()
  start: string;

  @IsOptional()
  @IsDateString()
  end: string;
}
