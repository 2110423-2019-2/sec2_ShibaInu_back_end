import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from "./user.entity";

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    jobId: number;
    
    @Column('varchar', { length: 150 })
    name: string;

    @Column('text')
    description: string;

    @Column('text')
    picture: string;

    @Column('integer')
    estimatedDuration: number;

    @Column('decimal', { precision: 15, scale: 2 })
    estimatedWage: number;

    @Column('timestamp')
    createdTime: Date;

	@ManyToOne(type => User, user => user.jobs)
    client: User;
}
