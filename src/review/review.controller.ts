import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, EditReviewDto } from './review.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Get()
    async getAllReviews() {
        return this.reviewService.getAllReviews();
    }

    @Get(':reviewId')
    async getReviewById(@Param('reviewId') reviewId: number) {
        return this.reviewService.getReviewById(reviewId);
    }

    @Get('/reviewee/:revieweeId')
    async getReviewsByUserId(@Param('revieweeId') revieweeId: number) {
        return this.reviewService.getReviewsByUserId(revieweeId);
    }

    @Get('/client/:jobId')
    async getClientReviewsByJobId(@Param('jobId') jobId: number) {
        return this.reviewService.getClientReviewsByJobId(jobId);
    }

    @Get('/freelancer/:jobId')
    async getFreelancerReviewsByJobId(@Param('jobId') jobId: number) {
        return this.reviewService.getFreelancerReviewsByJobId(jobId);
    }

    @Post()
    async createNewReview(@Body() createReviewDto: CreateReviewDto) {
        return this.reviewService.createNewReview(createReviewDto);
    }

    @Patch(':reviewId')
    async editUser(
        @Param('reviewId') reviewId: number,
        @Body() editReviewDto: EditReviewDto,
    ) {
        editReviewDto.reviewId = Number(reviewId);
        return this.reviewService.editReview(editReviewDto);
    }

    @Delete(':reviewId')
    async deleteReview(@Param('reviewId') reviewId: number) {
        return this.reviewService.deleteReview(reviewId);
    }

    @Patch('test/fixReviewScore')
    async fixSumReviewScore() {
        return this.reviewService.fixSumReviewScore();
    }
}
