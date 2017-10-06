let express = require('express');
let config = require('./config/main');
let path = require('path');


// providing route prefixing for express Router
express.application.prefix = express.Router.prefix = function (path, configure) {
    let router = express.Router();
    this.use(path, router);
    configure(router);
    return router;
};

let app = express();


let mongodbURL;


// Get env args
let port_string = process.argv[2];
let env_value = process.argv[3];

if (typeof port_string !== "undefined" && port_string.length > 0) {
    console.log("port string: " + port_string);
    config.port_number = port_string;
}

// Default env value is DEV
if (typeof env_value === "undefined") {
    console.log("env_value is not set , Default env is DEV");
    env_value = "DEV";
}

switch (env_value) {
    case "DEV":
        mongodbURL = config.localDB.connection;
        console.log("environment = " + mongodbURL);
        break;

    case "PROD":
        mongodbURL = config.db.connection;
        console.log("environment = " + mongodbURL);
        break;

    default:
        console.log("env_value is not correct: " + env_value);
        return -1;
}

// Set the public folder
app.set('public', path.join(__dirname, 'public'));

app.set("config",config);
app.set("mongoUrl", mongodbURL);


require('./boot/boot')(app);




