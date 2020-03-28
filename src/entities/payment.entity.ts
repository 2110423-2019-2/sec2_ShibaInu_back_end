import { Entity, Column, PrimaryColumn, OneToOne, ManyToOne } from 'typeorm';
import { Job } from './job.entity';
import { User } from './user.entity';

@Entity()
export class PaymentCharge {
    @PrimaryColumn('varchar', { length: 50 })
    paymentId: string;

    @Column('integer') //ex 100000 for 1000.00 THB
    amount: number;

    @Column('integer') //ex 96095 for 960.95 THB
    net: number;

    @Column('varchar', { length: 3 }) //ex THB
    currency: string;

    @Column('text')
    description: string;

    @Column('json')
    card: object;

    @Column('text')
    transactionId: string;

    @Column('datetime')
    created_at: string;

    @Column('datetime')
    paid_at: string;

    @Column('datetime')
    expires_at: string;

    @ManyToOne(
        type => User,
        user => user.charges,
        { eager: true },
    )
    client: User;
}

@Entity()
export class PaymentTransfer {
    @PrimaryColumn('varchar', { length: 50 })
    transferId: string;

    @Column('integer') //ex 100000 for 1000.00 THB
    amount: number;

    @Column('integer') //ex 96095 for 960.95 THB
    net: number;

    @Column('varchar', { length: 3 }) //ex THB
    currency: string;

    @Column('json')
    bank_account: object;

    @Column('datetime')
    created_at: string;

    @Column('datetime', { nullable: true })
    sent_at: string;

    @Column('datetime', { nullable: true })
    paid_at: string;

    @Column('text')
    recipientId: string;

    @Column('boolean')
    sendable: boolean;

    @ManyToOne(
        type => User,
        user => user.transfers,
        { eager: true },
    )
    freelancer: User;
}