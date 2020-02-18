import { Entity, PrimaryColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class User_Skill {
    @PrimaryColumn('varchar', { length: 50 })
    skill: string;

    @ManyToOne(
        type => User,
        user => user.skills,
    )
    user: User;
}
