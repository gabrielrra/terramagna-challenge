import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farmer } from './entities/farmer.entity';
import { FarmerController } from './farmer.controller';
import { FarmerService } from './farmer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Farmer])],
  controllers: [FarmerController],
  providers: [FarmerService],
})
export class FarmerModule { }
