import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Job } from "./jobs.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 200 })
    name: string;

	@Column('varchar', { length: 200 })
    surname: string;

    @Column('varchar', { length: 10})
    phone: string;

	@Column('text')
    education: string;

    @Column('timestamp')
    createdTime: Date;

	@Column('boolean')
    isVerified: boolean;

	@Column('text') //link to photo
    identificationCard: string;

	@Column('varchar', { length: 13 })
    identificationNumber: string;

	@Column('boolean') //is the user can see by other user?
    isVisible: boolean;

	@Column('text')
	description: string;

	@OneToMany(type => Job, job => job.client) // note: we will create author property in the Photo class below
    jobs: Job[];

}
