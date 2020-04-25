import {
    Entity,
    Column,
    OneToOne,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Job } from './job.entity';

export enum PaymentTypeEnum {
    charge = 'charge',
    transfer = 'transfer',
}

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    paymentId: number;

    @Column('integer') //ex 100000 for 1000.00 THB
    amount: number;

    @Column('integer', { nullable: true })
    creditCard: number; //creditCard id

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column('integer', { nullable: true })
    bankAccount: number; // bankAccount id

    @Column('enum', {
        enum: PaymentTypeEnum,
    })
    type: PaymentTypeEnum;

    @ManyToOne(
        type => User,
        user => user.payments,
        { eager: true },
    )
    @JoinColumn({ name: 'user' })
    user: User;

    @ManyToOne(
        type => Job,
        job => job.payments,
        { eager: true },
    )
    @JoinColumn({ name: 'job' })
    job: Job;
}

@Entity()
export class BankAccount {
    @PrimaryGeneratedColumn()
    cardId: number;

    @Column('varchar', { length: 16 })
    accountNumber: string;

    @Column('varchar', { length: 50 })
    name: string;

    @Column('varchar', { length: 50 }) //ex bbl kbank ktb tmb scb gsb
    bankCode: string;

    @Column('varchar', { length: 50, nullable: true })
    branchName: string;

    @OneToOne(
        type => User,
        user => user.bankAccount,
    )
    @JoinColumn({ name: 'user' })
    user: User;
}

@Entity()
export class CreditCard {
    @PrimaryGeneratedColumn()
    cardId: number;

    @Column('varchar', { length: 16 })
    cardNumber: string;

    @Column('varchar', { length: 50 })
    name: string;

    @Column('varchar', { length: 5 }) // format MM/YY
    expirationMonthYear: string;

    @Column('varchar', { length: 3 })
    securityCode: number;

    @OneToOne(
        type => User,
        user => user.creditCard,
    )
    @JoinColumn({ name: 'user' })
    user: User;
}
