import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from "./user.entity";

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column('varchar', { length: 150 })
    jobName: string;

    @Column('text')
    jobDescription: string;

    @Column('text')
    jobPicture: string;

    @Column('integer')
    EstimatedDuration: number;

    @Column('decimal', { precision: 15, scale: 2 })
    EstimatedWage: number;

    @Column('timestamp')
    createdTime: Date;

	@ManyToOne(type => User, user => user.jobs)
    client: User;
}
