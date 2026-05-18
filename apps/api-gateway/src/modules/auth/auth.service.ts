import { createHmac, randomBytes } from "node:crypto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { verifyMessage } from "ethers";
import type { AuthenticatedUser } from "@bcgs/shared";

@Injectable()
export class AuthService {
  private readonly walletNonces = new Map<string, { nonce: string; expiresAt: number }>();

  constructor(private readonly jwt: JwtService) {}

  async loginWithTelegram(initData: string) {
    const telegramUser = this.verifyTelegramInitData(initData);
    const user: AuthenticatedUser = {
      id: `tg_${telegramUser.id}`,
      handle: telegramUser.username ?? `telegram_${telegramUser.id}`,
      roles: ["user"],
      telegramId: String(telegramUser.id)
    };

    return this.issueTokens(user);
  }

  async createWalletNonce(walletAddress: string) {
    const nonce = randomBytes(24).toString("hex");
    this.walletNonces.set(walletAddress.toLowerCase(), {
      nonce,
      expiresAt: Date.now() + 5 * 60_000
    });
    return { nonce, message: `BCGS wallet login nonce: ${nonce}` };
  }

  async verifyWalletSignature(walletAddress: string, nonce: string, signature: string) {
    const stored = this.walletNonces.get(walletAddress.toLowerCase());
    if (!stored || stored.nonce !== nonce || stored.expiresAt < Date.now()) {
      throw new UnauthorizedException("Wallet nonce expired or invalid");
    }

    const message = `BCGS wallet login nonce: ${nonce}`;
    const recoveredAddress = verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new UnauthorizedException("Invalid wallet signature");
    }

    this.walletNonces.delete(walletAddress.toLowerCase());
    const user: AuthenticatedUser = {
      id: `wallet_${walletAddress.toLowerCase()}`,
      handle: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      roles: ["user"],
      walletAddress: walletAddress as `0x${string}`
    };
    return this.issueTokens(user);
  }

  verifyAccessToken(token: string): AuthenticatedUser {
    const payload = this.jwt.verify<{
      sub: string;
      handle: string;
      roles: AuthenticatedUser["roles"];
      walletAddress?: `0x${string}`;
      telegramId?: string;
    }>(token, this.jwtVerifyOptions());

    return {
      id: payload.sub,
      handle: payload.handle,
      roles: payload.roles,
      walletAddress: payload.walletAddress,
      telegramId: payload.telegramId
    };
  }

  private issueTokens(user: AuthenticatedUser) {
    const payload = {
      sub: user.id,
      handle: user.handle,
      roles: user.roles,
      walletAddress: user.walletAddress,
      telegramId: user.telegramId
    };

    return {
      user,
      accessToken: this.jwt.sign(payload, this.jwtOptions()),
      refreshToken: randomBytes(48).toString("base64url")
    };
  }

  private jwtOptions() {
    const privateKeyBase64 = process.env.JWT_PRIVATE_KEY_BASE64;
    if (privateKeyBase64 && privateKeyBase64 !== "replace-with-rs256-private-key") {
      return {
        issuer: process.env.JWT_ISSUER ?? "bcgs",
        audience: process.env.JWT_AUDIENCE ?? "bcgs-users",
        expiresIn: Number(process.env.JWT_ACCESS_TTL_SECONDS ?? 900),
        algorithm: "RS256" as const,
        privateKey: Buffer.from(privateKeyBase64, "base64").toString("utf8")
      };
    }

    return {
      issuer: process.env.JWT_ISSUER ?? "bcgs",
      audience: process.env.JWT_AUDIENCE ?? "bcgs-users",
      expiresIn: Number(process.env.JWT_ACCESS_TTL_SECONDS ?? 900),
      secret: process.env.JWT_DEV_SECRET ?? "bcgs-local-development-secret"
    };
  }

  private jwtVerifyOptions() {
    const publicKeyBase64 = process.env.JWT_PUBLIC_KEY_BASE64;
    if (publicKeyBase64 && publicKeyBase64 !== "replace-with-rs256-public-key") {
      return {
        issuer: process.env.JWT_ISSUER ?? "bcgs",
        audience: process.env.JWT_AUDIENCE ?? "bcgs-users",
        algorithms: ["RS256" as const],
        publicKey: Buffer.from(publicKeyBase64, "base64").toString("utf8")
      };
    }

    return {
      issuer: process.env.JWT_ISSUER ?? "bcgs",
      audience: process.env.JWT_AUDIENCE ?? "bcgs-users",
      secret: process.env.JWT_DEV_SECRET ?? "bcgs-local-development-secret"
    };
  }

  private verifyTelegramInitData(initData: string): { id: number; username?: string } {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) throw new UnauthorizedException("Telegram login is not configured");

    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    params.delete("hash");
    const checkString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    const secret = createHmac("sha256", "WebAppData").update(token).digest();
    const calculated = createHmac("sha256", secret).update(checkString).digest("hex");
    if (calculated !== hash) throw new UnauthorizedException("Invalid Telegram signature");

    const user = params.get("user");
    if (!user) throw new UnauthorizedException("Telegram user is missing");
    return JSON.parse(user) as { id: number; username?: string };
  }
}
