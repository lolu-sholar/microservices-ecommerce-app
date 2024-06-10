FROM node:20

ENV DOCKER=true

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9000

CMD ["node", "app/index.js"]