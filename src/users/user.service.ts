import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { throwCustomError } from 'utils/helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUsers() {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (error) {
      throwCustomError(error);
    }
  }
}
