const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../ models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    let user;
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
            return res.status(500).json(
                {error: err.message}
            )
        } else {
                user = new User({
                    email: req.body.email,
                    password: hash
                })
        }
        try{
            await user.save()
            res.status(200).json({
                message: 'user created'
            })
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                err: e.message
            })
        }
    })

})

router.post('/login', async (req, res) => {
    let user;
    try {
        user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(400).json({
                message: 'wrong credentials'
            })
        }
        const isIdentical = await bcrypt.compare(req.body.password, user.password)
        if (!isIdentical) {
            return res.status(400).json({
                message: 'wrong credentials'
            })
        }
        
        const token = await jwt.sign({
            email: user.email,
            id: user._id
        }, 'secret')
        return res.status(200).json({
            message: 'successful credentials',
            token: token
        })
        
    } catch(e) {
        return res.status(500).json({
            error: e.message
        })
    }
})

module.exports = router;