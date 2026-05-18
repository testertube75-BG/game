import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service.js";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined>; user?: unknown }>();
    const authorization = request.headers.authorization;
    const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : undefined;
    if (!token) throw new UnauthorizedException("Missing bearer token");

    request.user = this.auth.verifyAccessToken(token);
    return true;
  }
}
