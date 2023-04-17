# Use Node.js 14 as the base image
FROM node:14

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the microservice source code to the working directory
COPY app.js .

# Expose the HTTP port
EXPOSE 3333

# Start the microservice
CMD ["node", "app.js"]