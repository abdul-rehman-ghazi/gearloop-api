import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import type { HandoffStage } from '../../../generated/prisma/enums';

export class CreateHandoffPhotoDto {
  @IsIn(['pickup', 'returned'])
  stage: HandoffStage;

  // A URL to bytes the client stored elsewhere — this API has no upload
  // path. Deliberately NOT @IsUrl: the repo's existing image convention
  // (Listing.images) is data URLs in dev, which @IsUrl rejects. MaxLength is
  // the guard that matters — it keeps a multi-megabyte inline blob out of a
  // text column while leaving any real URL comfortable.
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  url: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  // `uploaderId` and `createdAt` are deliberately absent — both are set
  // server-side, and a client-chosen timestamp is not evidence.
}
