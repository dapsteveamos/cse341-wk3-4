const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('./data/database');
const app = express();

const port = process.env.PORT || 3000;

// Enable CORS with the `cors` middleware
app.use(cors()); // By default, this allows all origins, headers, and methods

// Parse incoming JSON requests
app.use(bodyParser.json());

// Import routes from your routes file
app.use('/', require('./routes'));

// Initialize the database and start the server
mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        // Start the server after successful database initialization
        app.listen(port, () => {
            console.log(`Database connected and Node.js is running on port ${port}`);
        });
    }
});
