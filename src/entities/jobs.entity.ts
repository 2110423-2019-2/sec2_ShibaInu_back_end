import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from "./user.entity";

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 200 })
    name: string;

    @Column('text')
    description: string;

    @Column('timestamp')
    createdTime: Date;

    @Column('decimal', { precision: 15, scale: 2 })
    payout: number;

	@ManyToOne(type => User, user => user.jobs)
    client: User;
}
