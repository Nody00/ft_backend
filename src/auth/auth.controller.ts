import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  create(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  @Post('/refresh-token')
  refresh(@Body() refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
