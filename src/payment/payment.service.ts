import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
    CreateChargeDto,
    ChargeDto,
    CreateRecipientDto,
    CreateTransferDto,
} from './payment.dto';
import { PaymentCharge, PaymentTransfer } from '../entities/payment.entity';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(PaymentCharge)
        private readonly paymentChargeRepository: Repository<PaymentCharge>,

        @InjectRepository(PaymentTransfer)
        private readonly paymentTransferRepository: Repository<PaymentTransfer>,
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

    async getAllPaymentCharge(): Promise<PaymentCharge[]> {
        let resp = await this.paymentChargeRepository.find();
        if (resp.length == 0)
            throw new BadRequestException('Not found any Charge');
        return resp;
    }

    async charge(chargeDto: ChargeDto, client: any) {
        let charge = await this.omise.charges.create(
            {
                description: chargeDto.description,
                amount: chargeDto.amount,
                currency: chargeDto.currency,
                capture: true,
                card: chargeDto.token,
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
                client: client.id,
            };

            return this.paymentChargeRepository.insert(createChargeDto);
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
                console.log(transfer.id);
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

        console.log(resp);
        createTransferDto.transferId = resp.id;
        createTransferDto.net = resp.net;
        createTransferDto.currency = resp.currency;
        createTransferDto.bank_account = resp.bank_account;
        createTransferDto.created_at = resp.created_at;
        createTransferDto.sent_at = resp.sent_at;
        createTransferDto.paid_at = resp.paid_at;
        createTransferDto.sendable = resp.sendable;
        createTransferDto.freelancer = freelancer.id;

        return this.paymentTransferRepository.insert(createTransferDto);
    }

    async getAllTransfer(): Promise<PaymentTransfer[]> {
        let resp = await this.paymentTransferRepository.find();
        if (resp.length == 0)
            throw new BadRequestException('Not found any Transfer');
        return resp;
    }

    async getChargeByUser(client: any): Promise<PaymentCharge[]> {
        let ret = await this.paymentChargeRepository.find({
            where: {
                client: client.id,
            },
        });
        if (!ret || ret.length == 0)
            throw new BadRequestException('Not found any charge');
        return ret;
    }

    async getTransferByUser(freelancer: any): Promise<PaymentTransfer[]> {
        let ret = await this.paymentTransferRepository.find({
            where: {
                freelancer: freelancer.id,
            },
        });
        if (!ret || ret.length == 0)
            throw new BadRequestException('Not found any transfer');
        return ret;
    }
}
