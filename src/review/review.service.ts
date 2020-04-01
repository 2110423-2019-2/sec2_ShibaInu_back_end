import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { CreateReviewDto, EditReviewDto } from './review.dto';
import { JobsService } from '../jobs/jobs.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        private readonly jobService: JobsService,
        private readonly userService: UsersService,
    ) {}

    async getAllReviews(): Promise<Review[]> {
        let ret = await this.reviewRepository.find();
        if (ret.length == 0)
            throw new BadRequestException('Not found any Review');
        return ret;
    }

    async getReviewById(reviewId: number): Promise<Review> {
        let ret = await this.reviewRepository.findOne({
            where: { reviewId: reviewId },
        });
        if (!ret) throw new BadRequestException('Not found any Review');
        return ret;
    }

    async getReviewsByUserId(revieweeId: number): Promise<Review[]> {
        let ret = await this.reviewRepository.find({
            where: { reviewee: revieweeId },
        });

        if (ret.length == 0)
            throw new BadRequestException('Not found any Review');
        return ret;
    }

    async createNewReview(createReviewDto: CreateReviewDto) {
        let jobId = parseInt(String(createReviewDto.job));
        createReviewDto.jobName = (
            await this.jobService.getJobById(jobId)
        ).name;
        createReviewDto.createdTime = new Date();

        this.userService.updateReviewData(
            parseInt(String(createReviewDto.reviewee)),
            createReviewDto.score,
        );

        return this.reviewRepository.insert(createReviewDto);
    }

    async editReview(editReviewDto: EditReviewDto) {
        await this.getReviewById(editReviewDto.reviewId);
        return this.reviewRepository.save(editReviewDto);
    }

    async deleteReview(reviewId: number) {
        await this.getReviewById(reviewId);
        return this.reviewRepository.delete({
            reviewId: reviewId,
        });
    }
}
