import { createParamDecorator } from '@nestjs/common';

export const LoadUser = createParamDecorator((data, req) => {
    return req.user;
});
