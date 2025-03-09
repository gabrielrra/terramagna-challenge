import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { Farmer } from './entities/farmer.entity';

@Injectable()
export class FarmerService {
  constructor(
    @InjectRepository(Farmer)
    private farmerRepository: Repository<Farmer>,
  ) { }

  async create(createFarmerDto: CreateFarmerDto) {
    const farmer = this.farmerRepository.create(createFarmerDto);
    return await this.farmerRepository.save(farmer);
  }

  async findAll() {
    return await this.farmerRepository.find({
      relations: ['client', 'farms'],
    });
  }

  async findOne(id: string) {
    const farmer = await this.farmerRepository.findOne({
      where: { id },
      relations: ['client', 'farms'],
    });

    if (!farmer) {
      throw new NotFoundException(`Farmer with ID ${id} not found`);
    }

    return farmer;
  }

  async update(id: string, updateFarmerDto: UpdateFarmerDto) {
    const farmer = await this.findOne(id);
    Object.assign(farmer, updateFarmerDto);
    return await this.farmerRepository.save(farmer);
  }

  async remove(id: string) {
    const farmer = await this.findOne(id);
    return await this.farmerRepository.remove(farmer);
  }
}
