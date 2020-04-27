import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
    CreateCreditCardDto,
    CreateBankAccountDto,
    CreatePaymentDto,
} from './payment.dto';
import {
    Payment,
    PaymentTypeEnum,
    CreditCard,
    BankAccount,
} from '../entities/payment.entity';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,

        @InjectRepository(CreditCard)
        private readonly creditCardRepository: Repository<CreditCard>,

        @InjectRepository(BankAccount)
        private readonly bankAccountRepository: Repository<BankAccount>,
    ) {}

    private readonly omise = require('omise')({
        publicKey: process.env.OMISE_PKEY,
        secretKey: process.env.OMISE_SKEY,
    });

    private readonly request = require('request');

    async testCharge(): Promise<any> {
        const tokens = await this.omise.tokens.create(
            {
                card: {
                    name: 'JOHN DOE',
                    city: 'Bangkok',
                    postal_code: 10320,
                    number: '4242424242424242',
                    expiration_month: 2,
                    expiration_year: 2022,
                    security_code: 123,
                },
            },
            (error, token) => {
                /* Response. */
            },
        );

        return this.omise.charges.create(
            {
                description: 'Charge for order ID: 888',
                amount: '100000', // 1,000 Baht
                currency: 'thb',
                capture: true,
                card: tokens.id,
            },
            (err, resp) => {
                if (!err) {
                    //Success
                    return resp;
                } else {
                    //Handle failure
                    return err;
                }
            },
        );
    }

    async testCreateToken() {
        const tokens = await this.omise.tokens.create(
            {
                card: {
                    name: 'JOHN DOE',
                    city: 'Bangkok',
                    postal_code: 10320,
                    number: '4242424242424242',
                    expiration_month: 2,
                    expiration_year: 2022,
                    security_code: 123,
                },
            },
            (error, token) => {
                /* Response. */
            },
        );

        return tokens;
    }

    async getAllPayment(): Promise<Payment[]> {
        const resp = await this.paymentRepository.find();
        if (resp.length === 0)
            throw new BadRequestException('Not found any Payment');
        return resp;
    }

    async createCardToken(data: any) {
        return this.omise.tokens.create(
            {
                card: {
                    name: data.name,
                    city: data.city,
                    postal_code: data.postal_code,
                    number: data.number,
                    expiration_month: data.expiration_month,
                    expiration_year: data.expiration_year,
                    security_code: data.security_code,
                },
            },
            (error, token) => {
                /* Response. */
            },
        );
    }

    async charge(createPaymentDto: CreatePaymentDto, client: any) {
        const creditCard = await this.getCreditCardByUser(client);
        if (creditCard) {
            createPaymentDto.creditCard = creditCard.cardId;
            createPaymentDto.type = PaymentTypeEnum.charge;
            createPaymentDto.user = client.id;
            createPaymentDto.createdAt = new Date();
            return this.paymentRepository.insert(createPaymentDto);
        } else {
            throw new BadRequestException('Not found credit cacrd');
        }
    }

    async markTransfer(url: string): Promise<any> {
        const resp = await this.request.post(
            url,
            {
                auth: {
                    user: process.env.OMISE_SKEY,
                    password: '',
                },
            },
            (error, response, body) => {
                if (error) console.error('error:', error); // Print the error if one occurred
            },
        );
        return resp;
    }

    async getRecipientById(id: string): Promise<any> {
        return this.omise.recipients.retrieve(id, function(err, resp) {
            /* Response. */
        });
    }

    async test() {
        const transfers = await this.omise.transfers.list(
            { order: 'reverse_chronological', limit: 100 },
            (error, list) => {
                /* Response. */
            },
        );
        const resp = transfers.data;
        resp.forEach(transfer => {
            if (transfer.paid === false) {
                let urlTransfersMarkAsPaid =
                    'https://api.omise.co/transfers/' +
                    transfer.id +
                    '/mark_as_paid';
                this.markTransfer(urlTransfersMarkAsPaid);
            }
        });
        return resp;
    }

    async transfer(createPaymentDto: CreatePaymentDto) {
        const userId: any = createPaymentDto.userId;
        const bankAccount = await this.getBankAccountByUserId(userId);

        if (bankAccount) {
            createPaymentDto.bankAccount = bankAccount.cardId;
            createPaymentDto.type = PaymentTypeEnum.transfer;
            createPaymentDto.user = userId;
            createPaymentDto.createdAt = new Date();
            return this.paymentRepository.insert(createPaymentDto);
        } else {
            throw new BadRequestException('Not found bank account');
        }
    }

    async getAllPaymentCharge(): Promise<Payment[]> {
        const resp = await this.paymentRepository.find({
            where: {
                type: PaymentTypeEnum.charge,
            },
        });
        if (resp.length === 0)
            throw new BadRequestException('Not found any Charge');
        return resp;
    }

    async getAllPaymentTransfer(): Promise<Payment[]> {
        const resp = await this.paymentRepository.find({
            where: {
                type: PaymentTypeEnum.transfer,
            },
        });
        if (resp.length === 0)
            throw new BadRequestException('Not found any Transfer');
        return resp;
    }

    async getPaymentByUser(user: any): Promise<any[]> {
        const payment = await this.paymentRepository.find({
            where: {
                user: user.id,
            },
        });
        if (!payment || payment.length === 0)
            throw new BadRequestException('Not found any payment');
        let resp = [];
        payment.forEach(payment => {
            let signedAmount: number;
            if (payment.type === PaymentTypeEnum.charge)
                signedAmount = payment.amount;
            else signedAmount = -payment.amount;
            resp.push({
                amount: signedAmount,
                jobId: payment.job.jobId,
                jobName: payment.job.name,
                type: payment.type,
            });
        });
        return resp;
    }

    async getPaymentChargeByUser(user: any): Promise<Payment[]> {
        const payment = await this.paymentRepository.find({
            where: {
                user: user.id,
                type: PaymentTypeEnum.charge,
            },
        });
        if (!payment || payment.length === 0)
            throw new BadRequestException('Not found any payment charge');
        let resp = [];
        payment.forEach(payment => {
            resp.push({
                amount: payment.amount,
                jobId: payment.job.jobId,
                jobName: payment.job.name,
                type: payment.type,
            });
        });
        return resp;
    }

    async getPaymentTransferByUser(user: any): Promise<Payment[]> {
        const payment = await this.paymentRepository.find({
            where: {
                user: user.id,
                type: PaymentTypeEnum.transfer,
            },
        });
        if (!payment || payment.length === 0)
            throw new BadRequestException('Not found any payment transfer');

        let resp = [];
        payment.forEach(payment => {
            resp.push({
                amount: -payment.amount,
                jobId: payment.job.jobId,
                jobName: payment.job.name,
                type: payment.type,
            });
        });
        return resp;
    }

    async getSumPaymentByUser(user: any) {
        const payments = await this.getPaymentByUser(user);
        if (!payments) throw new BadRequestException('Not found any user');
        let sum = 0;
        payments.forEach(payment => {
            sum += payment.amount;
        });
        return { sum: sum };
    }

    async getSumChargeByClient(client: any) {
        const payments = await this.getPaymentChargeByUser(client);
        if (!payments) throw new BadRequestException('Not found any user');
        let sum = 0;
        payments.forEach(payment => {
            sum += payment.amount;
        });
        return { sum: sum };
    }

    async getSumTransferByFreelancer(freelancer: any) {
        const payments = await this.getPaymentTransferByUser(freelancer);
        if (!payments) throw new BadRequestException('Not found any user');
        let sum = 0;
        payments.forEach(payment => {
            sum += payment.amount;
        });
        return { sum: sum };
    }

    async getCreditCardByUser(user: any): Promise<CreditCard> {
        const resp = await this.creditCardRepository.findOne({
            where: {
                user: user.id,
            },
        });
        if (!resp) throw new BadRequestException('Not found any credit card');
        return resp;
    }

    async getBankAccountByUser(user: any): Promise<BankAccount> {
        const resp = await this.bankAccountRepository.findOne({
            where: {
                user: user.id,
            },
        });
        if (!resp) throw new BadRequestException('Not found any bank account');
        return resp;
    }

    async getBankAccountByUserId(userId: number): Promise<BankAccount> {
        const resp = await this.bankAccountRepository.findOne({
            where: {
                user: userId,
            },
        });
        if (!resp) throw new BadRequestException('Not found any bank account');
        return resp;
    }

    async createCreditCardByUser(
        user: any,
        createCreditCardDto: CreateCreditCardDto,
    ) {
        const creditCard = await this.creditCardRepository.findOne({
            where: {
                user: user.id,
            },
        });
        if (creditCard) {
            await this.creditCardRepository.delete({
                user: user.id,
            });
        }
        createCreditCardDto.user = user.id;
        return this.creditCardRepository.insert(createCreditCardDto);
    }

    async createBankAccountByUser(
        user: any,
        createBankAccountDto: CreateBankAccountDto,
    ) {
        const bankAccount = await this.bankAccountRepository.findOne({
            where: {
                user: user.id,
            },
        });
        if (bankAccount) {
            await this.bankAccountRepository.delete({
                user: user.id,
            });
        }
        createBankAccountDto.user = user.id;
        return this.bankAccountRepository.insert(createBankAccountDto);
    }
}
