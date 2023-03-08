# ⚽ A soccer teams ranking REST API developed as a [Trybe](https://www.betrybe.com/) Project

## 💻 About this project
In this application, through the front-end the user can loggin, add matches, edit matches in progress' goals, finish matches, check the leaderboard and filter it. The front-end of this application was provided by [Trybe](https://www.betrybe.com/), therefore all files in `./app/frontend` repository are Trybe's intellectual property, as well some files in `./app/backend` repository (as Sequelize configuration and seeders) provided in order to accelerate the development of the application. 

## 🛠️ Back-End built with
<a href="https://www.docker.com" target="_blank" rel="noreferrer"><img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" /></a>
<a href="https://nodejs.org/en/" target="_blank" rel="noreferrer"><img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /></a>
<a href="https://expressjs.com" target="_blank" rel="noreferrer"><img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js" /></a>
<a href="https://sequelize.org" target="_blank" rel="noreferrer"><img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white" alt="Sequelize" /></a>
<a href="https://jwt.io" target="_blank" rel="noreferrer"><img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JSON Web Tokens" /></a>
<a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"><img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>

## 🏁 Getting started
### 🐳 Installing Docker and Docker Compose
As the project is containerized, to run the application you will need to install both softwares. The Docker Compose version supported by the project is 1.29 or higher.

### ⬇️ Installing the dependencies
Inside root directory run:
```
npm run install:apps
``` 
### 📦 Creating and starting the application's containers
Inside root directory run:
```
npm run compose:up
``` 
You can also stop and remove the containers by running the following command:
```
npm run compose:down
``` 

### 🖥️ Setting enviroment variables
The following environment variables must be settled in order to run the project. You can do this creating a `.env` file and declaring the variables:
```
JWT_SECRET=
APP_PORT=
DB_USER=
DB_PASS=
DB_HOST=
DB_PORT=
```

### 🏃‍♀️ Running the application
Creating the containers must start them automatically. Though, if the containers stopped, you can restart them or start the front-end and back-end by running the command `npm run start` in repository's terminals.

