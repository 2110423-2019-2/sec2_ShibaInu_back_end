import { Job } from '../entities/job.entity';
import {
    InterestedCategoryEnum,
    User,
    InterestedCategory,
    UserSkill,
} from '../entities/user.entity';

export class CreateUserDto {
    firstName: string;
    lastName: string;
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
    money?: number;
    headline?: string;
    sumReviewedScore?: number;
    reviewedNumber?: number;
    isBanned?: boolean;
    isSNSAccount?: boolean;
}

export class ChangePasswordDto {
    oldpassword: string;
    newpassword: string;
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
    identificationNumber?: string;
    identificationCardWithFacePic?: string;
    jobs?: Job[];
    money?: number;
    headline?: string;
    interestedCategories?: InterestedCategory[];
    skills?: UserSkill[];
    sumReviewedScore?: number;
    reviewedNumber?: number;
}

export class UserNamePasswordDto {
    username: string;
    password: string;
}

export class CreateInterestedCategoryDto {
    user?: User;
    interestedCategory: InterestedCategoryEnum;
}

export class CreateSkillDto {
    user?: User;
    skill: string;
}

export class VerifyApprovalDto {
    user: User;
    approve: boolean;
}

export class BanUserDto {
    user: User;
    isBanned: boolean;
    banReason?: string;
}

export class VerifyAdminDto {
    user: User;
    isAdmin: boolean;
}
