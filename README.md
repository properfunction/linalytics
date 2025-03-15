# linalytics

**Link to project:** https://linalytics.onrender.com/

TFT app that connects players of all skill levels and allows for insights from the community aimed at improving gameplay fundamentals.

## How It's Made:

**Tech used:** JavaScript, Node, Express, MongoDB, Bootstrap, EJS, Passport, Cloudinary, Bcrypt

Following an MVC model.
Using Node and Express to create a server that connects to MongoDB database via Mongoose. 
Adding authorisation using strategies from Passport, with enhanced security via password hashing from bcrypt. 
Opting for cloudinary middleware to provide an easy and optimised storage solution for media.
Rendering will be handled by EJS templating engine, which easily handles HTML and CSS styling from Tailwind

## Optimizations

Passing existing Mongoose client instead of MongoDB connection string directly:
We avoid making a separate connection for session storage by passing the existing Mongoose client to the session store (client: mongoose.connection.client).
This helps reduce the overhead of managing multiple database connections and ensures more consistent and faster operations.

Future Features: 
Use iframes to handle youtube video 

## Lessons Learned:

Having a good mockup and being able to identify what is needed in your Schema really helps when programming the functionality and implementing the application logic



