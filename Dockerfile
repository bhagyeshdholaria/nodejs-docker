FROM node:alpine
LABEL authors="bhagyesh"

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]