import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
    PrimaryColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Job } from './job.entity';

export enum InterestedCategoryEnum {
    game = 'game',
    software = 'software',
    mobileApp = 'mobileApp',
    website = 'website',
    other = 'other',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column('varchar', { length: 100 })
    fullName: string;

    @Column('varchar', { length: 10 })
    phone: string;

    @Column('varchar', { length: 50 })
    email: string;

    @Column('varchar', { length: 50 })
    username: string;

    @Column('varchar', { length: 100 })
    password: string;

    @Column('text')
    education: string;

    @Column('timestamp')
    createdTime: Date;

    @Column('boolean')
    isVerified: boolean;

    @Column('text') //link to photo
    identificationCardPic: string;

    @Column('text') //link to photo
    identificationCardWithFacePic: string;

    @Column('varchar', { length: 13 })
    identificationNumber: string;

    @Column('boolean') //is the user can see by other user?
    isVisible: boolean;

    @Column('text')
    about: string;

    @Column('text')
    location: string;

    @Column('text') //link to photo
    profilePicture: string;

    @Column('datetime')
    dateOfBirth: Date;

    @Column('text')
    website: string;

    @Column('text')
    experience: string;

    @Column('text')
    resume: string;

    @Column('simple-array')
    skills: string[];

    @Column('integer')
    money: number;

    @OneToMany(
        type => Job,
        job => job.client,
    ) // note: we will create author property in the Photo class below
    jobs: Job[];

    @ManyToMany(
        type => Job,
        job => job.interestedFreelancer,
    )
    interestedJobs: Job[];
}

@Entity()
export class InterestedCategory {
    @PrimaryColumn("enum",{enum : InterestedCategoryEnum, default: InterestedCategoryEnum.other})
    interestedCategory: String;


    @ManyToOne(type => User, { primary: true})
    @JoinColumn({ name: "userId" })
    user:User;

}
