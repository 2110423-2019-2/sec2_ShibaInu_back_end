export class CreateUserDto {
    name: string;
    surname: string;
    phone: string;
    email: string;
    username: string;
    password: string;
    education: string;
    createdTime?: Date;
    isVerified: boolean;
    identificationCard: string;
    identificationNumber: string;
    isVisible: boolean;
	description: string;
}