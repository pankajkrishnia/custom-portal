const express = require('express');
const router = express.Router();
const config = require('config.json');
const jwt = require('jsonwebtoken');



router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('signup');
})

router.get('/dashboard', (req, res) => {
    // console.log(req.body)
    if (req.cookies.auth) {
        jwt.verify(req.cookies.auth.token, config.secret, function (err, decoded) {
            if (!err) {
                data = {
                    username: req.cookies.auth.firstName,
                    email: req.cookies.auth.username
                };
                let token = req.cookies.auth.token;
                res.render("dashboard",{data:data, token: token})
            }
            else {
                res.redirect("/");
            }
        });
    }
    else {
        res.redirect("/");
    }
})
router.get('/logout', (req, res) => {
    res.clearCookie("auth");
    res.status(200).redirect('/')
})

module.exports = router;