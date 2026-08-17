import { IsEnum } from 'class-validator';
import { DisputeStatus } from '../../../generated/prisma/enums';

export class UpdateDisputeStatusDto {
  @IsEnum(DisputeStatus)
  status: DisputeStatus;
}
