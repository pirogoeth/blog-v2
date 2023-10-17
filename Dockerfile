FROM docker.io/library/node:slim

COPY ./build /app

WORKDIR /app
RUN npm i

ENTRYPOINT ["node", "/app/index.js"]
EXPOSE 3000