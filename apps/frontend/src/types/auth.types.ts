import { Client } from './entities';

export interface LoginResponseDto {
  client: Client;
  accessToken: string;
}
