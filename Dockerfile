FROM node:16-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production --omit=dev

COPY . .

EXPOSE 8000

CMD [ "node", "app.js" ]
