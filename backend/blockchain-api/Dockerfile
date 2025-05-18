# Use Node.js 20 as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies (keeping dev dependencies for migrations)
RUN npm install

# Copy the rest of the application code
COPY . .

# Set the container to listen on port 3001
ENV PORT=3001
EXPOSE $PORT

# Start the application - run migrations and then start the server
CMD ["sh", "-c", "node db-migrate.js && node server_db.js"]