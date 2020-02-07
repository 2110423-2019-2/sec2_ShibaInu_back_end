import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {length: 200})
    name: string;

    @Column('text')
    description: string;

    @Column('timestamp')
    createdTime: Date;

    @Column('decimal', { precision: 15, scale: 2 })
    payout: number;
}
