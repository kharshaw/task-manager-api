import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import UsersRepository from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AccessToken } from './access-token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return await this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<AccessToken> {
    const { username, password } = authCredentialsDto;

    const user = await this.usersRepository.findOne({ username: username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // create the jwt payload and return the jwt
      const jwtPayload: JwtPayload = { username };
      const jwtAccessToken: string = await this.jwtService.signAsync(
        jwtPayload,
      );
      return { accessToken: jwtAccessToken };
    } else {
      throw new UnauthorizedException('check your login credentials');
    }
  }
}
