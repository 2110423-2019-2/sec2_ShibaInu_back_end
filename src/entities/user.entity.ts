import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    PrimaryColumn,
    JoinColumn,
    ManyToOne,
    OneToOne,
} from 'typeorm';
import { Job } from './job.entity';
import { Bid } from './bid.entity';
import { Review } from './review.entity';
import { Announcement } from './announcement.entity';
import { Payment, CreditCard, BankAccount } from './payment.entity';
import { Report } from './report.entity';

export enum InterestedCategoryEnum {
    game = 'game',
    software = 'software',
    mobileApp = 'mobile',
    website = 'website',
    other = 'other',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column('varchar', { length: 100 })
    firstName: string;

    @Column('varchar', { length: 100 })
    lastName: string;

    @Column('varchar', { length: 10, nullable: true })
    phone: string;

    @Column('varchar', { length: 50, nullable: true })
    email: string;

    @Column('varchar', { length: 50, select: true }) // should be revert to false when a method to get these field could be figured out
    username: string;

    @Column('varchar', { length: 100, select: true }) // should be revert to false when a method to get these field could be figured out
    password: string;

    @Column('text', { nullable: true })
    education: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;

    @Column('boolean', { default: false })
    isVerified: boolean;

    @Column('boolean', { default: false })
    isAdmin: boolean;

    @Column('text', { nullable: true }) //link to photo
    identificationCardPic: string;

    @Column('text', { nullable: true }) //link to photo
    identificationCardWithFacePic: string;

    @Column('varchar', { length: 13, nullable: true })
    identificationNumber: string;

    @Column('boolean', { default: true }) //is the user can see by other user?
    isVisible: boolean;

    @Column('text', { nullable: true })
    about: string;

    @Column('text', { nullable: true })
    location: string;

    @Column('text', { nullable: true }) //link to photo
    profilePicture: string;

    @Column('datetime', { nullable: true })
    dateOfBirth: Date;

    @Column('text', { nullable: true })
    website: string;

    @Column('text', { nullable: true })
    experience: string;

    @Column('text', { nullable: true })
    resume: string;

    @Column('integer', { default: 0 })
    money: number;

    @Column('varchar', { length: 100, nullable: true })
    headline: string;

    @OneToMany(
        () => Job,
        job => job.client,
        { nullable: true },
    )
    jobs: Job[];

    @OneToMany(
        () => Report,
        report => report.user,
        { nullable: true, cascade: true },
    )
    reports: Report[];

    @OneToMany(
        () => Report,
        message => message.user,
        { nullable: true, cascade: true },
    )
    messages: Report[];

    @OneToMany(
        () => Bid,
        bid => bid.userId,
        { nullable: true },
    )
    bid: Bid[];

    @OneToMany(
        () => Review,
        review => review.reviewId,
        { nullable: true },
    )
    reviewedByOthers: Review[];

    @OneToMany(
        () => Review,
        review => review.reviewId,
        { nullable: true },
    )
    reviews: Review[];

    @OneToMany(
        type => InterestedCategory,
        interestedCategory => interestedCategory.user,
        { cascade: true, eager: true },
    )
    @JoinColumn({ referencedColumnName: 'interestedCategor' })
    interestedCategories: InterestedCategory[];

    @OneToMany(
        type => UserSkill,
        userSkill => userSkill.user,
        { cascade: true, eager: true },
    )
    @JoinColumn({ referencedColumnName: 'skill' })
    skills: UserSkill[];

    @OneToMany(
        () => Announcement,
        createdAnnouncement => createdAnnouncement.announcementId,
        { nullable: true },
    )
    createdAnnouncement: Announcement[];

    @Column('integer')
    sumReviewedScore: number;

    @Column('integer')
    reviewedNumber: number;

    @Column('boolean', { default: false })
    isBanned: boolean;

    @Column('varchar', { length: 200, nullable: true })
    banReason: string;

    @Column('boolean', { default: false })
    isSNSAccount: boolean;

    @ManyToOne(
        type => Payment,
        payment => payment.user,
    )
    payments: Payment[];

    @OneToOne(
        type => CreditCard,
        creditCard => creditCard.user,
    )
    creditCard: CreditCard;

    @OneToOne(
        type => BankAccount,
        bankAccount => bankAccount.user,
    )
    bankAccount: BankAccount;
}

@Entity()
export class InterestedCategory {
    @PrimaryColumn('enum', {
        enum: InterestedCategoryEnum,
        default: InterestedCategoryEnum.other,
    })
    interestedCategory: InterestedCategoryEnum;

    @ManyToOne(type => User, { primary: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    public user: User;

    @PrimaryColumn('integer')
    userId: number;
}

@Entity()
export class UserSkill {
    @PrimaryColumn('varchar', { length: 50 })
    skill: String;

    @ManyToOne(() => User, { primary: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    public user: User;

    @PrimaryColumn('integer')
    userId: number;
}

@Entity()
export class VerifyRequest {
    @PrimaryGeneratedColumn()
    requestId: number;

    @OneToOne(
        () => User,
        requestedUser => requestedUser.userId,
        { eager: true },
    )
    @JoinColumn()
    requestedUser: User;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;
}
