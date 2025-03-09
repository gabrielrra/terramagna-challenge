import { Farmer } from '@/farmer/entities/farmer.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Farmer)
    private farmerRepository: Repository<Farmer>) { }

  getClientById(id: string) {
    return this.clientRepository.findOneBy({ id });
  }

  getClientFarmers(clientId: string) {
    return this.farmerRepository.find({ where: { client: { id: clientId } }, relations: ['farms'] });
  }

  getClientLeads(clientId: string) {
    return this.farmerRepository.find({ where: { client: { id: Not(clientId) } }, relations: ['farms'] });
  }
}
