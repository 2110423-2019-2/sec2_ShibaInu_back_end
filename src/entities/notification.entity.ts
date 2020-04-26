import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    notificationId: number;

    @Column('varchar', { length: 50 })
    topic: string;

    @Column('text')
    description: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;

    @Column('boolean', { default: false })
    isRead: boolean;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column('text', { nullable: true })
    link: string;
}
