FROM node:20-alpine

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install -g npm && npm ci

COPY ./ ./

RUN chmod a+x ./start.sh

CMD ["./start.sh"]
