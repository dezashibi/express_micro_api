let UsersController = new require('../controllers/users');
let usersController = new UsersController();
let securityController = require('../middlewares/security');

module.exports = (app) => {

    // defining route group prefix
    app.prefix("/api/v1/users", (router) => {
        router.route('/').get(securityController.adminAuthorize, usersController.index);
        router.route('/').post(securityController.adminAuthorize, usersController.store);
        router.route('/:id').delete(securityController.adminAuthorize, usersController.destroy);

        // update password can be done by any moderator
        // but they can't update other's password
        // only admin can update other's password
        router.route('/:id').put(securityController.jwtAuth, usersController.update);
    });
};