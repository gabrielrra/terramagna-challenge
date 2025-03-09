import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { AuthClientData, LoginDto, LoginResponseDto } from './dto/login.dto';
import { Client } from '@/client/entities/client.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private jwtService: JwtService
  ) { }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const client = await this.validateClient(loginDto);
    const clientData = {
      id: client.id,
      username: client.username,
      name: client.name,
    };
    return {
      client,
      accessToken: await this.jwtService.signAsync(clientData, { expiresIn: '7d' }),
    };
  }

  private async validateClient(loginDto: LoginDto): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { username: loginDto.username },
    });

    if (!client) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashedPassword = this.hashPassword(loginDto.password, client.password_salt);

    if (hashedPassword !== client.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return client;
  }

  validateToken(token: string): AuthClientData | null {
    try {
      const payload = this.jwtService.decode<AuthClientData>(token);
      if (!payload) {
        return null;
      }

      return payload;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  hashPassword(password: string, salt: string): string {
    return createHash('sha256')
      .update(password + salt)
      .digest('hex');
  }
}
