import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import {
    User,
    UserSkill,
    VerifyRequest,
    InterestedCategory,
} from '../entities/user.entity';
import { Payment, CreditCard, BankAccount } from '../entities/payment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Payment,
            User,
            UserSkill,
            VerifyRequest,
            InterestedCategory,
            CreditCard,
            BankAccount,
        ]),
        PassportModule.registerAsync({
            useFactory: () => ({
                defaultStrategy: 'jwt',
            }),
        }),
    ],
    controllers: [PaymentController],
    providers: [PaymentService, UsersService],
    exports: [PaymentService],
})
export class PaymentModule {}
