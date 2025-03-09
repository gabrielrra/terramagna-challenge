import { OmitType } from '@nestjs/mapped-types';
import { Farmer } from '../entities/farmer.entity';

export class CreateFarmerDto extends OmitType(Farmer, ['id', 'createdAt']) { }
