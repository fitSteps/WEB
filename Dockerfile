# Stage 1: Build the React application
FROM node:20 as builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build your app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine

# Copy the build output to replace the default nginx contents.
COPY --from=builder /app/build /usr/share/nginx/html

# Launch nginx
CMD ["nginx", "-g", "daemon off;"]
