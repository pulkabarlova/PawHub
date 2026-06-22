FROM node:20-alpine

WORKDIR /app

# The real `mongo` service is used in Docker, so prevent mongodb-memory-server
# from ever attempting to download a mongod binary.
ENV MONGOMS_DISABLE_POSTINSTALL=1

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 5001
CMD ["node", "server.js"]
