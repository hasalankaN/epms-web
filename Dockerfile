# Install dependencies and build the Next.js app
FROM node:18-alpine as build
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Add ENV variables
ENV NEXT_PUBLIC_API_BASE_URL=https://lms-binzo-backend-dev-956769189464.asia-southeast1.run.app
ENV JWT_SECRET=binzo-admin-jwt-secret-2026

# Build the Next.js application
RUN npm run build

# Production image
FROM node:18-alpine
WORKDIR /app

# Copy the necessary files from the build stage
COPY --from=build /app /app

# Expose the port on which the app will run
ENV PORT 8080
ENV HOST 0.0.0.0
EXPOSE 8080

# Start the Next.js application
CMD ["npm", "start"]
