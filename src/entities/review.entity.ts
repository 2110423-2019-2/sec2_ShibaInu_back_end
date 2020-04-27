import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Job } from './job.entity';

export enum ReviewerRole {
    CLIENT = 'client',
    FREELANCER = 'freelancer',
}

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

    @Column('enum', { enum: ReviewerRole })
    reviewerRole: ReviewerRole;

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
