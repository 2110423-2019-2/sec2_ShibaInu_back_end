import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    PrimaryColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Job } from './job.entity';
import { Bid } from "./bid.entity";

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
    fullName: string;

    @Column('varchar', { length: 10, nullable: true })
    phone: string;

    @Column('varchar', { length: 50, nullable: true })
    email: string;

    @Column('varchar', { length: 50})
    username: string;

    @Column('varchar', { length: 100})
    password: string;

    @Column('text',{ nullable: true })
    education: string;

    @Column('timestamp',{ nullable: true })
    createdTime: Date;

    @Column('boolean',{ nullable: true })
    isVerified: boolean;

    @Column('text',{ nullable: true }) //link to photo
    identificationCardPic: string;

    @Column('text',{ nullable: true }) //link to photo
    identificationCardWithFacePic: string;

    @Column('varchar', { length: 13, nullable: true })
    identificationNumber: string;

    @Column('boolean') //is the user can see by other user?
    isVisible: boolean;

    @Column('text',{ nullable: true })
    about: string;

    @Column('text',{ nullable: true })
    location: string;

    @Column('text',{ nullable: true }) //link to photo
    profilePicture: string;

    @Column('datetime',{ nullable: true })
    dateOfBirth: Date;

    @Column('text',{ nullable: true })
    website: string;

    @Column('text',{ nullable: true })
    experience: string;

    @Column('text',{ nullable: true })
    resume: string;

    @Column('integer',{ nullable: true })
    money: number;

    @Column('varchar',{ length: 100, nullable: true })
    headline: string;

    @OneToMany(
        type => Job,
        job => job.client,
    ) // note: we will create author property in the Photo class below
    jobs: Job[];

    @OneToMany(type => Bid, bid => bid.userId)
    bid: Bid[];
}

@Entity()
export class InterestedCategory {
    @PrimaryColumn("enum",{enum : InterestedCategoryEnum, default: InterestedCategoryEnum.other})
    interestedCategory: InterestedCategoryEnum;


    @ManyToOne(type => User, { primary: true})
    @JoinColumn({ name: "userId" })
    user:User;

}

@Entity()
export class UserSkill {
    @PrimaryColumn("varchar",{ length: 50 })
    skill: String;


    @ManyToOne(type => User, { primary: true})
    @JoinColumn({ name: "userId" })
    user:User;

}
