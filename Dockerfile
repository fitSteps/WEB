# Use the official Node.js 18 Alpine image as base
FROM node:18-alpine

# Install tzdata package for timezone data
RUN apk add --no-cache tzdata

# Set the timezone environment variable
ENV TZ=Europe/Ljubljana

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install dependencies using npm (assuming package.json is present)
RUN npm install

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
