FROM node:20-alpine

ENV TZ=Europe/Paris

# Set timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
