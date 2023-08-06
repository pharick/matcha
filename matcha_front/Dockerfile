FROM node:20

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm ci

COPY ./ ./

RUN chmod a+x ./start.sh

CMD ["./start.sh"]
