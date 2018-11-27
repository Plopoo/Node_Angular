// Lib
const UserManager = require('../manager/user-manager');
const UserOutput = require('../outputs/user-output');
const SuccessOutput = require('../outputs/success-output');

module.exports = function(server) {
    /**
     * List all users 
     */
    server.get('/users', ACL.acl('admin'), function(req, res, next) {
        let usersOutput = [];
        UserManager.getUsers().then(
            users => {
                if (true === Array.isArray(users)) {
                    users.forEach(function(user) {
                        usersOutput.push(new UserOutput(user));
                    });
                } else {
                    usersOutput = [];
                }
                res.json(usersOutput);
            },
            error => {
                next(error);
            }
        );
    });
    /**
     * List all users by role
     */
    server.get('/users/role/:role', ACL.acl('admin'), function(req, res, next) {
        let usersOutput = [];
        UserManager.getUsersByRole(req.params.role).then(
            users => {
                if (true === Array.isArray(users)) {
                    users.forEach(function(user) {
                        usersOutput.push(new UserOutput(user));
                    });
                } else {
                    usersOutput = [];
                }
                res.json(usersOutput);
            },
            error => {
                next(error);
            }
        );
    });
    /**
     * Create user
     */
    server.post('/users', ACL.acl('admin'), function(req, res, next) {
        UserManager.createUser(req.body).then(
            result => {
                if (result.success == true) {
                    res.json(new UserOutput(result.user));
                } else {
                    next(new Errors.ErrorBadRequest(null, result.errors));
                }
            },
            error => {
                next(error);
            }
        );
    });
    /**
     * Get user with "Role" (user by default)
     */
    server.get('/users/role/:role/:user_id', ACL.acl('accountant'), function(req, res, next) {
        UserManager.getUserByRole(req.params.role, req.params.user_id).then(
            user => {
                if (null !== user) {
                    res.json(new UserOutput(user));
                } else {
                    next(new Errors.ErrorNotFound());
                }
            },
            error => {
                next(error);
            }
        );
    });
    /**
     * Update user
     */
    server.put('/users/:user_id', ACL.acl('user', 'user', 'user_id'), function(req, res, next) {
        UserManager.updateUser(req.params.user_id, req.body).then(
            result => {
                if (result.success == true) {
                    res.json(new UserOutput(result.user));
                } else {
                    next(new Errors.ErrorBadRequest(null, result.errors));
                }
            },
            error => {
                next(error);
            }
        );
    });
    /**
     * Delete user
     */
    server.del('/users/:user_id', ACL.acl('admin'), /*server.oauth.checkRole('admin'),*/ function(req, res, next) {
        UserManager.deleteUser(req.params.user_id).then(
            result => {
                res.json(new SuccessOutput(true, {
                    number_of_deleted: result.number_of_deleted
                }));
            },
            error => {
                next(error);
            }
        );
    }); 
    /**
     * Register user
     */
    server.post('/register', function(req, res, next) {
        UserManager.registerUser(req.body).then(
            result => {
                if (result.success == true) {
                    res.json(new UserOutput(result.user));
                } else {
                    next(new Errors.ErrorBadRequest(null, result.errors));
                }
            },
            error => {
                next(error);
            }
        );
    });
    /**
     * Login user
     */
    server.post('/login', function(req, res, next) {
        UserManager.loginUser(req.body).then(
            result => {
                res.json(result);
            },
            error => {
                next(error);
            }
        );
    });
    /**
     * Reset password
     */
    server.post('/password-reset', function(req, res, next) {
        UserManager.passwordReset(req.body).then(
            result => {
                res.json(result);
            },
            error => {
                next(error);
            }
        );
    });
    /**
     * Get me
     */
    server.get('/me', server.oauth.authenticate(), function(req, res, next) {
        // User connected
        let userConnectedID = global.getUserConnectedId(res);
        if (!userConnectedID) {
            return next();
        }

        UserManager.getUser(userConnectedID
            ).then(
            user => {
                if (null !== user) {
                    res.json(new UserOutput(user));
                } else {
                    next(new Errors.ErrorNotFound());
                }
            },
            error => {
                next(error);
            }
        );
    });
    /**
     * Update me
     */
    server.put('/me', server.oauth.authenticate(), function(req, res, next) {
        // User connected
        let userConnectedID = getUserConnectedId(res);
        if (!userConnectedID) {
            return next();
        }

        UserManager.updateUser(userConnectedID, req.body).then(
            result => {
                if (result.success == true) {
                    res.json(new SuccessOutput(true, {
                        id: result.user.id
                    }));
                } else {
                    next(new Errors.ErrorBadRequest(null, result.errors));
                }
            },
            error => {
                next(error);
            }
        );
    });
    /**
     * Get me for CLIENT interface
     */
    server.get('/me/client', server.oauth.authenticate(), function(req, res, next) {
        // User connected
        let userConnectedID = getUserConnectedId(res);
        if (!userConnectedID) {
            return next();
        }

        UserManager.getUser(userConnectedID, 'user').then(
            user => {
                if (null !== user) {
                    res.json(new UserOutput(user));
                } else {
                    next(new Errors.ErrorNotFound());
                }
            },
            error => {
                next(error);
            }
        );
    });
};
