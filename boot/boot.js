let express = require('express');
let assert = require('assert');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let path = require('path');
let cors = require('cors');

let seeder = require('./seeds');

function startServer(app, port) {
    // start server
    app.listen(Number(port), () => {


        // Handle 404 issues
        app.use((req, res, next) => {
            res.status(404);
            res.sendFile(path.join(app.get('public'), '404.html'));
        });

        // Handle stack trace errors
        app.use((err, req, res, next) => {
            console.log(err.stack);

            res.status(500);
            res.sendFile(path.join(app.get('public'), '500.html'));
        });

        console.log('Server is running on port : ' + port);

    });
}

module.exports = (app) => {
    let config = app.settings.config;
    let mongodbURL = app.settings.mongoUrl;

    // Register body parser for Post, Updates, Delete,...
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(cors());

    app.use(express.static(app.get('public')));

    // registering routes
    require('../routes/routes')(app);


    mongoose.connect(mongodbURL, (err) => {
        // Assert server starting error
        assert.equal(null, err);

        console.log("connected successfully to mongodb server: " + mongodbURL);

        // Running Seeder
        seeder.run();

        startServer(app, config.port_number);
    });
};


