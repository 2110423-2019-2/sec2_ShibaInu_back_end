import * as Strategy from 'passport-facebook-token';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        return profile;
    }
}
