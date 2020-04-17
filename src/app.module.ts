import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification/notification.controller';
import { AuthModule } from './auth/auth.module';
import { BidsModule } from './bids/bids.module';
import { NotificationModule } from './notification/notification.module';
import { ReviewController } from './review/review.controller';
import { ReviewModule } from './review/review.module';
import { MulterModule } from '@nestjs/platform-express';
import { AnnouncementModule } from './announcement/announcement.module';
import { PaymentModule } from './payment/payment.module';
import { ContractsModule } from './contracts/contracts.module';
import { ReportsModule } from './reports/reports.module';

require('dotenv').config();

@Module({
    imports: [
        JobsModule,
        UsersModule,
        BidsModule,
        ContractsModule,
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: 'mysql',
                host: process.env.MYSQL_URL,
                port: 3306,
                username: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DB,
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
                charset: 'utf8mb4_general_ci',
            }),
        }),
        AuthModule,
        NotificationModule,
        ReviewModule,
        MulterModule.register({
            dest: './files',
        }),
        AnnouncementModule,
        PaymentModule,
        ReportsModule,
    ],
    controllers: [AppController, NotificationController, ReviewController],
    providers: [AppService],
})
export class AppModule {}
