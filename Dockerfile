# syntax=docker/dockerfile:1

FROM node:16.20.0
WORKDIR /app
COPY package*.json ./
EXPOSE 3000
RUN npm install pm2 -g
RUN npm install
COPY src ./
COPY .env ./
CMD ["npm", "run", "start:prod"]
