FROM node:18.70.0
WORKDIR /web-client 
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8082
CMD [ "npm", "start" ]