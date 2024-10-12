FROM ubuntu:22.04
# FROM node:16
# Use appropriate base image for your architecture
# FROM arm64v8/node:16

# Install build tools if necessary
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    python-is-python3 \
    curl \
    gnupg \
    lsb-release \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Rebuild TensorFlow.js from source if necessary
RUN npm rebuild @tensorflow/tfjs-node --build-from-source

# Copy application files
COPY . .

# Command to run the application
CMD [ "node", "./src/floodPredictionTool.js" ]
