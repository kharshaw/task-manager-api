import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export default class UsersRepository extends Repository<User> {
  private readonly logger = new Logger(UsersRepository.name);

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = this.create({ username, password });

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
