import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client/entities/client.entity';
import { Farmer } from './farmer/entities/farmer.entity';
import { Farm, FarmProductType } from './farm/entities/farm.entity';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { MG_COORDINATES, MG_RADIUS_KM } from './utils/constants';
import { capitalizeWord } from './utils/strings';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Farmer)
    private farmerRepository: Repository<Farmer>,
    private authService: AuthService
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async generateFakeClients(quantity: number): Promise<string> {
    const currentClientsCnpj = await this.clientRepository.find({ select: ['cnpj'] }).then(c => c.map(client => client.cnpj));
    const currentFarmerCpfs = await this.farmerRepository.find({ select: ['cpf'] }).then(f => f.map(farmer => farmer.cpf));
    const queryRunner = this.clientRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < quantity; i++) {
        // Create client
        const client = new Client();
        client.name = faker.company.name();
        const [firstName, lastName] = client.name.replace(',', '').replace('-', '').split(' ');
        client.username = faker.internet.username({
          firstName,
          lastName,
        }).toLocaleLowerCase();
        client.password_salt = faker.string.alphanumeric({ length: 20 });
        client.password = this.authService.hashPassword('123456', client.password_salt);
        client.cnpj = faker.string.numeric({
          length: 14,
          exclude: currentClientsCnpj
        });
        client.address = faker.location.streetAddress();

        const [lat, long] = faker.location.nearbyGPSCoordinate({
          isMetric: true,
          origin: MG_COORDINATES,
          radius: MG_RADIUS_KM
        });

        client.latitude = lat;
        client.longitude = long;

        await queryRunner.manager.save(client);

        // Create 1-3 farmers for each client
        const farmersCount = faker.number.int({ min: 1, max: 3 });

        function getRandomFarm(farmer: Farmer, client?: Client): Farm {
          const farm = new Farm();
          farm.name = `${capitalizeWord(faker.word.adjective())} ${capitalizeWord(faker.word.noun())} Farm`;
          farm.areaHectares = faker.number.float({ min: 1, max: 1000, fractionDigits: 2 });
          const farmCoords = faker.location.nearbyGPSCoordinate({
            isMetric: true,
            origin: client ? [client.latitude, client.longitude] : MG_COORDINATES,
            radius: client ? 100 : MG_RADIUS_KM
          });
          farm.latitude = farmCoords[0];
          farm.longitude = farmCoords[1];
          farm.farmer = farmer;
          farm.product_type = faker.helpers.arrayElement(Object.values(FarmProductType));
          return farm;
        }

        for (let j = 0; j < farmersCount; j++) {
          const farmer = new Farmer();
          farmer.name = faker.person.fullName();
          farmer.cpf = faker.string.numeric({ length: 11, exclude: currentFarmerCpfs });
          currentFarmerCpfs.push(farmer.cpf);
          farmer.client = client;
          await queryRunner.manager.save(farmer);

          // Create 1-5 farms for each client's farmer
          const farmsCount = faker.number.int({ min: 1, max: 5 });

          for (let k = 0; k < farmsCount; k++) {
            await queryRunner.manager.save(getRandomFarm(farmer));
          }
        }

        // Create 10 leads with 1 farm within 100km for each client
        for (let j = 0; j < 10; j++) {

          const farmer = new Farmer();
          farmer.name = faker.person.fullName();
          farmer.cpf = faker.string.numeric({ length: 11, exclude: currentFarmerCpfs });
          farmer.client = undefined;
          await queryRunner.manager.save(farmer);
          await queryRunner.manager.save(getRandomFarm(farmer, client));
        }
      }

      await queryRunner.commitTransaction();
      return `Successfully generated ${quantity} clients with related farmers and farms`;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
