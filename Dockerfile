FROM node:16-slim

WORKDIR /app

COPY package*.json ./

# RUN npm ci --only=production --omit=dev
RUN npm install

COPY . .
# COPY build/ /app/build/

EXPOSE 8000

CMD [ "npm", "run", "dev" ]
