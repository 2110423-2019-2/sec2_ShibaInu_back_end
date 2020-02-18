import { Entity, ManyToOne, PrimaryColumn, JoinColumn, Column } from 'typeorm';
import { Job } from './job.entity';

@Entity()
export class JobOptSkill {
    @PrimaryColumn('varchar', { length: 50 })
    skill: string;

    @ManyToOne(type => Job, {
        primary: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'jobId' })
    public job: Job;
}
