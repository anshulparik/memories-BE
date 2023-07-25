import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { TokenModule } from './tokens/token.module';
import { validate } from './config/validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('database').type,
          host: configService.get('database').host,
          port: configService.get('database').port,
          username: configService.get('database').username,
          password: configService.get('database').password,
          database: configService.get('database').dbName,
          extra: {
            trustServerCertificate: true,
          },
          autoLoadEntities: true,
          synchronize: true, // not for prod
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
