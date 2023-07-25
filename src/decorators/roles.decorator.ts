import { SetMetadata } from '@nestjs/common';
import { Roles } from 'utils/constant';

// custom decorator
export const RolesDecorator = (...roles: Roles[]) => {
  return SetMetadata('roles', roles);
};
