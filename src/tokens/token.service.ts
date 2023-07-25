import { Inject, Injectable, Req, Scope } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Token } from './entity/token.entity';
import { throwCustomError } from 'utils/helpers';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Tokens } from 'utils/constant';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { UserPayload } from 'utils/interface';

@Injectable({ scope: Scope.REQUEST })
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(REQUEST)
    private request: Request,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  private getTokenCreds(type: Tokens) {
    const secret =
      type === Tokens.REFRESH
        ? this.configService.get('token').refresh_secret
        : this.configService.get('token').access_secret;

    const expiresIn =
      type === Tokens.REFRESH
        ? this.configService.get('token').refresh_expiry
        : this.configService.get('token').access_expiry;

    return { secret, expiresIn };
  }

  async generateToken(payload: UserPayload, type: Tokens) {
    try {
      const { secret, expiresIn } = this.getTokenCreds(type);

      const token = await this.jwtService.signAsync(
        {
          ...payload,
          type,
        },
        {
          secret,
          expiresIn,
        },
      );

      if (type === Tokens.REFRESH) {
        const ip = this.request.ip;
        let foundToken = await this.tokenRepository
          .createQueryBuilder('token')
          // .leftJoinAndSelect('token.user', 'user')
          .where('token.user = :id and token.deviceId = :ip', {
            id: payload.id,
            ip: ip,
          })
          .getOne();

        if (foundToken) {
          foundToken = { ...foundToken, token };
          await this.tokenRepository.save(foundToken);
        } else {
          const tokenObj = this.tokenRepository.create({
            user: payload.id,
            token,
            deviceId: ip,
          });

          await this.tokenRepository.save(tokenObj);
        }
      }
      return token;
    } catch (error) {
      throwCustomError(error);
    }
  }

  async deleteToken(payload: UserPayload) {
    try {
      const ip = this.request.ip;
      await this.tokenRepository
        .createQueryBuilder('token')
        .delete()
        .from(Token)
        .where('user = :id and deviceId = :ip', {
          id: payload.id,
          ip: ip,
        })
        .execute();

      return true;
    } catch (error) {
      throwCustomError(error);
    }
  }
}
