export class ChargeDto{
    token : string;
    description: string;
    amount: number;
    currency: string;
}

export class CreatePaymentDto{
    paymentId: string;
    amount: number;
    net: number;
    currency: string;
    description: string;
    card: object;
    transaction: string;
    created_at: string;
    paid_at: string;
    expires_at: string;
}