FROM node:18-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json package-lock.[json] /app/
RUN if [ -f "package-lock.json" ]; then npm ci; else npm install; fi

EXPOSE 8080
COPY schema /app/schema
COPY src /app/src
CMD ["node", "src/index.mjs"]

