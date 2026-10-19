import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

// name/responseTime/address/lat/lng only — email, passwordHash, isOwner, memberSince
// are never user-editable through this endpoint.
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  responseTime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  // Browser geolocation. When present, these are stored as-is instead of
  // geocoding `address`, which can fail for addresses OSM doesn't know.
  @IsOptional()
  @IsNumber()
  @IsLatitude()
  lat?: number;

  @IsOptional()
  @IsNumber()
  @IsLongitude()
  lng?: number;
}
