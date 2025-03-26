# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Install tzdata for timezone configuration
RUN apt-get update && apt-get install -y tzdata

# Set the timezone to Asia/Taipei (UTC+8)
ENV TZ=Asia/Taipei

# Install pnpm globally and clean npm cache to reduce image size
RUN npm install -g pnpm && npm cache clean --force

# Copy package.json and pnpm-lock.yaml (if available)
COPY package.json pnpm-lock.yaml ./

# 清除先前的 node_modules 和 pnpm 缓存
RUN rm -rf node_modules && pnpm store prune

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm build

# Expose the port the app runs on (default for Cloud Run is 8080)
EXPOSE 8080

# Define the command to run the application
CMD ["pnpm", "prod"]