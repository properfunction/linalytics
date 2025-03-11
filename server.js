const express = require('express');
const session = require('express-session')
const app = express(); // Initialize express app
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')
const flash = require('express-flash') 
const logger = require('morgan')
const passport = require('passport')
const connectDB = require('./config/database.js')
const Test = require('./models/Test.js')
const mainRoutes = require('./routes/main.js')
const authRoutes = require('./routes/auth.js')
const postRoutes = require('./routes/post.js')
const commentRoutes = require('./routes/comment.js')

// Load environment variables
require("dotenv").config({ path: "./config/.env" })

// Passport config
require("./config/passport")(passport)

// Connect to Database 
connectDB()

// Use EJS for views
app.set("view engine", "ejs")

// Static folder
app.use(express.static("public"))

// Body Parsing
app.use(express.json()) // Parses JSON bodies
app.use(express.urlencoded({ extended: true })) // Parses url-encoded bodies from forms

// Logging
app.use(logger("dev"));

// Method override for forms
app.use(methodOverride("_method"));

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
  
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Flash messages for errors, etc
app.use(flash()); // Ensure it's setup after express-session since flash relies on session storage

// Setup Routes that server is listening for

app.use('/', mainRoutes)
app.use('/auth', authRoutes)
app.use('/post', postRoutes)
app.use('/comment', commentRoutes)

// test
app.post('/test', async (req, res) => {
  try {
    console.log('Request Body:', req.body);  // Log the incoming data

    const { caption } = req.body; // Grab content from the request body and stor it in caption
    if (!caption) {
      return res.status(400).send('Caption is required');
    }

    const newTest = new Test({ caption }); // Pass caption into the Test model and store it in db

    const savedTest = await newTest.save(); // Use await instead of callback
    console.log('Saved Test:', savedTest);

    res.status(201).json(savedTest);
  } catch (err) {
    console.error('Error saving:', err);
    res.status(500).send(err);
  }
});


// Server running
app.listen(process.env.PORT, () => { // Use PORT from process.env
    console.log('Server is running, you better go catch it!')
})