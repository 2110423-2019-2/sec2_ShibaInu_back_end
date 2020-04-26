FROM node:12-alpine
WORKDIR /server
RUN apk --no-cache add --virtual builds-deps build-base python
COPY ./sec2_ShibaInu_back_end/package.json .
COPY ./sec2_ShibaInu_back_end/dist ./dist
RUN yarn
CMD ["yarn", "start:prod"]
