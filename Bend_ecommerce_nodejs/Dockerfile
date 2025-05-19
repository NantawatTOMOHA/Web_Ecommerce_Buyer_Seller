FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# copy .env file เข้า container ด้วย (ถ้าต้องใช้จริง)
COPY .env .env

EXPOSE 3000

CMD ["npm", "start"]

