import {
    Entity,
    Column,
    ManyToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
} from 'typeorm';
import { Job } from '../entities/job.entity';
import { User } from '../entities/user.entity';

@Entity()
export class Bid {
    @PrimaryGeneratedColumn()
    bidId: number;

    @Column()
    jobId: number;

    @Column()
    userId: number;

    @Column('integer')
    biddedWage: number;

    @Column('integer')
    biddedDuration: number;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;

    @ManyToOne(() => Job)
    @JoinColumn({ name: 'jobId' })
    job: Job;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;
}
