export class CreateUserDto {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
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
}
