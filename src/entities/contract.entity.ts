import {
    Entity,
    Column,
    ManyToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
} from 'typeorm';
import { Job } from './job.entity';
import { User } from './user.entity';

@Entity()
export class Contract {
    @PrimaryGeneratedColumn()
    contractId: number;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;
}
