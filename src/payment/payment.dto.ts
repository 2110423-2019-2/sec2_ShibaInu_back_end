import { User } from '../entities/user.entity';
import { PaymentTypeEnum } from '../entities/payment.entity';
import { Job } from '../entities/job.entity';

export class CreatePaymentDto {
    amount: number;
    creditCard?: number;
    createdAt?: Date;
    bankAccount?: number;
    type?: PaymentTypeEnum;
    user: User;
    job: Job;
    userId: number;
}

export class CreateCreditCardDto {
    cardNumber: string;
    name: string;
    expirationMonthYear: string;
    securityCode: number;
    user?: User;
}

export class CreateBankAccountDto {
    accountNumber: string;
    name: string;
    bankCode: string;
    branchName: string;
    user?: User;
}
