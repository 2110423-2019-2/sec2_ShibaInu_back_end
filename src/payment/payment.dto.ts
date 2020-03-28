import { Job } from 'src/entities/job.entity';
import { User } from 'src/entities/user.entity';

export class ChargeDto {
    token: string;
    description: string;
    amount: number;
    currency: string;
}

export class CreateChargeDto {
    paymentId: string;
    amount: number;
    net: number;
    currency: string;
    description: string;
    card: object;
    transactionId: string;
    created_at: string;
    paid_at: string;
    expires_at: string;
    client?: User;
}

export class CreateRecipientDto {
    name: string;
    bank_account: {
        name: string;
        number: string;
        brand: string;
    };
}

export class CreateTransferDto {
    recipientId: string;
    amount: number;
    transferId?: string;
    net?: number;
    currency?: string;
    bank_account?: object;
    created_at?: string;
    sent_at?: string;
    paid_at?: string;
    sendable?: boolean;
    freelancer?: User;
}
