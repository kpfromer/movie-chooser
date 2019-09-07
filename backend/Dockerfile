FROM node:12.10.0

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm ci

COPY . /app

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main.js"]