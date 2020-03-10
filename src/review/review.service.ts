import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from 'src/entities/review.entity';
import { CreateReviewDto, EditReviewDto } from './review.dto';

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

    async getReviewById(reviewId: number): Promise<Review> {
        let ret = await this.reviewRepository.findOne({
            where:{reviewId : reviewId}
        })
        if(!ret) throw new BadRequestException('Not found any Review');
        return ret;
    }

    async getReviewsByUserId(revieweeId: number): Promise<Review[]> {
        let ret = await this.reviewRepository.find({
            where: { reviewee : revieweeId },
        });

        if (ret.length == 0)
            throw new BadRequestException('Not found any Review');
        return ret;
    }

    async createNewReview(createReviewDto: CreateReviewDto) {
        return this.reviewRepository.insert(createReviewDto);
    }

    async editReview(editReviewDto: EditReviewDto){
        let tmp = await this.getReviewById(editReviewDto.reviewId);
        let ret = await this.reviewRepository.save(editReviewDto);
        if (!ret) throw new BadRequestException('Invalid UserId');
        return ret;
    }
}
