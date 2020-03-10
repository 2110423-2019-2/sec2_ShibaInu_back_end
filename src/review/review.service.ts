import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from 'src/entities/review.entity';
import { CreateReviewDto } from './review.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
    ) {}

    async getAllReviews(): Promise<Review[]> {
        let ret = await this.reviewRepository.find();
        if (ret.length == 0)
            throw new BadRequestException('Not found any Review');
        return ret;
    }

    async getReviewsByUserId(userId: number): Promise<Review[]> {
        let ret = await this.reviewRepository.find({
            where: { reviewee : userId },
        });
        if (ret.length == 0)
            throw new BadRequestException('Not found any Review');
        return ret;
    }

    async createNewReview(createReviewDto: CreateReviewDto) {
        return this.reviewRepository.insert(createReviewDto);
    }
}
