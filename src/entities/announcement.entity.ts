import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Announcement {
    @PrimaryGeneratedColumn()
    announcementId: number;

    @Column('varchar', { length: 150 })
    title: string;

    @Column('text')
    content: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedTime: Date;

    @ManyToOne(
        () => User,
        creator => creator.userId,
    )
    @JoinColumn()
    creator: User;
}
