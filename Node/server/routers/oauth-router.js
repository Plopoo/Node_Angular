const OAuthServer = require('restify-oauth-server');
const OAuthManager = require('./../manager/oauth-manager');
const UserManager = require('./../manager/user-manager');

module.exports = function(server) {

    server.oauth = new OAuthServer({
        debug: true,
        model: OAuthManager // See https://github.com/thomseddon/node-oauth2-server for specification
    });

    server.oauth.checkRole = function(role) {
        return function(req, res, next) {
            if (undefined !== res.oauth) {
                if (undefined !== res.oauth.token) {
                    if (undefined !== res.oauth.token.user) {
                        UserManager.getUser(res.oauth.token.user.id, false).then(
                            user => {
                                if (user) {
                                    if (false === user.hasRole(role)) {
                                        next(new Errors.ErrorForbidden('error.forbidden.user'));
                                    } else {
                                        next();
                                    }
                                } else {
                                    next(new Errors.ErrorNotFound('error.not_found.user'));
                                }
                            },
                            error => {
                                next(error);
                            }
                        );
                    } else {
                        next();
                    }
                } else {
                    next();
                }
            } else {
                next();
            }
        };
    };

    server.post('/oauth2/token', server.oauth.token());
    server.post('/oauth2/refresh-token', server.oauth.token());
};
