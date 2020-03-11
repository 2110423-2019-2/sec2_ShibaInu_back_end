import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Job } from './job.entity';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    reviewId: number;

    @Column('integer')
    score: number;

    @Column('text')
    description: string;

    @ManyToOne(
        type => User,
        user => user.reviewedByOthers,
    )
    reviewee: User; //reviewee

    @ManyToOne(
        type => User,
        user => user.reviews,
    )
    reviewer: User;

    @ManyToOne(
        type => Job,
        job => job.reviews,
    )
    job: Job;

    @Column('varchar', { length: 150 })
    jobName: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;
}
