import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, ReviewerRole } from '../entities/review.entity';
import { CreateReviewDto, EditReviewDto } from './review.dto';
import { JobsService } from '../jobs/jobs.service';
import { UsersService } from '../users/users.service';
import { Job } from '../entities/job.entity';
import { EditUserDto } from '../users/users.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        private readonly jobService: JobsService,
        private readonly userService: UsersService,

        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
    ) {}

    async getAllReviews(): Promise<Review[]> {
        const ret = await this.reviewRepository.find();
        if (ret.length === 0)
            throw new BadRequestException('Not found any Review');
        return ret;
    }

    async getReviewById(reviewId: number): Promise<Review> {
        const ret = await this.reviewRepository.findOne({
            where: { reviewId: reviewId },
        });
        if (!ret) throw new BadRequestException('Not found any Review');
        return ret;
    }

    async getReviewsByUserId(revieweeId: number): Promise<Review[]> {
        const ret = await this.reviewRepository.find({
            where: { reviewee: revieweeId },
        });

        if (ret.length === 0)
            throw new BadRequestException('Not found any Review');
        return ret;
    }

    async getClientReviewsByJobId(jobId: number): Promise<Review[]> {
        const ret = await this.reviewRepository.find({
            where: {
                job: jobId,
                reviewerRole: ReviewerRole.CLIENT,
            },
        });
        if (ret.length === 0)
            throw new BadRequestException('Not found any Review');
        return ret;
    }

    async getFreelancerReviewsByJobId(jobId: number): Promise<Review[]> {
        const ret = await this.reviewRepository.find({
            where: {
                job: jobId,
                reviewerRole: ReviewerRole.FREELANCER,
            },
        });
        if (ret.length === 0)
            throw new BadRequestException('Not found any Review');
        return ret;
    }

    async createNewReview(createReviewDto: CreateReviewDto) {
        const jobId = createReviewDto.job;
        const job = await this.jobService.getJobById(jobId);
        createReviewDto.jobName = job.name;
        createReviewDto.createdTime = new Date();

        this.userService.updateReviewData(
            createReviewDto.reviewee,
            createReviewDto.score,
        );

        return this.reviewRepository.insert(createReviewDto);
    }

    async editReview(editReviewDto: EditReviewDto) {
        return this.reviewRepository.save(editReviewDto);
    }

    async deleteReview(reviewId: number) {
        return this.reviewRepository.delete({
            reviewId: reviewId,
        });
    }

    async fixSumReviewScore() {
        const users = await this.userService.getAllUsers(
            null,
            null,
            null,
            null,
            null,
            null,
        );
        users.forEach(async user => {
            const userId = user.userId;
            let newSumReviewScore = 0;
            const reviews = await this.getReviewsByUserId(userId);
            reviews.forEach(review => {
                newSumReviewScore += review.score;
            });
            const editUserDto: EditUserDto = {
                userId: userId,
                sumReviewedScore: newSumReviewScore,
            };
            this.userService.editUser(editUserDto);
        });
    }
}
