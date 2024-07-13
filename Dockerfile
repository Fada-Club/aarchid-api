# Use the official Node.js image as the base
FROM node:20-alpine

# Set the working directory
WORKDIR /dist

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

#Start the application
CMD [ "npm","start" ]