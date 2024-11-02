FROM node:latest

WORKDIR /app

COPY . /app
COPY .docketignore /app/.dockerignore

RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]