import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Job } from "./jobs.entity";
import { User_Skill } from './user_skill.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column('varchar', { length: 50 })
    firstName: string;

	@Column('varchar', { length: 50 })
    lastName: string;

    @Column('varchar', { length: 10})
    phone: string;

	@Column('varchar', { length: 50})
    email: string;

    @Column('varchar', { length: 50})
    username: string;

	@Column('varchar', { length: 50})
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

    @OneToMany(type => User_Skill, user_skill => user_skill.user) // note: we will create author property in the Photo class below
    skills: string[];

	@OneToMany(type => Job, job => job.client) // note: we will create author property in the Photo class below
    jobs: Job[];

}
