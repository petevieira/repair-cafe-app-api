# syntax=docker/dockerfile:1

FROM node:16.20.0
WORKDIR /app
COPY . .
EXPOSE 3000
RUN npm install -g nodemon
RUN npm install --omit=dev
CMD ["npm", "run", "start:prod"]
EXPOSE 3000