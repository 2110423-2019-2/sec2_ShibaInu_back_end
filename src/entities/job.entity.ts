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
import { Contract } from './contract.entity';
import { Payment } from './payment.entity';

export enum Status {
    OPEN = 'open',
    ACCEPTED = 'accepted',
    WORKING = 'working',
    DONE = 'done',
    CLOSED = 'closed',
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

    @Column('varchar', { default: '', length: 200 })
    url: string;

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

    @Column('timestamp', {
        default: null,
    })
    closedTime: Date;

    @ManyToOne(
        () => User,
        user => user.jobs,
        { eager: true },
    )
    client: User;

    @Column('integer', { default: null })
    freelancerId: number;

    @Column('varchar', { default: '', length: 100 })
    freelancerFullname: string;

    @Column('integer', {
        default: null,
    })
    contractId: number;

    @OneToMany(
        () => JobReqSkill,
        jobReqSkill => jobReqSkill.job,
        { cascade: true, eager: true },
    )
    @JoinColumn({ referencedColumnName: 'skill' })
    requiredSkills: JobReqSkill[];

    @OneToMany(
        () => Bid,
        bid => bid.jobId,
    )
    bid: Bid[];

    @OneToOne(
        () => Contract,
        contract => contract.job,
    )
    @JoinColumn({ name: 'contractId' })
    contract: Contract;

    @OneToMany(
        () => JobOptSkill,
        jobOptSkill => jobOptSkill.job,
        { cascade: true, eager: true },
    )
    @JoinColumn({ referencedColumnName: 'skill' })
    optionalSkills: JobOptSkill[];

    @OneToMany(
        () => Review,
        review => review.job,
    )
    reviews: Review[];

    @OneToMany(
        () => Payment,
        payment => payment.job,
    )
    payments: Payment[];
}

@Entity()
export class JobReqSkill {
    @PrimaryColumn('varchar', { length: 50 })
    skill: string;

    @ManyToOne(() => Job, {
        primary: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'jobId' })
    public job: Job;

    @PrimaryColumn('integer')
    jobId: number;
}

@Entity()
export class JobOptSkill {
    @PrimaryColumn('varchar', { length: 50 })
    skill: string;

    @ManyToOne(() => Job, {
        primary: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'jobId' })
    public job: Job;

    @PrimaryColumn('integer')
    jobId: number;
}
