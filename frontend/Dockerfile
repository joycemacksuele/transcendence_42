FROM node:14

# Create app directory
WORKDIR ./transacendence_frontend

# Copy package.json and package-lock.json to the container
# The name 'package*'is the default name, so that 'npm install' recognizes it
COPY package*.json ./transacendence_frontend

# Install dependencies
# NPM (Node Package Manager) is a package manager for JavaScript. It is the
# default package manager for Node.js (a runtime environment
# for executing JavaScript code outside of a web browser.)
# The packages include libraries, frameworks, tools, and other dependencies
# that help with building web applications, server-side applications, or command-line tools.
RUN npm install

# Copy files to the container
COPY . .

# Expose the necessary port
EXPOSE 4000

# The command to start Node Package Manager
# It looks in the package*.json file to start the script, marked as 'my_start'
#           "scripts":
#           {
#               "my_start": "react-scripts start"
#           },
# The "react-scripts start" is typically used to start the 'development server', when creating a React app.
# This script includes the 'Create React App', which provides tools to build and run React apps.
CMD ["npm", "start"]



# In the package.json file, the "scripts" section is used to define various scripts or commands that can be executed using npm.

# The script "start": "react-scripts start" is a common script used in React.js applications created with Create React App. When you run npm start, npm will execute the command react-scripts start.

# The react-scripts package is a set of preconfigured scripts and configurations provided by Create React App, which is a popular tool for setting up React.js projects. The start script is one of the predefined scripts included in react-scripts.

# The start script is responsible for starting the development server for the React.js application. It typically launches a development server that provides hot-reloading, transpilation, and other development-related features to make the development process smoother and more efficient.

# By using react-scripts start, you don't need to worry about configuring the development server yourself or setting up the necessary build processes. Create React App abstracts away those complexities and provides a standardized way to start a React.js application in development mode.

# So, when you run npm start in a React.js project with Create React App, it will execute the react-scripts start command, which in turn starts the development server for your React.js application.