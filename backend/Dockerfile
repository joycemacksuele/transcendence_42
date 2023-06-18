FROM node:16-alpine
#FROM node:18-slim

# Create app directory
WORKDIR /transacendence_backend

# have nodemon available for local dev use (file watching)
RUN npm install -g nodemon

# Copy package.json and package-lock.json to the container WORKDIR
# The name 'package*'is the default name, so that 'npm install' recognizes it
COPY package*.json .

# NPM (Node Package Manager) is a package manager for JavaScript. It is the default package manager
# for Node.js (a runtime environment for executing JavaScript code outside of a web browser).

# Install dependencies
# Installs in the container, the application dependencies listed in package.json.
RUN npm install
# npm notice New minor version of npm available! 9.6.7 -> 9.7.1
#RUN npm install -g npm@9.7.1

# Copy files to the container WORKDIR
COPY . .

# The npm run build command is used to build the application in the container.
# This command will typically create a dist folder with the production build of the application.
RUN npm run build

# Expose the necessary port
EXPOSE 3000

# Running the server
#CMD cd dist && node main.js or CMD ["node", "main.js"] ???
CMD ["node", "run", "start:dev"]
# CMD: Specifies the command to run when the container starts.
# start:dev will start the server in development mode. This command watches for changes in the code and
# automatically rebuilds the container when changes are detected. This allows for faster development cycles,\
# as changes to the code can be quickly tested in the container without manual rebuilding or restarting.