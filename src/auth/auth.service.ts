import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { RegisterDto } from './dto/register.dto';
import { Repository } from 'typeorm';
import { genSalt, hash, compare } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from 'utils/constant';
import { throwCustomError } from 'utils/helpers';
import { TokenService } from 'src/tokens/token.service';
import { RequestWithUser, UserPayload } from 'utils/interface';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(userDetails: RegisterDto) {
    try {
      const { password } = userDetails;
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);
      const user = this.userRepository.create({
        ...userDetails,
        password: hashedPassword,
      });
      await this.userRepository.save(user);
      return 'User registerd successfully!';
    } catch (error) {
      throwCustomError(error);
    }
  }

  async login(userCreds: LoginDto) {
    try {
      const { username, password } = userCreds;
      const foundUser = await this.userRepository.findOneBy({
        username,
      });
      if (!foundUser) {
        throw new BadRequestException('Incorrect username or password!');
      }

      const verified = await compare(password, foundUser.password);
      if (!verified) {
        throw new BadRequestException('Incorrect username or password!');
      }

      const payload = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
      };

      const accessToken = await this.tokenService.generateToken(
        payload,
        Tokens.ACCESS,
      );
      const refreshToken = await this.tokenService.generateToken(
        payload,
        Tokens.REFRESH,
      );

      const { password: pwd, ...userDetails } = foundUser;
      return { accessToken, refreshToken, userDetails };
    } catch (error) {
      throwCustomError(error);
    }
  }

  async logout(request: RequestWithUser, response: Response) {
    try {
      const user = request.user;

      await this.tokenService.deleteToken(user);
      response.clearCookie('tokens');

      return 'User logged out successfully!';
    } catch (error) {
      throwCustomError(error);
    }
  }

  async generateAccessToken(user: UserPayload) {
    try {
      const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      const token = await this.tokenService.generateToken(
        payload,
        Tokens.ACCESS,
      );
      return token;
    } catch (error) {
      throwCustomError(error);
    }
  }

  // forgot password
}
