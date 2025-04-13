FROM node:18-alpine

WORKDIR /
COPY .env.local /

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY postcss.config.* ./
COPY tailwind.config.* ./
# COPY ../.env.local ../.env.local

# Copy the rest of the application
COPY . .

# set env vars
# ARG NEXT_PUBLIC_APPWRITE_URL
# ARG NEXT_PUBLIC_APPWRITE_PROJECT_ID

# Install dependencies
RUN npm install



# Expose the port the app runs on
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev"]