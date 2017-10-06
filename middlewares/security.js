let jwt = require('jsonwebtoken');
let config = require('../config/main');
let User = require('../models/user');
let assert = require('assert');

// simple appkey which also can be developed in database
let appKey = "11223344";



let validate = (key) => {
    return key === appKey;
};

exports.authorization = (req, res, next) => {
    console.log("In authorization");

    let appKeyParam = req.headers.appkey; // header keys should be in lower case no matter how they inserted

    console.log(appKeyParam);

    if(typeof appKeyParam !== "undefined") {
        // get authorization header info
        if (appKeyParam !== null) {
            if (validate(appKeyParam)) {
                next();
            }
        }
    } else {
        res.status(401);
        res.type('application/json');
        res.json({ success: false, msg: "Not Authorized" });
    }
};

// JsonWebToken security
exports.jwtAuth = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];

    if(req.headers['authorization']) {
        let part = token.split(' ');
        if(part.length === 2)
            token = part[1];
        else
            token = part[0];
    }

    jwt.verify(token, config.jwtSecretKey, (err, decoded) => {
        if (err) {
            res.status(401);
            res.type('application/json');
            res.json({ success: false, msg: "Not Authorized" });
            return;
        }

        next();
    });
};

// User management Authorization
// Only Admin can List/delete/add users
exports.adminAuthorize = (req, res, next) => {

    let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];

    if(req.headers['authorization']) {
        let part = token.split(' ');
        if(part.length === 2)
            token = part[1];
        else
            token = part[0];
    }
    // console.log(token);
    jwt.verify(token, config.jwtSecretKey, (err, decoded) => {

        if (err) {
            res.status(401);
            res.type('application/json');
            res.json({ success: false, msg: "Not Authorized" });
            return;
        }

        if(typeof decoded.user.type === "undefined" || decoded.user.type !== "admin") {
            res.status(401);
            res.type('application/json');
            res.json({ success: false, msg: "Not authorized only admin can do this stuff." });
            return;
        }

        next();

    });

};

// Get the user role
exports.getUserRole = (id) => {
    User.findById(id, (err, foundUser) => {
        assert.equal(null, err);

        if(!foundUser) {
            return "moderator";
        }

        return foundUser.type;
    });
};   

// check user's privilege for update
exports.checkUserPrivilegeForUpdate = (id) => {
    jwt.verify(req.query.token, config.jwtSecretKey, (err, decoded) => {
        assert.equal(null, err);

        User.findById(id, (err, foundUser) => {
            assert.equal(null, err);
    
            return foundUser._id === decoded.user._id;

        });

    });
    
};
