import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    SetMetadata,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
    CreateCreditCardDto,
    CreateBankAccountDto,
    CreatePaymentDto,
} from './payment.dto';
import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from '@nestjs/passport';
import { LoadUser } from '../decorators/users.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @UseGuards(AdminGuard)
    @SetMetadata('isadmin', [true])
    @UseGuards(AuthGuard())
    @Get('testPayment')
    async test() {
        return await this.paymentService.test();
    }

    @UseGuards(AdminGuard)
    @SetMetadata('isadmin', [true])
    @UseGuards(AuthGuard())
    @Get('testPayment/charge')
    async testCharge() {
        let ret = await this.paymentService.testCharge();
        console.log(ret);
        return ret;
    }

    @UseGuards(AdminGuard)
    @SetMetadata('isadmin', [true])
    @UseGuards(AuthGuard())
    @Get('testPayment/token')
    async testCreateToken() {
        let ret = await this.paymentService.testCreateToken();
        return ret;
    }

    @UseGuards(AdminGuard)
    @SetMetadata('isadmin', [true])
    @UseGuards(AuthGuard())
    @Get('charge/all')
    async getAllPaymentCharge() {
        return await this.paymentService.getAllPaymentCharge();
    }

    @UseGuards(AuthGuard())
    @Get()
    async getPaymentByUser(@LoadUser() user: any) {
        return await this.paymentService.getPaymentByUser(user);
    }

    @UseGuards(AuthGuard())
    @Get('charge')
    async getPaymentChargeByUser(@LoadUser() user: any) {
        return await this.paymentService.getPaymentChargeByUser(user);
    }

    @UseGuards(AuthGuard())
    @Get('transfer')
    async getPaymentTransferByUser(@LoadUser() user: any) {
        return await this.paymentService.getPaymentTransferByUser(user);
    }

    @UseGuards(AuthGuard())
    @Post('charge')
    async charge(
        @Body() createPaymentDto: CreatePaymentDto,
        @LoadUser() client: any,
    ) {
        return await this.paymentService.charge(createPaymentDto, client);
    }

    @UseGuards(AdminGuard)
    @SetMetadata('isadmin', [true])
    @UseGuards(AuthGuard())
    @Get('transfer/all')
    async getAllTransfer() {
        return await this.paymentService.getAllPaymentTransfer();
    }

    @Post('transfer')
    async transfer(@Body() createPaymentDto: CreatePaymentDto) {
        return await this.paymentService.transfer(createPaymentDto);
    }

    @UseGuards(AuthGuard())
    @Get('sum')
    async getSumPaymentByUser(@LoadUser() user: any) {
        return await this.paymentService.getSumPaymentByUser(user);
    }

    @UseGuards(AuthGuard())
    @Get('sum/charge')
    async getSumChargeByClient(@LoadUser() client: any) {
        return await this.paymentService.getSumChargeByClient(client);
    }

    @UseGuards(AuthGuard())
    @Get('sum/transfer')
    async getSumTransferByFreelancer(@LoadUser() freelancer: any) {
        return await this.paymentService.getSumTransferByFreelancer(freelancer);
    }

    @UseGuards(AuthGuard())
    @Get('creditCard')
    async getCreditCardByUser(@LoadUser() user: any) {
        return await this.paymentService.getCreditCardByUser(user);
    }

    @UseGuards(AuthGuard())
    @Get('bankAccount')
    async getBankAccountByUser(@LoadUser() user: any) {
        return await this.paymentService.getBankAccountByUser(user);
    }

    @UseGuards(AuthGuard())
    @Post('creditCard')
    async createCreditCardByUser(
        @LoadUser() user: any,
        @Body() createCreditCardDto: CreateCreditCardDto,
    ) {
        return await this.paymentService.createCreditCardByUser(
            user,
            createCreditCardDto,
        );
    }

    @UseGuards(AuthGuard())
    @Post('bankAccount')
    async createBankAccountByUser(
        @LoadUser() user: any,
        @Body() createBankAccountDto: CreateBankAccountDto,
    ) {
        return await this.paymentService.createBankAccountByUser(
            user,
            createBankAccountDto,
        );
    }
}
