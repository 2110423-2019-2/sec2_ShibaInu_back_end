import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransfer, PaymentCharge } from '../entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentCharge, PaymentTransfer])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports : [PaymentService]
})
export class PaymentModule {}