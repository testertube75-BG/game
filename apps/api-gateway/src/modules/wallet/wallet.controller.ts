import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { IsIn, IsString } from "class-validator";
import type { AuthenticatedUser } from "@bcgs/shared";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { CurrentUser } from "../common/current-user.decorator.js";
import { WalletService } from "./wallet.service.js";

class WithdrawalDto {
  @IsIn(["CORE", "BCGS"])
  asset!: "CORE" | "BCGS";

  @IsString()
  amountAtomic!: string;

  @IsString()
  destination!: string;

  @IsString()
  idempotencyKey!: string;
}

@Controller("wallet")
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly wallet: WalletService) {}

  @Get("balances")
  balances(@CurrentUser() user: AuthenticatedUser) {
    return this.wallet.getBalances(user.id);
  }

  @Post("withdrawals")
  withdrawals(@CurrentUser() user: AuthenticatedUser, @Body() dto: WithdrawalDto) {
    return this.wallet.requestWithdrawal(user.id, dto);
  }
}
