import { Body, Controller, Post } from "@nestjs/common";
import { IsEthereumAddress, IsString, MinLength } from "class-validator";
import { AuthService } from "./auth.service.js";

class TelegramLoginDto {
  @IsString()
  initData!: string;
}

class WalletNonceDto {
  @IsEthereumAddress()
  walletAddress!: string;
}

class WalletVerifyDto {
  @IsEthereumAddress()
  walletAddress!: string;

  @IsString()
  @MinLength(16)
  nonce!: string;

  @IsString()
  signature!: string;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("telegram")
  loginTelegram(@Body() dto: TelegramLoginDto) {
    return this.auth.loginWithTelegram(dto.initData);
  }

  @Post("wallet/nonce")
  createWalletNonce(@Body() dto: WalletNonceDto) {
    return this.auth.createWalletNonce(dto.walletAddress);
  }

  @Post("wallet/verify")
  verifyWallet(@Body() dto: WalletVerifyDto) {
    return this.auth.verifyWalletSignature(dto.walletAddress, dto.nonce, dto.signature);
  }
}
