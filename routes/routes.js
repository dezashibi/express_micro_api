let UsersController = require('../controllers/users');
let usersController = new UsersController();

module.exports = (app) => {
    app.prefix("/api/v1", (router) => {
        router.route('/authenticate').post(usersController.signIn);
    });

    require('./users')(app);
};
