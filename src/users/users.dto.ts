import { Job } from 'src/entities/job.entity';
import { InterestedCategoryEnum, User } from 'src/entities/user.entity';

export class CreateUserDto {
    fullName: string;
    phone?: string;
    email?: string;
    username: string;
    password: string;
    education?: string;
    createdTime?: Date;
    isVerified?: boolean;
    identificationCardPic?: string;
    identificationCardWithFacePic?: string;
    identificationNumber?: string;
    isVisible?: boolean;
    about?: string;
    location?: string;
    profilePicture?: string;
    dateOfBirth?: Date;
    website?: string;
    experience?: string;
    resume?: string;
    skills?: string[];
    money?: number;
}

export class EditUserDto {
    userId?: number;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    education?: string;
    about?: string;
    location?: string;
    profilePicture?: string;
    dateOfBirth?: Date;
    website?: string;
    experience?: string;
    resume?: string;
    skills?: string[];
    identificationNumber?: string;
    identificationCardWithFacePic?: string;
    jobs?: Job[];
    money?: number;
}

export class UserNamePasswordDto {
    username: string;
    password: string;
}

export class CreateInterestedCategoryDto{
    user? : User;
    interestedCategory: InterestedCategoryEnum;
}
