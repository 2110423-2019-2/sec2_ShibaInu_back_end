import {
    Entity,
    Column,
    OneToOne,
    ManyToOne,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Job } from './job.entity';

export enum PaymentTypeEnum {
    charge = 'charge',
    transfer = 'transfer',
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

    @OneToMany(
        type => Payment,
        payment => payment.bankAccount,
    )
    payments: Payment[];
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

    @OneToMany(
        type => Payment,
        payment => payment.creditCard,
    )
    payments: Payment[];
}

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    paymentId: number;

    @Column('integer') //ex 100000 for 1000.00 THB
    amount: number;

    @ManyToOne(
        type => CreditCard,
        creditCard => creditCard.payments,
        { eager: true },
    )
    creditCard: CreditCard;

    @Column('datetime')
    createdAt: Date;

    @ManyToOne(
        type => BankAccount,
        bankAccount => bankAccount.payments,
        { eager: true },
    )
    bankAccount: BankAccount;

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
