'use strict';

import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Query,
    UseGuards,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleType } from 'common/constants';
import { AuthUser, Roles } from 'decorators';
import { AuthGuard, RolesGuard } from 'guards';
import { AuthUserInterceptor } from 'interceptors';
import {
    BillsPageDto,
    BillsPageOptionsDto,
    SearchBillsPayloadDto,
    TotalAccountBalanceHistoryPayloadDto,
    TotalAccountBalancePayloadDto,
    TotalAmountMoneyPayloadDto,
} from 'modules/bill/dto';
import { BillService } from 'modules/bill/services';
import { UserEntity } from 'modules/user/entities';

@Controller('Bills')
@ApiTags('Bills')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class BillController {
    constructor(private _billService: BillService) {}

    @Get('/')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: `Get User's bills list`,
        type: BillsPageDto,
    })
    async userBills(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: BillsPageOptionsDto,
        @AuthUser() user: UserEntity,
    ): Promise<BillsPageDto> {
        return this._billService.getBills(user, pageOptionsDto);
    }

    @Get('/amountMoney')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: `Get User's amount money`,
        type: TotalAmountMoneyPayloadDto,
    })
    async userAmountMoney(
        @AuthUser() user: UserEntity,
    ): Promise<TotalAmountMoneyPayloadDto> {
        return this._billService.getTotalAmountMoney(user);
    }

    @Get('/accountBalance')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: `Get User's account balance history`,
        type: TotalAccountBalancePayloadDto,
    })
    async userAccountBalance(
        @AuthUser() user: UserEntity,
    ): Promise<TotalAccountBalancePayloadDto> {
        return this._billService.getTotalAccountBalance(user);
    }

    @Get('/accountBalanceHistory')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: `Get User's account balance history`,
        type: TotalAccountBalanceHistoryPayloadDto,
    })
    async userAccountBalanceHistory(
        @AuthUser() user: UserEntity,
    ): Promise<TotalAccountBalanceHistoryPayloadDto> {
        return this._billService.getTotalAccountBalanceHistory(user);
    }

    @Get('/:accountBillNumber/search')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: `Get User's account balance history`,
        type: SearchBillsPayloadDto,
    })
    async searchBills(
        @Param('accountBillNumber') accountBillNumber: string,
        @AuthUser() user: UserEntity,
    ): Promise<SearchBillsPayloadDto> {
        const bills = await this._billService.searchBill(
            accountBillNumber,
            user,
        );
        return new SearchBillsPayloadDto(bills.toDtos());
    }
}