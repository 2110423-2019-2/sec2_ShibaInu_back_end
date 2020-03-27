import { Controller, Get, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ChargeDto, CreateRecipientDto, CreateTransferDto } from './payment.dto';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Get('testPayment')
    async test(){
        return await this.paymentService.test();
    }

    @Get('testPayment/charge')
    async testCharge(){
        let ret = await this.paymentService.testCharge();
        console.log(ret);
        return ret;
    }

    @Get('testPayment/token')
    async testCreateToken(){
        let ret = await this.paymentService.testCreateToken();
        return ret;
    }

    

    @Get('charge')
    async getAllPayment(){
        return await this.paymentService.getAllPayments();
    }

    @Post('charge')
    async charge(@Body() chargeDto: ChargeDto){
        return await this.paymentService.charge(chargeDto);
    }

    @Post('recipient')
    async createRecipient(@Body() createRecipientDTo:CreateRecipientDto){
        return await this.paymentService.createRecipient(createRecipientDTo);
    }

    @Get('transfer')
    async getAllTransfer(){
        return await this.paymentService.getAllTransfer();
    }

    @Post('transfer')
    async transfer(@Body() createTransferDto:CreateTransferDto){
        return await this.paymentService.transfer(createTransferDto);
    }
}
