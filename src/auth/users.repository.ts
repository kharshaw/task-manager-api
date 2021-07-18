import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export default class UsersRepository extends Repository<User> {
  private readonly logger = new Logger(UsersRepository.name);

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    // hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    this.logger.debug(
      `hashing "${password}" with salt "${salt}": ${hashedPassword}`,
    );

    const user = this.create({ username, password: hashedPassword });

    try {
      await this.save(user);
    } catch (e) {
      this.logger.error(JSON.stringify(e));
      if (e.code === '23505') {
        throw new ConflictException(`Duplicate username: ${user.username}`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
