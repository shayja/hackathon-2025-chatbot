# Use an official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Ensure package.json exists
RUN ls -la /app

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Ensure TypeScript is installed globally
RUN npm install -g typescript

# Compile TypeScript
RUN npx tsc

# Start the app
CMD ["node", "dist/app.js"]
