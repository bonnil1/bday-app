FROM node:23-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5001

CMD ["node", "backend/server.js"]
