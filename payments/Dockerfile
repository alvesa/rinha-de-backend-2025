FROM node:23-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the app using local nest binary
RUN npx nest build

# Start the app (optional, depending on context)
CMD ["node", "dist/main"]
