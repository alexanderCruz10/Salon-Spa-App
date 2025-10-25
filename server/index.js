/* eslint-disable no-undef */
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectMongoDB = require('./config/mongodb-config');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

connectMongoDB();

const userRoute = require('./routes/user-route');
const authRoute = require('./routes/auth-route');
const salonRoute = require('./routes/salon-route');

app.use(express.json()); //parser for JSON data
app.use(cookieParser()); // Parse cookies

// Manual CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

//allow cors for all origins
app.use(cors({
    origin: "http://localhost:5173", // Specific frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/salons", salonRoute);

// Add a simple health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running!' });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Node+Express Server is running on port ${port}`);
});