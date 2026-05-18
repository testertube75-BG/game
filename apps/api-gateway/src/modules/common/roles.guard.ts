import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { AuthenticatedUser } from "@bcgs/shared";

export const ROLES_KEY = "roles";
export const Roles = (...roles: AuthenticatedUser["roles"]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<AuthenticatedUser["roles"]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!required || required.length === 0) return true;

    const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
    return required.some((role) => request.user?.roles.includes(role));
  }
}
