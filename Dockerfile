FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY postcss.config.* ./
COPY tailwind.config.* ./
COPY ../.env.local ../.env.local

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev"]