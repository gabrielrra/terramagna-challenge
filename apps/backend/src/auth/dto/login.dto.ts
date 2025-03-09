import { Client } from '@/client/entities/client.entity';

export class LoginDto {
  username: string;
  password: string;
}
export interface AuthClientData {
  id: string;
  name: string;
  username: string;
}
export interface LoginResponseDto {
  client: Client;
  accessToken: string;
}
