let bcrypt = require('bcryptjs');
let config = require('../config/main');
let jwt = require('jsonwebtoken');
let User = require('../models/user');
let sec = require('../middlewares/security');

class UsersController {

    index(req, res) {

        User.find({}, (err, result) => {
            if (err) {
                res.status(500);
                res.send({ success: false, msg: err });
                return;
            }
            if (result) {
                res.status(200);
                res.send(result);
            } else {
                res.status(500);
                res.send({ success: false, msg: "No Data" });
            }
        });
    };


    signIn(req, res) {

        let user = req.body;

        User.findOne({"username": user.username}, (err, foundUser) => {
            res.type('application/json');

            if (err) {
                return res.status(500).json({
                    success: false,
                    msg: err
                });
            }

            if (!foundUser) {
                return res.status(401).json({
                    success: false,
                    msg: "Authentication failed"
                });
            }

            if (!bcrypt.compareSync(user.password, foundUser.password)) {
                return res.status(401).json({
                    success: false,
                    msg: "Authentication failed"
                });
            }

            let token = jwt.sign({user: foundUser}, config.jwtSecretKey, {expiresIn: 60});
            res.status(200).json({
                success: true,
                userType: foundUser.type, // Assign user type to returned json for using in angular
                token: token
            });

        });

    };

    store(req, res) {

        let item = req.body;

        let user = new User({
            name: item.name,
            username: item.username,
            password: bcrypt.hashSync(item.password, 10),
            type: "moderator",
        });

        user.save((err, result) => {
            res.type('application/json');

            if (err) {
                res.status(400);
                res.json({ success: false, error: "User registration failed: " + err });
            } else {
                res.status(201);
                res.json(result);
            }
        });
    };

    update(req, res) {

        if(!sec.checkUserPrivilegeForUpdate(req.params.id)) {
            res.status(400);
            res.send({ success: false, msg: "You cannot update other's profile" });
            return;
        }

        if(req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        } else {
            res.status(400);
            res.send({ success: false, msg: "Failed to update" });
            return;
        }

        User.findByIdAndUpdate(req.params.id,{password: req.body.password} ,(err, user) => {
            if (err) {
                res.status(400);
                res.send({ success: false, msg: "Failed to update" });
                return;
            }

            if (user) {
                res.status(200);
                res.json({ success: true, msg: "Data updated"});
            } else {
                res.status(401);
                res.json({ success: false, msg: "Data not found"});
            }
        });
    };

    destroy(req, res) {

        User.findByIdAndRemove(req.params.id, (err, user) => {

            if (err || sec.getUserRole(req.params.id) === "admin") {
                res.status(400);
                res.send({ success: false, msg: "Failed to delete" });
                return;
            }

            if (user) {
                res.status(200);
                res.json({ success: true, msg: "Data removed"});
            } else {
                res.status(401);
                res.json({ success: false, msg: "Data not found"});
            }
        });
    };

    

}

module.exports = UsersController;


