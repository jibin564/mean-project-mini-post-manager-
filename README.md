# MEAN Stack Application (Monorepo)



This repository contains a full MEAN stack application structured as a monorepo.



## Project Structure



meanproject/

├── src/ → Angular frontend

├── backend/ → Node.js + Express backend logic

├── server.js → Backend entry point

├── angular.json, tsconfig* → Angular configuration

├── package.json → Shared dependencies

└── .env (ignored) → Environment variables



## Tech Stack



Frontend:

- Angular

- TypeScript

- Angular Material



Backend:

- Node.js

- Express

- MongoDB (Atlas)

- JWT Authentication



## Environment Setup



Create a `.env` file in the root:



MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret



> `.env` is intentionally ignored via `.gitignore`.



## Run Locally



Install dependencies:



npm install



Run backend:



nodemon server.js



Run frontend:



ng serve