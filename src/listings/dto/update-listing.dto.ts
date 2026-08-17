import { PartialType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create-listing.dto';

// status is intentionally excluded — it only changes via pause/approve/reject.
export class UpdateListingDto extends PartialType(CreateListingDto) {}
