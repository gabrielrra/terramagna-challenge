import { Farmer } from '@/farmer/entities/farmer.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Farmer])],
  controllers: [ClientController],
  providers: [ClientService]
})
export class ClientModule { }
