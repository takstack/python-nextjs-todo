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
# Copy the rest of the application
COPY . .

# set env vars
ARG NEXT_PUBLIC_APPWRITE_URL
ARG NEXT_PUBLIC_APPWRITE_PROJECT_ID
ARG NEXT_PUBLIC_API_URL
ARG NODE_ENV

ENV NEXT_PUBLIC_APPWRITE_URL $NEXT_PUBLIC_APPWRITE_URL
ENV NEXT_PUBLIC_APPWRITE_PROJECT_ID $NEXT_PUBLIC_APPWRITE_PROJECT_ID
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL
ENV NODE_ENV $NODE_ENV

RUN echo "The value of NEXT_PUBLIC_APPWRITE_URL is: $NEXT_PUBLIC_APPWRITE_URL"
RUN echo "The value of NEXT_PUBLIC_APPWRITE_PROJECT_ID is: $NEXT_PUBLIC_APPWRITE_PROJECT_ID"
RUN echo "The value of NEXT_PUBLIC_API_URL is: $NEXT_PUBLIC_API_URL"
RUN echo "The value of NODE_ENV is: $NODE_ENV"


# Install dependencies
RUN npm install
RUN npm install appwrite --save

# Expose the port the app runs on
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev"]