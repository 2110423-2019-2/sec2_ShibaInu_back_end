import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { UsersModule} from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification/notification.controller';

require('dotenv').config()

@Module({
    imports: [
        JobsModule,
        UsersModule,
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
            }),
        }),
    ],
    controllers: [AppController, NotificationController],
    providers: [AppService],
})
export class AppModule {}
