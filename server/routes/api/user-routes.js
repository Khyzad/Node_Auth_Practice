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
        User.findOne({ // check if email is already taken
            email: email
        }, function (err1, user1) {
            User.findOne({ // check if username is already taken
                username: username
            }, function (err2, user2) {
                let err = { errors: [] };
                if (user1) {
                    err.errors.push({
                        param: "email",
                        msg: "Email is already in use"
                    });
                }
                if (user2) {
                    err.errors.push({
                        param: "username",
                        msg: "Username is already in use"
                    });
                }

                // return 406 if there were any errors, else create user and return ok
                if (err.errors.length > 0) {
                    res.status(406).json(err);
                } else {
                    User.createUser(new User({
                        name: name,
                        email: email,
                        username: username,
                        password: password
                    }), function (err) {
                        if (err) {
                            res.status(406).json({ errors: err });
                        } else {
                            res.status(200).json({});
                        }
                    });
                }
            });
        });
    }
});

// retrieve user
router.get('/:id', function (req, res) {
    User.getUserById(req.params.id, function (err, user) {
        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(406).json({
                error: "user id does not exist"
            });
        }
    });
});

// update user

// delete user
router.delete('/:id', function(req, res){
    User.findByIdAndDelete(req.params.id, function(err, user) {        
        if(user){
            res.status(200).json({})
        }else{
            res.status(406).json({msg: "user with that id does not exist"})
        }
    });
    
});

module.exports = router;