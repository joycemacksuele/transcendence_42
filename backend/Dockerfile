# Specify the base image
FROM node:lts

# Set the working directory to the app folder
WORKDIR /backend

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the Nest.js application code to the container
COPY . .

# Expose the necessary port(s)
EXPOSE 3001

# Start the Nest.js application
# CMD [ "npm", "run", "start:prod" ]
CMD [ "npm", "run", "start:dev" ]