import { Entity, ManyToOne, PrimaryColumn, JoinColumn, Column } from 'typeorm';
import { Job } from './job.entity';

@Entity()
export class JobReqSkill {

    @PrimaryColumn('varchar',{length: 50})
    requiredSkill: string;

    @ManyToOne(type => Job, { primary: true, cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: "jobId" })
    public job: Job;
}