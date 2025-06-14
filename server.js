const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { initDb } = require('./data/database');  // Import initDb function

dotenv.config();  // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
    origin: '*', // Allow all origins (you can restrict this in production)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));  // Enable CORS middleware

// Passport GitHub strategy setup
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

// Session management
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Middleware setup
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' },
}));
app.use(passport.initialize());
app.use(passport.session());

// Swagger UI route
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Route for contacts
app.use('/contacts', require('./routes/contacts'));

// GitHub Authentication routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback route for GitHub OAuth
app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/');
    });

// Remove this if it's not necessary anymore, or you can modify it.
// app.get('/', (req, res) => {
//     res.send('Welcome to the Contacts API!');  
// });

// Initialize the database before starting the server
initDb()
    .then(() => {
        console.log("MongoDB connected.");
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error("Database initialization failed:", err);
        process.exit(1);  // Exit if database connection fails
    });
