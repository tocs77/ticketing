FROM node:alpine

WORKDIR /app

COPY package.json .

COPY . .

RUN npm install --only=prod && npm cache clean --force

CMD ["npm", "start"]
