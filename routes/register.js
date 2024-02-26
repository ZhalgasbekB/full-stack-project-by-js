const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { validateRegistration } = require('../utils/validation'); 



const router = express.Router();

router.get('/', (req, res) => {
    res.render('register');
});

router.post('/', async (req, res) => {
    const { username, password, password2 } = req.body;

    const validationResult = await validateRegistration(username, password, password2);
    if (!validationResult.success) {
        return res.status(400).render('register', { errorMessage: validationResult.message, username, password, password2 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    try {
        await user.save();
        return res.render('register', { successMessage: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).render('register', { errorMessage: 'Error registering user', username });
    }
});

module.exports = router;
