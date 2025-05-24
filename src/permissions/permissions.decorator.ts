import { SetMetadata } from '@nestjs/common';
import { Resource, Action } from 'generated/prisma';

export const Permissions = (resource: Resource, action: Action) =>
  SetMetadata('permissions', { resource, action });
