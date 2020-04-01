import {
    Entity,
    Column,
    ManyToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { Job } from './job.entity';
import { User } from './user.entity';

export enum ContractStatus {
    NULL = 'null',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

@Entity()
export class Contract {
    @PrimaryGeneratedColumn()
    contractId: number;

    @Column()
    jobId: number;

    @Column()
    freelancerId: number;

    @Column()
    price: number;

    @Column('enum', { enum: ContractStatus, default: ContractStatus.NULL })
    status: ContractStatus;

    @Column()
    description: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    updatedTime: Date;

    @OneToOne(() => Job)
    @JoinColumn({ name: 'jobId' })
    job: Job;
}
