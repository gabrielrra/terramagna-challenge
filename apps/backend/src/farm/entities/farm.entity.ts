import { Farmer } from '@/farmer/entities/farmer.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum FarmProductType {
  SOY = 'soy',
  CORN = 'corn',
  COTTON = 'cotton',
  WHEAT = 'wheat',
  COFFEE = 'coffee',
  SUGARCANE = 'sugarcane'
}

@Entity('farms')
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Farmer, (farmer) => farmer.farms, { onDelete: 'CASCADE' })
  farmer: Farmer;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  areaHectares: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  longitude: number;

  @Column({
    type: 'enum',
    enum: FarmProductType
  })
  product_type: FarmProductType;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
