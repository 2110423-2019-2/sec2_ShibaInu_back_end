import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Bid } from './bid.entity';
import { Review } from './review.entity';
import { PaymentCharge, PaymentTransfer } from './payment.entity';

export enum Status {
    OPEN = 'open',
    ACCEPTED = 'accepted',
    WORKING = 'working',
    DONE = 'done',
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

    @Column('enum', { enum: Catergory, default: Catergory.OTHER })
    catergory: Catergory;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedTime: Date;

    @Column('timestamp', {
        default: null,
    })
    acceptedTime: Date;

    @Column('timestamp', {
        default: null,
    })
    startWorkingTime: Date;

    @Column('timestamp', {
        default: null,
    })
    doneTime: Date;

    @ManyToOne(
        type => User,
        user => user.jobs,
        { eager: true },
    )
    client: User;

    @OneToMany(
        type => JobReqSkill,
        jobReqSkill => jobReqSkill.job,
        { cascade: true, eager: true },
    )
    @JoinColumn({ referencedColumnName: 'skill' })
    requiredSkills: JobReqSkill[];

    @OneToMany(
        type => Bid,
        bid => bid.jobId,
    )
    bid: Bid[];

    @OneToMany(
        type => JobOptSkill,
        jobOptSkill => jobOptSkill.job,
        { cascade: true, eager: true },
    )
    @JoinColumn({ referencedColumnName: 'skill' })
    optionalSkills: JobOptSkill[];

    @OneToMany(
        type => Review,
        review => review.job,
    )
    reviews: Review[];
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
