
# Stage 1: Build the React application
FROM node:22-alpine AS build

WORKDIR /app

# Receive the backend API URL
ARG VITE_API_BASE_URL

# Make it available to Vite during the build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy package files
COPY package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY . .

# Build production frontend
RUN npm run build


# Stage 2: Serve the built frontend
FROM nginx:alpine

# Copy build output to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose frontend port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
