import { RegisterDto } from './register.dto';
import { PickType } from '@nestjs/mapped-types';

export class LoginDto extends PickType(RegisterDto, ['username', 'password']) {}
