import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Bid } from './bid.entity';

export enum Status {
    OPEN = 'open',
    PROCESS = 'process',
    CANCEL = 'cancel',
    FINISH = 'finish',
}

export enum Catergory {
    WEBSITE = 'web',
    SOFTWARE = 'software',
    MOBILE = 'mobile',
    GAME = 'game',
    OTHER = 'other',
}

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    jobId: number;

    @Column('varchar', { length: 150 })
    name: string;

    @Column('text')
    description: string;

    @Column('integer')
    estimatedDuration: number;

    @Column('decimal', { precision: 15, scale: 2 })
    estimatedWage: number;

    @Column('enum', { enum: Status, default: Status.OPEN })
    status: Status;

    @Column('enum', { enum: Catergory })
    catergory: Catergory;

    @Column('timestamp')
    createdTime: Date;

    @Column('timestamp')
    updatedTime: Date;

    @ManyToOne(
        type => User,
        user => user.jobs,
    )
    client: User;

    @OneToMany(
        type => JobReqSkill,
        jobReqSkill => jobReqSkill.job,
        { cascade: true },
    )
    requiredSkills: JobReqSkill[];
    @OneToMany(
        type => Bid,
        bid => bid.jobId,
    )
    bid: Bid[];

    @OneToMany(
        type => JobOptSkill,
        jobOptSkill => jobOptSkill.job,
        { cascade: true },
    )
    optionalSkills: JobOptSkill[];
}

@Entity()
export class JobReqSkill {
    @PrimaryColumn('varchar', { length: 50 })
    skill: string;

    @ManyToOne(type => Job, {
        primary: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'jobId' })
    public job: Job;
}

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
