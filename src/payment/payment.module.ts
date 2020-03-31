import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import {
    User,
    UserSkill,
    VerifyRequest,
    InterestedCategory,
} from 'src/entities/user.entity';
import { Payment, CreditCard, BankAccount } from 'src/entities/payment.entity';

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
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [PaymentController],
    providers: [PaymentService, UsersService],
    exports: [PaymentService],
})
export class PaymentModule {}
