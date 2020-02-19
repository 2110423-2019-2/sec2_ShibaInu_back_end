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
    notiId: number;

    @Column('varchar', { length: 50 })
    topic: string;

    @Column('text')
    description: string;

    @Column('timestamp', {default: () => "CURRENT_TIMESTAMP"})
    createdTime: Date;

    @Column('boolean')
    isRead: boolean;

    @ManyToOne(type => User, { primary: true })
    @JoinColumn({ name: 'userId' })
    user: User;
}
