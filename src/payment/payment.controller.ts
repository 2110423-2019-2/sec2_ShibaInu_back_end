import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    SetMetadata,
    Param,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
    ChargeDto,
    CreateRecipientDto,
    CreateTransferDto,
} from './payment.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from '@nestjs/passport';
import { LoadUser } from 'src/decorators/users.decorator';

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
    async charge(@Body() chargeDto: ChargeDto, @LoadUser() client: any) {
        return await this.paymentService.charge(chargeDto, client);
    }

    @Post('recipient')
    async createRecipient(@Body() createRecipientDTo: CreateRecipientDto) {
        return await this.paymentService.createRecipient(createRecipientDTo);
    }

    @UseGuards(AdminGuard)
    @SetMetadata('isadmin', [true])
    @UseGuards(AuthGuard())
    @Get('transfer/all')
    async getAllTransfer() {
        return await this.paymentService.getAllPaymentTransfer();
    }

    @UseGuards(AuthGuard())
    @Post('transfer')
    async transfer(
        @Body() createTransferDto: CreateTransferDto,
        @LoadUser() freelancer: any,
    ) {
        return await this.paymentService.transfer(
            createTransferDto,
            freelancer,
        );
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
}
