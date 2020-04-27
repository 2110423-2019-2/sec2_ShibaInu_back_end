FROM node:12-alpine
WORKDIR /server
RUN apk --no-cache add --virtual builds-deps build-base python
COPY ./package.json .
COPY ./dist ./dist
COPY ./.env .
RUN yarn
CMD ["yarn", "start:prod"]
