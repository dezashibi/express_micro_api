let User = require('../models/user');
let assert = require('assert');
let bcrypt = require('bcryptjs');

exports.run = () => {

    User.find({ type: "admin" }).count(function(err, count){
        assert.equal(null, err);

        if(count === 0) {
            let user = new User({
                name: "Administrator",
                username: "admin",
                password: bcrypt.hashSync("secret", 10),
                type: "admin",
            });

            user.save((err, result) => {
                assert.equal(null, err);

                console.log("Admin user created");

            });
        }

    });

};