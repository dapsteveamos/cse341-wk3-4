require('dotenv').config();  // Ensure environment variables are loaded

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,  // Ensure this is set in .env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  // Use true for HTTPS in production
}));

// Passport session setup
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes setup
app.use('/', require('./routes/authRoutes'));  // Authentication routes
app.use('/contacts', require('./routes/contacts'));  // Contacts routes

// Serve Swagger UI
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("MongoDB connected.");
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch(err => console.log("MongoDB connection error:", err));
