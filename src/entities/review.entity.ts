import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    reviewId: number;

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
}
