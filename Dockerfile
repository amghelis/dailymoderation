FROM node:latest

ARG MODE='prod'
ENV MODE_ENV=${MODE}

RUN echo $MODE

WORKDIR /app

COPY package*.json ./

COPY . ./

EXPOSE 3000

RUN npm install

ENTRYPOINT npm run $MODE_ENV

