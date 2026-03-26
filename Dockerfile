# 1. Base Image - Node 20 on Alpine
FROM node:22-alpine

# 2. Set Working Directory
WORKDIR /app

# 3. Copy only dependency files first to leverage Docker cache
COPY package.json package-lock.json* ./

# 4. Install Dependencies
RUN npm install --legacy-peer-deps

# 5. Copy the rest of the application code
COPY . .

# 6. Build the Next.js production bundle
RUN npm run build

# 7. Expose the Requested Port
EXPOSE 8000

# 8. Start the application on Port 7001
CMD ["npm", "run", "start", "--", "-p", "8000"]