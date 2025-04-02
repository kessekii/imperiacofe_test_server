import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username for authentication',
    example: 'admin'
  })
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123'
  })
  password: string;
}