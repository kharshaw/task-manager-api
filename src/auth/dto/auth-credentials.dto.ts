import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Repository } from 'typeorm';

export class AuthCredentialsDto {
  @IsString()
  @MaxLength(20)
  @MinLength(4)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password is too weak, include one each of: number, uppercase, lowercase, special character',
  })
  password: string;
}
