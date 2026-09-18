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

module.exports = router;