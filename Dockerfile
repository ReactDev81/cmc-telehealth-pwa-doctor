FROM node:20-alpine

WORKDIR /app

# Install dependencies needed for some packages (VERY IMPORTANT)
RUN apk add --no-cache libc6-compat

COPY package*.json ./

# 🔥 BEST FIX
RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
