import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Roles } from 'utils/constant';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  readonly lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly role: Roles;
}
