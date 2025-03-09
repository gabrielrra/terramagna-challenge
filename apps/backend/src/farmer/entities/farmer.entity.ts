import { Client } from '@/client/entities/client.entity';
import { Farm } from '@/farm/entities/farm.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('farmers')
export class Farmer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, (client) => client.farmers, { onDelete: 'SET NULL', nullable: true },)
  client?: Client;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 11, unique: true })
  cpf: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Farm, (farm) => farm.farmer)
  farms: Farm[];
}
