import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/access-auth.guard';
import { RolesDecorator } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'utils/constant';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  @RolesDecorator(Roles.USER)
  getUsers() {
    const response = this.userService.getUsers();
    return response;
  }
}
