const express = require('express');
const jwt = require('jsonwebtoken');
const {validateLogin}  = require('../utils/validation'); 
require('dotenv').config();


const router = express.Router();

router.get('/',(req, res) => {
    res.render('login');
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    const validation = await validateLogin(username, password);

    if (!validation.success) {
        return res.render('login', { errorMessage: validation.message });
    }
    const { user } = validation;
    const payload = {
        userId: user._id,
        username: user.username,
        isAdmin: user.isAdmin
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
});

module.exports = router;
