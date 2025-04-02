import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() data: { username: string; password: string }) {
    const user = await this.authService.validateUser(data.username, data.password);
    return this.authService.login(user);
  }

  @MessagePattern({ cmd: 'validate_token' })
  async validateToken(@Payload() data: { token: string }): Promise<boolean> {
    return this.authService.validateToken(data.token);
  }
}