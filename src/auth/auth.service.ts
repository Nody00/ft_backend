import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { DatabaseService } from 'src/database/database.service';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(loginDto: LoginDto) {
    const foundUser = await this.databaseService.user.findUnique({
      where: {
        email: loginDto.email,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    console.log('dinov log foundUser', foundUser);

    if (!foundUser) {
      throw new HttpException(
        'Email or password are invalid!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      foundUser.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(
        'Email or password are invalid!',
        HttpStatus.BAD_REQUEST,
      );
    }

    // generate jwt token and send it to the user

    const payload = {
      sub: foundUser.id,
      user: { ...foundUser, password: undefined },
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
