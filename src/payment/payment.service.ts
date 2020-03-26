import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChargeDto,CreatePaymentDto } from './payment.dto';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class PaymentService {

    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
    ) { }
    

    private readonly omise = require('omise')({
        'publicKey' : process.env.OMISE_PKEY,
        'secretKey': process.env.OMISE_SKEY
      })

    async testCharge(): Promise<any> {
        let tmp = await this.omise.tokens.create({
            'card':{
              'name': 'JOHN DOE',
              'city': 'Bangkok',
              'postal_code': 10320,
              'number': '4242424242424242',
              'expiration_month': 2,
              'expiration_year': 2022,
              'security_code': 123
            }
          }, function(error, token) {
            /* Response. */
          });

          return this.omise.charges.create({
            'description': 'Charge for order ID: 888',
            'amount': '100000', // 1,000 Baht
            'currency': 'thb',
            'capture': true,
            'card': tmp.id,
          }, function(err, resp) {
            if (!err) {
              //Success
              return resp;
            } else {
              //Handle failure
              return err;
            }
          });
    }

    async testCreateToken(){
        let tmp = await this.omise.tokens.create({
            'card':{
              'name': 'JOHN DOE',
              'city': 'Bangkok',
              'postal_code': 10320,
              'number': '4242424242424242',
              'expiration_month': 2,
              'expiration_year': 2022,
              'security_code': 123
            }
          }, function(error, token) {
            /* Response. */
          });
        
        return tmp;
    }

    async getAllPayments(): Promise<Payment[]> {
        let resp = await this.paymentRepository.find();
        if (resp.length == 0)
            throw new BadRequestException('Not found any Payment');
        return resp;
    }

    async charge(chargeDto: ChargeDto) {
        let charge = await this.omise.charges.create({
            'description': chargeDto.description,
            'amount': chargeDto.amount,
            'currency': chargeDto.currency,
            'capture': true,
            'card' : chargeDto.token
          }, function(err, resp) {
            if (!err) {
              //Success
              return resp;
            } else {
              //Handle failure
              return err;
            }
          });

        let createPaymentDto:CreatePaymentDto;

        createPaymentDto = {
            paymentId: charge.id,
            amount: charge.amount,
            net: charge.net,
            currency: charge.currency,
            description: charge.description,
            card: charge.card,
            transaction: charge.transaction,
            created_at: charge.created_at,
            paid_at: charge.paid_at,
            expires_at: charge.expires_at
        }
        
        return this.paymentRepository.insert(createPaymentDto);
    }
}
