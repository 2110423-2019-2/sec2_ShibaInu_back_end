import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinTable, JoinColumn } from "typeorm";
import { Job } from "../entities/job.entity";
import { User } from "../entities/user.entity";

@Entity()
export class Bid {
    @PrimaryGeneratedColumn()
    bidId: number;
   
    @Column('integer')
    biddedWage: number;

    @Column('integer')
    biddedDuration: number;

    @Column('timestamp')
    createdTime: Date;

    @ManyToOne(type => Job)
    @JoinColumn({ name: "jobId"})
    jobId: Job;

    @ManyToOne(type => User)
    @JoinColumn({ name: "userId"})
    userId: User;
}