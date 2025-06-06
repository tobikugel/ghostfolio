import { HasPermission } from '@ghostfolio/api/decorators/has-permission.decorator';
import { HasPermissionGuard } from '@ghostfolio/api/guards/has-permission.guard';
import { parseDate } from '@ghostfolio/common/helper';
import {
  DataProviderGhostfolioAssetProfileResponse,
  DataProviderGhostfolioStatusResponse,
  DividendsResponse,
  HistoricalResponse,
  LookupResponse,
  QuotesResponse
} from '@ghostfolio/common/interfaces';
import { permissions } from '@ghostfolio/common/permissions';
import { RequestWithUser } from '@ghostfolio/common/types';

import {
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Query,
  UseGuards,
  Version
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { isISIN } from 'class-validator';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

import { GetDividendsDto } from './get-dividends.dto';
import { GetHistoricalDto } from './get-historical.dto';
import { GetQuotesDto } from './get-quotes.dto';
import { GhostfolioService } from './ghostfolio.service';

@Controller('data-providers/ghostfolio')
export class GhostfolioController {
  public constructor(
    private readonly ghostfolioService: GhostfolioService,
    @Inject(REQUEST) private readonly request: RequestWithUser
  ) {}

  @Get('asset-profile/:symbol')
  @HasPermission(permissions.enableDataProviderGhostfolio)
  @UseGuards(AuthGuard('api-key'), HasPermissionGuard)
  public async getAssetProfile(
    @Param('symbol') symbol: string
  ): Promise<DataProviderGhostfolioAssetProfileResponse> {
    const maxDailyRequests = await this.ghostfolioService.getMaxDailyRequests();

    if (
      this.request.user.dataProviderGhostfolioDailyRequests > maxDailyRequests
    ) {
      throw new HttpException(
        getReasonPhrase(StatusCodes.TOO_MANY_REQUESTS),
        StatusCodes.TOO_MANY_REQUESTS
      );
    }

    try {
      const assetProfile = await this.ghostfolioService.getAssetProfile({
        symbol
      });

      await this.ghostfolioService.incrementDailyRequests({
        userId: this.request.user.id
      });

      return assetProfile;
    } catch {
      throw new HttpException(
        getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('dividends/:symbol')
  @HasPermission(permissions.enableDataProviderGhostfolio)
  @UseGuards(AuthGuard('api-key'), HasPermissionGuard)
  @Version('2')
  public async getDividends(
    @Param('symbol') symbol: string,
    @Query() query: GetDividendsDto
  ): Promise<DividendsResponse> {
    const maxDailyRequests = await this.ghostfolioService.getMaxDailyRequests();

    if (
      this.request.user.dataProviderGhostfolioDailyRequests > maxDailyRequests
    ) {
      throw new HttpException(
        getReasonPhrase(StatusCodes.TOO_MANY_REQUESTS),
        StatusCodes.TOO_MANY_REQUESTS
      );
    }

    try {
      const dividends = await this.ghostfolioService.getDividends({
        symbol,
        from: parseDate(query.from),
        granularity: query.granularity,
        to: parseDate(query.to)
      });

      await this.ghostfolioService.incrementDailyRequests({
        userId: this.request.user.id
      });

      return dividends;
    } catch {
      throw new HttpException(
        getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('historical/:symbol')
  @HasPermission(permissions.enableDataProviderGhostfolio)
  @UseGuards(AuthGuard('api-key'), HasPermissionGuard)
  @Version('2')
  public async getHistorical(
    @Param('symbol') symbol: string,
    @Query() query: GetHistoricalDto
  ): Promise<HistoricalResponse> {
    const maxDailyRequests = await this.ghostfolioService.getMaxDailyRequests();

    if (
      this.request.user.dataProviderGhostfolioDailyRequests > maxDailyRequests
    ) {
      throw new HttpException(
        getReasonPhrase(StatusCodes.TOO_MANY_REQUESTS),
        StatusCodes.TOO_MANY_REQUESTS
      );
    }

    try {
      const historicalData = await this.ghostfolioService.getHistorical({
        symbol,
        from: parseDate(query.from),
        granularity: query.granularity,
        to: parseDate(query.to)
      });

      await this.ghostfolioService.incrementDailyRequests({
        userId: this.request.user.id
      });

      return historicalData;
    } catch {
      throw new HttpException(
        getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('lookup')
  @HasPermission(permissions.enableDataProviderGhostfolio)
  @UseGuards(AuthGuard('api-key'), HasPermissionGuard)
  @Version('2')
  public async lookupSymbol(
    @Query('includeIndices') includeIndicesParam = 'false',
    @Query('query') query = ''
  ): Promise<LookupResponse> {
    const includeIndices = includeIndicesParam === 'true';
    const maxDailyRequests = await this.ghostfolioService.getMaxDailyRequests();

    if (
      this.request.user.dataProviderGhostfolioDailyRequests > maxDailyRequests
    ) {
      throw new HttpException(
        getReasonPhrase(StatusCodes.TOO_MANY_REQUESTS),
        StatusCodes.TOO_MANY_REQUESTS
      );
    }

    try {
      const result = await this.ghostfolioService.lookup({
        includeIndices,
        query: isISIN(query.toUpperCase())
          ? query.toUpperCase()
          : query.toLowerCase()
      });

      await this.ghostfolioService.incrementDailyRequests({
        userId: this.request.user.id
      });

      return result;
    } catch {
      throw new HttpException(
        getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('quotes')
  @HasPermission(permissions.enableDataProviderGhostfolio)
  @UseGuards(AuthGuard('api-key'), HasPermissionGuard)
  @Version('2')
  public async getQuotes(
    @Query() query: GetQuotesDto
  ): Promise<QuotesResponse> {
    const maxDailyRequests = await this.ghostfolioService.getMaxDailyRequests();

    if (
      this.request.user.dataProviderGhostfolioDailyRequests > maxDailyRequests
    ) {
      throw new HttpException(
        getReasonPhrase(StatusCodes.TOO_MANY_REQUESTS),
        StatusCodes.TOO_MANY_REQUESTS
      );
    }

    try {
      const quotes = await this.ghostfolioService.getQuotes({
        symbols: query.symbols
      });

      await this.ghostfolioService.incrementDailyRequests({
        userId: this.request.user.id
      });

      return quotes;
    } catch {
      throw new HttpException(
        getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('status')
  @HasPermission(permissions.enableDataProviderGhostfolio)
  @UseGuards(AuthGuard('api-key'), HasPermissionGuard)
  @Version('2')
  public async getStatus(): Promise<DataProviderGhostfolioStatusResponse> {
    return this.ghostfolioService.getStatus({ user: this.request.user });
  }
}
