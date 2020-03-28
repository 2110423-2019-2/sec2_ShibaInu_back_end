import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransfer, PaymentCharge } from '../entities/payment.entity';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import {
    User,
    UserSkill,
    VerifyRequest,
    InterestedCategory,
} from 'src/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PaymentCharge,
            PaymentTransfer,
            User,
            UserSkill,
            VerifyRequest,
            InterestedCategory,
        ]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [PaymentController],
    providers: [PaymentService, UsersService],
    exports: [PaymentService],
})
export class PaymentModule {}
