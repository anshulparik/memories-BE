import { Body, Controller, Delete, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RequestWithUser } from '../../utils/interface';
import { RefreshAuthGuard } from '../guards/refresh-auth.guard';
import { AuthGuard } from 'src/guards/access-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() userDetails: RegisterDto) {
    const res = this.authService.register(userDetails);
    return res;
  }

  @Post('login')
  async login(
    @Body() userCreds: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, userDetails } = await this.authService.login(
      userCreds,
    );
    res.cookie(
      'tokens',
      {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      {
        httpOnly: true,
        // secure: false,
        // sameSite: 'lax',
        // expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      },
    );

    return userDetails;
  }

  @UseGuards(AuthGuard)
  @Delete('logout')
  async logout(@Req() req: RequestWithUser,
  @Res({ passthrough: true }) res: Response) {
    const user = req?.user;
    const response = this.authService.logout(req, res);
    return response;
  }

  @UseGuards(RefreshAuthGuard)
  @Post('access-token')
  async generateAccessToken(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req?.user;
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = req?.cookies?.tokens?.refreshToken;
    res
      .cookie(
        'tokens',
        {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        {
          httpOnly: true,
          // secure: false,
          // sameSite: 'lax',
          // expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
        },
      )
      .sendStatus(200);
  }
}
