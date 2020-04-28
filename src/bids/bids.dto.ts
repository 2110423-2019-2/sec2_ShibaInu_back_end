export class CreateBidDto {
    jobId: number;
    userId: number;
    biddedWage: number;
    biddedDuration: number;
    createdTime?: Date;
}

export class UpdateBidDto {
    bidId?: number;
    jobId?: number;
    userId?: number;
    biddedWage?: number;
    biddedDuration?: number;
    createdTime?: Date;
}
