import { Entity, Column, PrimaryColumn, OneToOne, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export enum PaymentTypeEnum {
    charge  = 'charge',
    transfer = 'transfer'
}

@Entity()
export class Payment {
    @PrimaryColumn('varchar', { length: 50 })
    paymentId: string;

    //charge
    @Column('integer') //ex 100000 for 1000.00 THB
    amount: number;

    @Column('integer') //ex 96095 for 960.95 THB
    net: number;

    @Column('varchar', { length: 3 }) //ex THB
    currency: string;

    @Column('text' , {nullable : true})
    description: string;

    @Column('json', {nullable : true})
    card: object;

    @Column('text', {nullable : true})
    transactionId: string;

    @Column('datetime')
    created_at: string;

    @Column('datetime', { nullable: true })
    paid_at: string;

    @Column('datetime', {nullable : true})
    expires_at: string;

    @ManyToOne(
        type => User,
        user => user.payments,
        { eager: true },
    )
    user: User;
    
    //transfer

    @Column('json', {nullable : true})
    bank_account: object;

    @Column('datetime', { nullable: true })
    sent_at: string;

    @Column('text', {nullable : true})
    recipientId: string;

    @Column('boolean', {nullable : true})
    sendable: boolean;

    @Column('enum', {
        enum: PaymentTypeEnum
    })
    type: PaymentTypeEnum;
}
