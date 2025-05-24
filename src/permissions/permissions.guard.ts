import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Resource, Action, User } from 'generated/prisma';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { resource, action } = this.reflector.getAllAndOverride<{
      resource: Resource;
      action: Action;
    }>('permissions', [context.getHandler(), context.getClass()]);

    if (!resource || !action) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    try {
      const foundPermission = user.role.permissions.find((permission) => {
        if (
          permission.resource === resource &&
          permission.actions.includes(action)
        )
          return true;
        return false;
      });

      if (!foundPermission.id) throw new UnauthorizedException();
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }

    return true;
  }
}
