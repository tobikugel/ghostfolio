import { IsCurrencyCode } from '@ghostfolio/api/validators/is-currency-code';

import { AssetClass, AssetSubClass, DataSource, Prisma } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUrl
} from 'class-validator';

export class UpdateAssetProfileDto {
  @IsEnum(AssetClass, { each: true })
  @IsOptional()
  assetClass?: AssetClass;

  @IsEnum(AssetSubClass, { each: true })
  @IsOptional()
  assetSubClass?: AssetSubClass;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsArray()
  @IsOptional()
  countries?: Prisma.InputJsonArray;

  @IsCurrencyCode()
  @IsOptional()
  currency?: string;

  @IsEnum(DataSource, { each: true })
  @IsOptional()
  dataSource?: DataSource;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  name?: string;

  @IsObject()
  @IsOptional()
  scraperConfiguration?: Prisma.InputJsonObject;

  @IsArray()
  @IsOptional()
  sectors?: Prisma.InputJsonArray;

  @IsString()
  @IsOptional()
  symbol?: string;

  @IsObject()
  @IsOptional()
  symbolMapping?: {
    [dataProvider: string]: string;
  };

  @IsOptional()
  @IsUrl({
    protocols: ['https'],
    require_protocol: true
  })
  url?: string;
}
