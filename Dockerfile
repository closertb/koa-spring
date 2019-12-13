FROM node:12.13.1

ADD . /app/

WORKDIR /app

# Install app dependencies
RUN npm install --registry=https://registry.npmjs.org

EXPOSE 8080

CMD [ "npm", "run", "client" ]