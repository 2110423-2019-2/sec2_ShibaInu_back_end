FROM node:12-alpine
WORKDIR /server
RUN apk --no-cache add --virtual builds-deps build-base python
COPY ./sec2_shibainu_backend/package.json .
COPY ./sec2_shibainu_backend/dist ./dist
RUN yarn
CMD ["yarn", "start:prod"]
