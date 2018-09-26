const express = require('express');
const router = express.Router();
const User = require('../../models/user');

// create user
router.post('/register', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    // validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email  is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Name is required').notEmpty();
    req.checkBody('password', 'Name is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(password);


    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json({ errors: errors });
    } else {
        // check if email is already taken
        User.findOne({
            email: email
        }, function (err1, user1) {
            User.findOne({
                username: username
            }, function (err2, user2) {
                let err = {errors:[]};                
                if (user1) {
                    err.error.push({
                        param: "email",
                        msg: "Email is already in use"
                    });
                }
                if (user2) {
                    err.error.push({
                        param: "username",
                        msg: "Username is already in use"
                    });                    
                }
                
                if (err.error.length > 0) {
                    res.status(406).json(err);
                } else {                    
                    User.createUser(new User({
                        name: name,
                        email: email,
                        username: username,
                        password: password
                    }, function (err, callback) {                        
                        if(err){
                            res.status(406).json({ errors: err });
                        }else{
                            res.status(200);
                        }                        
                    }));
                }
            });        
        });

        // check if username is already taken
        // User.findOne({
        //     username: username
        // }, function (err, user) {
        //     if (user) {
        //         res.status(406).json({ error: "Email is already in use" });
        //     }
        // })

        // console.log('h3');
        //res.status(200);//.json({ error: "Email is already in use" });
        //console.log(user);

        // User.findOne({
        //     username: {
        //         "$regex": "^" + username + "\\b", "$options": "i"
        //     }
        // }, function (err, user) {
        //     User.findOne({
        //         email: {
        //             "$regex": "^" + email + "\\b", "$options": "i"
        //         }
        //     }, function (err, mail) {
        //         if (user || mail) {
        //             res.render('register', {
        //                 user: user,
        //                 mail: mail
        //             });
        //         }
        //         else {
        //             var newUser = new User({
        //                 name: name,
        //                 email: email,
        //                 username: username,
        //                 password: password
        //             });
        //             User.createUser(newUser, function (err, user) {
        //                 if (err) 
        //                     res.status(406).json({error: err});                        
        //             });
        //             res.status(200).json('You are registered and can now login');                    
        //         }
        //     });
        // });        
    }
});

// retrieve user

// update user

// delete user


module.exports = router;