# syntax=docker/dockerfile:1

FROM node:16.20.0
WORKDIR /app
COPY . .
RUN npm install -g nodemon
RUN npm install --production --omit=dev
CMD ["npm", "run", "start:prod"]
EXPOSE 3000