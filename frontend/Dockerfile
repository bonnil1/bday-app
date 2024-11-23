#use node.js runtime as base image
FROM node:23-alpine

#set working directory in the container
WORKDIR /app

#copy package.json files
COPY package*.json .

#install dependences
RUN npm install

#copy all files into the container
COPY . . 

#expose the app's port
EXPOSE 3000

#how to run the app 
CMD [ "npm", "run", "dev"]