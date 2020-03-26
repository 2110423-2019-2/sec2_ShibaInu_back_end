import { Entity, Column, PrimaryColumn } from "typeorm";


@Entity()
export class Payment {

    @PrimaryColumn('varchar', {length: 50})
    paymentId: string;

    @Column('integer') //ex 100000 for 1000.00 THB
    amount: number;

    @Column('integer') //ex 96095 for 960.95 THB
    net: number;

    @Column('varchar', {length : 3}) //ex THB
    currency: string;

    @Column('text')
    description: string;

    @Column('json')
    card: object;

    @Column('text')
    transaction: string;

    @Column('datetime')
    created_at: string;

    @Column('datetime')
    paid_at: string;

    @Column('datetime')
    expires_at: string;
}