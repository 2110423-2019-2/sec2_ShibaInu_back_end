import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification/notification.controller';
import { AuthModule } from './auth/auth.module';
import { BidsModule } from './bids/bids.module';

require('dotenv').config();

@Module({
    imports: [
        JobsModule,
        UsersModule,
        BidsModule,
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
    ],
    controllers: [AppController, NotificationController],
    providers: [AppService],
})
export class AppModule {}
