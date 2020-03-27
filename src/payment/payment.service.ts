import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChargeDto,CreatePaymentDto, CreateRecipientDto, CreateTransferDto } from './payment.dto';
import { Payment } from '../entities/payment.entity';
import { response } from 'express';

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

    private readonly request = require('request');

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
        
        if(charge.transaction) {

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
        else{
            let err = new BadRequestException(charge.failure_code);
            throw err;
        }
    }

    async markTransfer(url:string) : Promise<any>{
      let resp = await this.request.post(url, {
        'auth': {
          'user': process.env.OMISE_SKEY,
          'password' : ''
        } 
      },
      function (error, response, body) {
        if(error) console.error('error:', error); // Print the error if one occurred
      }
      )
      return resp;
    }

    async getRecipientById(id:string): Promise<any> {
      return this.omise.recipients.retrieve(id, function(err, resp){
        /* Response. */
      });
    }


    async createRecipient(createRecipientDto:CreateRecipientDto) {
      let recipient = await this.omise.recipients.create({
        'name': createRecipientDto.name,
        'type': 'individual',
        'bank_account': createRecipientDto.bank_account
      }, function(err, resp) {
        /* Response. */
      });
      return await recipient;
    }

    async test(){
      return this.omise.recipients.retrieve("recp_test_5jco81hoi5n2bp2igq5", function(err, resp){
        /* Response. */
      });
    }

    async transfer(createTransferDto: CreateTransferDto){

      let resp;
      try {
        resp = await this.omise.transfers.create({'amount': createTransferDto.amount, 'recipient': createTransferDto.recipient}, function(error, transfer) {
          /* Response. */
          return transfer;
        });
      }
      catch(err){
        resp = err;
      }

      if(resp.object == 'error') throw new BadRequestException(resp.code);

      let recipient = await this.getRecipientById(resp.recipient);
      if(!recipient.verified) throw new BadRequestException("Recipient is not verified");
      if(!recipient.active) throw new BadRequestException("Recipient is not activated");

      let urlTransfersMarkAsSent = "https://api.omise.co/transfers/" + resp.id + "/mark_as_sent";
      this.markTransfer(urlTransfersMarkAsSent);
      
      return resp;
    }
}
