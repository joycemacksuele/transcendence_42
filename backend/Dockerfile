# Specify the base image
FROM node:lts

# Set the working directory to the app folder
WORKDIR /backend

ARG MYSECRET=test

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./
RUN chmod 777 ./package.json
# chmod as an attempt to get rid of this error:
# npm ERR! enoent ENOENT: no such file or directory, open '/backend/package.json'
# npm ERR! enoent This is related to npm not being able to find a file.

# Install dependencies
RUN npm install

# Copy the rest of the Nest.js application code to the container
COPY . .

# Expose the necessary port(s)
EXPOSE 3001

# Start the Nest.js application
# Development:
# CMD [ "npm", "run", "start" ]
# Watch mode:
CMD [ "npm", "run", "start:dev" ]
# Production mode:
# CMD [ "npm", "run", "start:prod" ]