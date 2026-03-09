# SLifeCode

SLifeCode is a full-stack web application that explores the intersection of computer science and psychology by digitizing the Szondi test.

It allows users to create an account, log in, take the test online, view their results, read articles, and complete surveys. The platform also supports psychological research through structured data collection and analysis-oriented features.

## Live Demo

Frontend: https://scode4life.netlify.app

### Features

- User authentication
- Online Szondi test flow
- Result visualization
- Articles and surveys
- Structured data collection for research

### Tech Stack

**Frontend**
- React
- JavaScript
- HTML
- CSS
- Axios

**Backend**
- Node.js
- Express.js

**Database**
- MySQL

**Deployment**
- Netlify (frontend)
- Railway (backend)

### Project Status

The application is functional and deployed. Ongoing improvements include responsive design for mobile and tablet devices, as well as feature refinement and UI enhancements.

## Running Locally

### Frontend
```bash
npm install
npm start

### Backend

Create a `.env` file in the `server` folder with the required environment variables.

Example:

```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
JWT_SECRET=

Then run the backend server:
npm install
npm start


## Project Structure

/public   – Static files for the React frontend  
/src      – React application code  
/server   – Backend API and database logic (Node.js + Express)
