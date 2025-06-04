import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { DatabaseService } from 'src/database/database.service';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

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

    const refreshPayload = {
      sub: foundUser.id,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(refreshPayload, {
        expiresIn: '7 days',
      }),
      user: { ...foundUser, password: undefined },
    };
  }

  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new HttpException('No token', HttpStatus.BAD_REQUEST);
    }

    let token;
    try {
      token = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.secret,
      });

      if (!token) {
        throw new HttpException('Invalid token!', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.error(error);
      throw new HttpException('Invalid token!', HttpStatus.BAD_REQUEST);
    }

    const userId = token.sub;
    const foundUser = await this.databaseService.user.findUnique({
      where: { id: userId, deleted: false },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const payload = {
      sub: foundUser.id,
      user: { ...foundUser, password: undefined },
    };

    const refreshPayload = {
      sub: foundUser.id,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(refreshPayload, {
        expiresIn: '7 days',
      }),
      user: { ...foundUser, password: undefined },
    };
  }
}
