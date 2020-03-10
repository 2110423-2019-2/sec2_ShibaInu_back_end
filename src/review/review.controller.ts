import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto,EditReviewDto } from './review.dto';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Get()
    async getAllReviews() {
        return this.reviewService.getAllReviews();
    }

    @Get(':reviewId') 
    async getReviewById(@Param('reviewId') reviewId: number){
        return this.reviewService.getReviewById(reviewId);
    }

    @Get('/reviewee/:revieweeId')
    async getReviewsByUserId(@Param('revieweeId') revieweeId: number) {
        return this.reviewService.getReviewsByUserId(revieweeId);
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
}
