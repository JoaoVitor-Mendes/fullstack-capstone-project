const express = require('express');
const router = express.Router();

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const connectToDatabase = require('../models/db');
const logger = require('../logger');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();

        // Task 2: Access users collection
        const collection = db.collection('users');

        // Task 3: Check for existing email
        const existingUser = await collection.findOne({
            email: req.body.email
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists'
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        const email = req.body.email;

        // Task 4: Save user details
        await collection.insertOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: email,
            password: hash
        });

        // Task 5: Create JWT authentication
        const authtoken = jwt.sign(
            { email: email },
            JWT_SECRET
        );

        logger.info('User registered successfully');

        res.json({
            authtoken,
            email
        });

    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});

router.post('/login', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();

        // Task 2: Access users collection
        const collection = db.collection('users');

        // Task 3: Check user credentials
        const user = await collection.findOne({
            email: req.body.email
        });

        // Task 7: User not found
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        // Task 4: Compare password
        const passwordMatch = await bcryptjs.compare(
            req.body.password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                error: 'Invalid password'
            });
        }

        // Task 5: Fetch user details
        const userName = user.firstName;
        const userEmail = user.email;

        // Task 6: Create JWT authentication
        const authtoken = jwt.sign(
            { userId: user._id },
            JWT_SECRET
        );

        res.json({
            authtoken,
            userName,
            userEmail
        });

    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;