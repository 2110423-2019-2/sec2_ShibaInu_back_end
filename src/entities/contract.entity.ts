import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { Job } from './job.entity';

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

    @Column('text')
    description: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;

    @Column('timestamp', { default: null, onUpdate: 'CURRENT_TIMESTAMP' })
    updatedTime: Date;

    @Column('timestamp', { default: null })
    acceptedTime: Date;

    @OneToOne(() => Job)
    @JoinColumn({ name: 'jobId' })
    job: Job;
}
