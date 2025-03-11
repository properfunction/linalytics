// Core modules
const express = require('express');
const session = require('express-session')
const app = express(); // Initialize express app

// Third-party modules
require("dotenv").config({ path: "./config/.env" }) // Load environment variables
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')

// Local modules
const connectDB = require('./config/database.js')

// Connect to Database 
connectDB()

// Static folder
app.use(express.static("public"))

// Body Parsing
app.use(express.json()) // Parses JSON bodies
app.use(express.urlencoded({ extended: true })) // Parses url-encoded bodies from forms

// Setup Sessions - stored in MongoDB
app.use(
    session({
      secret: "keyboard cat", // Change this to a secure string
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        // mongoUrl: process.env.DB_STRING,
        client: mongoose.connection.client, // Reuse the existing Mongoose client connection to avoid creating a separate connection for session storage
        ttl: 14 * 24 * 60 * 60, // Optional: time to live (in seconds). After that, session will expire and user will need to login again
      }),
    })
  );
  

// Setup Routes that server is listening for
app.get('/', (req, res) => {
    res.send('Hello wd')
})

// Server running
app.listen(process.env.PORT, () => { // Use PORT from process.env
    console.log('Server is running, you better go catch it!')
})