// Core modules
const express = require('express');
const app = express(); // Initialize express app

// Third-party modules
require("dotenv").config({ path: "./config/.env" }) // Load environment variables and instantiate it with the config() written last
// const mongoose = require('mongoose') // *** Already imported in database.js, don't think it's necessary here ***

// Local modules
const connectDB = require('./config/database.js')

// Middleware
app.use(express.json()) // Parses JSON bodies
app.use(express.urlencoded({ extended: true })) // Parses url-encoded bodies from forms

connectDB() // Call the function to connect to DB after all the imports are done

app.get('/', (req, res) => {
    res.send('Hello wd')
})

// Server running
app.listen(process.env.PORT, () => { // Use PORT from process.env
    console.log('server running')
})