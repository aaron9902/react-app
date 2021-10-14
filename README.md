# react-app
react-app initial set up

To test this project on your local machine,

1. Download Node.js Package from https://nodejs.org/en/

2. Clone the project on your machine.

3. Install all dependancies -> # npm install

4. run the project -> # npm run dev
    - it will start the both backend(port 6000) and frontend (port 3000)

5. access - http://localhost:3000/ on your browser.
    
# directory structure

The application has two main folders: client (front end), server (back end)

## client/src

/components - html page render components, e.g. Forum page, Profile page

/App.js - front end initialization file

## server

/models - JSON collections to model objects, e.g. User, Forum, Thread

/routes - back end routes that perform certain actions when requested

/index.js - back end server file
