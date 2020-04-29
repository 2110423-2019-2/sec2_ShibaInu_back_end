import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { User } from './user.entity';

export enum ReportStatusEnum {
    OPEN = 'open',
    CLOSED = 'closed',
}

export enum TopicTypeEnum {
    JOB = 'job',
    PERSON = 'person',
    PROBLEM = 'problem',
    OTHER = 'other',
}

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    reportId: number;

    @Column('varchar', { length: 100 })
    topicName: string;

    @Column('enum', {
        enum: TopicTypeEnum,
        default: TopicTypeEnum.OTHER,
    })
    topicType: TopicTypeEnum;

    @Column('text')
    description: string;

    @Column('enum', {
        enum: ReportStatusEnum,
        default: ReportStatusEnum.OPEN,
    })
    status: ReportStatusEnum;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;

    @OneToMany(
        type => Message,
        message => message.report,
        { nullable: true },
    )
    messages: Message[];

    @ManyToOne(type => User, { eager: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'userId' })
    user: User;
}

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    messageId: number;

    @Column('text')
    detail: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;

    @ManyToOne(type => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(type => Report, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'reportId' })
    report: Report;
}
