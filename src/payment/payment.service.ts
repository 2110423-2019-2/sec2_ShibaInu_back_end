import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
    CreateChargeDto,
    ChargeDto,
    CreateRecipientDto,
    CreateTransferDto,
} from './payment.dto';
import { Payment, PaymentTypeEnum } from 'src/entities/payment.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        private readonly userService: UsersService,
    ) {}

    private readonly omise = require('omise')({
        publicKey: process.env.OMISE_PKEY,
        secretKey: process.env.OMISE_SKEY,
    });

    private readonly request = require('request');

    async testCharge(): Promise<any> {
        let tmp = await this.omise.tokens.create(
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
            function(error, token) {
                /* Response. */
            },
        );

        return this.omise.charges.create(
            {
                description: 'Charge for order ID: 888',
                amount: '100000', // 1,000 Baht
                currency: 'thb',
                capture: true,
                card: tmp.id,
            },
            function(err, resp) {
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
        let tmp = await this.omise.tokens.create(
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
            function(error, token) {
                /* Response. */
            },
        );

        return tmp;
    }

    async getAllPayment(): Promise<Payment[]> {
        let resp = await this.paymentRepository.find();
        if (resp.length == 0)
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
            function(error, token) {
                /* Response. */
            },
        );
    }

    async charge(chargeDto: ChargeDto, client: any) {
        let card = await this.createCardToken({
            name: chargeDto.name,
            city: chargeDto.city,
            postal_code: chargeDto.postal_code,
            number: chargeDto.number,
            expiration_month: chargeDto.expiration_month,
            expiration_year: chargeDto.expiration_year,
            security_code: chargeDto.security_code,
        });
        let charge = await this.omise.charges.create(
            {
                description: chargeDto.description,
                amount: chargeDto.amount,
                currency: chargeDto.currency,
                capture: true,
                card: card.id,
            },
            function(err, resp) {
                if (!err) {
                    //Success
                    return resp;
                } else {
                    //Handle failure
                    return err;
                }
            },
        );

        if (charge.transaction) {
            let createChargeDto: CreateChargeDto;

            createChargeDto = {
                paymentId: charge.id,
                amount: charge.amount,
                net: charge.net,
                currency: charge.currency,
                description: charge.description,
                card: charge.card,
                transactionId: charge.transaction,
                created_at: charge.created_at,
                paid_at: charge.paid_at,
                expires_at: charge.expires_at,
                user: client.id,
                type: PaymentTypeEnum.charge,
            };

            return this.paymentRepository.insert(createChargeDto);
        } else {
            let err = new BadRequestException(charge.failure_code);
            throw err;
        }
    }

    async markTransfer(url: string): Promise<any> {
        let resp = await this.request.post(
            url,
            {
                auth: {
                    user: process.env.OMISE_SKEY,
                    password: '',
                },
            },
            function(error, response, body) {
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

    async createRecipient(createRecipientDto: CreateRecipientDto) {
        let recipient = await this.omise.recipients.create(
            {
                name: createRecipientDto.name,
                type: 'individual',
                bank_account: createRecipientDto.bank_account,
            },
            function(err, resp) {
                /* Response. */
            },
        );
        return await recipient;
    }

    async test() {
        let resp = await this.omise.transfers.list(
            { order: 'reverse_chronological', limit: 100 },
            function(error, list) {
                /* Response. */
            },
        );
        resp = resp.data;
        resp.forEach(transfer => {
            if (transfer.paid == false) {
                let urlTransfersMarkAsPaid =
                    'https://api.omise.co/transfers/' +
                    transfer.id +
                    '/mark_as_paid';
                this.markTransfer(urlTransfersMarkAsPaid);
            }
        });
        return resp;
    }

    async transfer(createTransferDto: CreateTransferDto, freelancer: any) {
        let recipient = await this.getRecipientById(
            createTransferDto.recipientId,
        );
        if (!recipient.verified)
            throw new BadRequestException('Recipient is not verified');
        if (!recipient.active)
            throw new BadRequestException('Recipient is not activated');

        let resp;
        try {
            resp = await this.omise.transfers.create(
                {
                    amount: createTransferDto.amount,
                    recipient: createTransferDto.recipientId,
                },
                function(error, transfer) {
                    /* Response. */
                    return transfer;
                },
            );
        } catch (err) {
            resp = err;
        }

        if (resp.object == 'error') throw new BadRequestException(resp.code);

        let urlTransfersMarkAsSent =
            'https://api.omise.co/transfers/' + resp.id + '/mark_as_sent';
        this.markTransfer(urlTransfersMarkAsSent);

        createTransferDto.paymentId = resp.id;
        createTransferDto.net = resp.net;
        createTransferDto.currency = resp.currency;
        createTransferDto.bank_account = resp.bank_account;
        createTransferDto.created_at = resp.created_at;
        createTransferDto.sent_at = resp.sent_at;
        createTransferDto.paid_at = resp.paid_at;
        createTransferDto.sendable = resp.sendable;
        createTransferDto.user = freelancer.id;
        createTransferDto.type = PaymentTypeEnum.transfer;
        createTransferDto.amount = resp.amount;

        return this.paymentRepository.insert(createTransferDto);
    }

    async getAllPaymentCharge(): Promise<Payment[]> {
        let resp = await this.paymentRepository.find({
            where: {
                type: PaymentTypeEnum.charge,
            },
        });
        if (resp.length == 0)
            throw new BadRequestException('Not found any Charge');
        return resp;
    }

    async getAllPaymentTransfer(): Promise<Payment[]> {
        let resp = await this.paymentRepository.find({
            where: {
                type: PaymentTypeEnum.transfer,
            },
        });
        if (resp.length == 0)
            throw new BadRequestException('Not found any Transfer');
        return resp;
    }

    async getPaymentByUser(user: any): Promise<Payment[]> {
        let ret = await this.paymentRepository.find({
            where: {
                user: user.id,
            },
        });
        if (!ret || ret.length == 0)
            throw new BadRequestException('Not found any payment');
        return ret;
    }

    async getPaymentChargeByUser(user: any): Promise<Payment[]> {
        let ret = await this.paymentRepository.find({
            where: {
                user: user.id,
                type: PaymentTypeEnum.charge,
            },
        });
        if (!ret || ret.length == 0)
            throw new BadRequestException('Not found any payment charge');
        return ret;
    }

    async getPaymentTransferByUser(user: any): Promise<Payment[]> {
        let ret = await this.paymentRepository.find({
            where: {
                user: user.id,
                type: PaymentTypeEnum.transfer,
            },
        });
        if (!ret || ret.length == 0)
            throw new BadRequestException('Not found any payment transfer');
        return ret;
    }

    async getSumPaymentByUser(user: any) {
        let payments = await this.getPaymentByUser(user);
        if (!payments) throw new BadRequestException('Not found any user');
        let sum = 0;
        payments.forEach(payment => {
            if (payment.type == PaymentTypeEnum.charge) sum += payment.amount;
            else sum -= payment.amount;
        });
        return { sum: sum };
    }

    async getSumChargeByClient(client: any) {
        let payments = await this.getPaymentChargeByUser(client);
        if (!payments) throw new BadRequestException('Not found any user');
        let sum = 0;
        payments.forEach(payment => {
            sum += payment.amount;
        });
        return { sum: sum };
    }

    async getSumTransferByFreelancer(freelancer: any) {
        let payments = await this.getPaymentTransferByUser(freelancer);
        if (!payments) throw new BadRequestException('Not found any user');
        let sum = 0;
        payments.forEach(payment => {
            sum -= payment.amount;
        });
        return { sum: sum };
    }
}
