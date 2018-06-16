var express = require('express');

var accountModel = require('../models/accountModel');
var restrict = require('../middle-wares/restrict');

var router = express.Router();

router.get('/login', (req, res) => {
    res.render('account/login');
});

router.post('/login', (req, res) => {
    var user = {
        username: req.body.username,
        password: req.body.rawPWD
    };

    accountModel.login(user).then(rows => {
        if (rows.length > 0) {
            req.session.isLogged = true;
            req.session.user = rows[0];
            req.session.cart = [];

            var url = '/';
            if (req.query.retUrl) {
                url = req.query.retUrl;
            }
            res.redirect(url);

        } else {
            var vm = {
                showError: true,
                errorMsg: 'Login failed'
            };
            res.render('account/login', vm);
        }
    });
});

router.get('/register', (req, res) => {
    res.render('account/register');
});

router.post('/register', (req, res) => {

    var today = new Date();
    var todayString = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    var user = {
        username: req.body.username,
        password: req.body.rawPWD,
        type: 0,
        block: 0,
        opendate: todayString,
        fullName: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address
    };

    accountModel.add(user).then(value => {
        res.render('account/register');
    });
});


router.get('/profile', restrict, (req, res) => {
    res.render('account/profile');
});

router.post('/logout', (req, res) => {
    req.session.isLogged = false;
    req.session.user = null;
    // req.session.cart = [];
    res.redirect(req.headers.referer);
});

module.exports = router;