import { Controller, Get, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ChargeDto } from './payment.dto';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

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

    @Get()
    async getAllPayment(){
        return this.paymentService.getAllPayments();
    }

    @Post()
    async charge(@Body() chargeDto: ChargeDto){
        return this.paymentService.charge(chargeDto);
    }

}
