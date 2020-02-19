import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { Bid } from './bid.entity';
import { JobReqSkill } from './jobReqSkill.entity';
import { JobOptSkill } from './JobOptSkill.entity';

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
