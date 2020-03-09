import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './review.dto';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Get()
    async getAllReviews() {
        return this.reviewService.getAllReviews();
    }

    @Post()
    async createNewReview(@Body() createReviewDto: CreateReviewDto){
        return this.reviewService.createNewReview(createReviewDto);
    }
}
