import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './review.dto';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Get()
    async getAllReviews() {
        return this.reviewService.getAllReviews();
    }

    @Get(':userId')
    async getReviewsByUserId(@Param('userId') userId: number) {
        return this.reviewService.getReviewsByUserId(userId);
    }

    @Post()
    async createNewReview(@Body() createReviewDto: CreateReviewDto) {
        return this.reviewService.createNewReview(createReviewDto);
    }
}
