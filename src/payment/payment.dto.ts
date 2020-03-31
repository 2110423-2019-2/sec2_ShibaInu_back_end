import { User } from 'src/entities/user.entity';
import { PaymentTypeEnum, CreditCard, BankAccount } from 'src/entities/payment.entity';
import { Job } from 'src/entities/job.entity';

export class CreatePaymentDto {
    amount: number;
    creditCard?: CreditCard;
    createdAt?: Date;
    bankAccount?: BankAccount;
    type?: PaymentTypeEnum;
    user: User;
    job: Job;
}

export class CreateCreditCardDto {
    cardNumber: string ;
    name: string;
    expirationMonthYear: string;
    securityCode: number;
    user?:User;
}

export class CreateBankAccountDto {
    accountNumber : string;
    name : string;
    bankCode : string;
    branchName: string;
    user?:User;
}