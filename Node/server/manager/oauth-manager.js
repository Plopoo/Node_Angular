const MODELS = require('models/index');
const bcrypt = require('bcrypt-nodejs');

// SPECS: https://oauth2-server.readthedocs.io/en/latest/model/spec.html

let serializeToken = function(_token) {
    return {
        accessToken: _token.access_token,
        accessTokenExpiresAt: _token.access_token_expire_date,
        refreshToken: _token.refresh_token,
        refreshTokenExpiresAt: _token.refresh_token_expire_date,
        client: {id:_token.client_id},
        user: {id:_token.user_id}
    }
};

/**
 * Get client.
 */
module.exports.getClient = function*(clientId, clientSecret) {
    return MODELS.oauth_client.findOne({
        where: {
            client_id: clientId,
            client_secret: clientSecret
        }
    }).then(oAuthClient => {
        let _return = null;
        if (oAuthClient) {
            _return = {
                id: oAuthClient.id,
                clientId: oAuthClient.client_id,
                clientSecret: oAuthClient.client_secret,
                grants: ['password', 'refresh_token'] // the list of OAuth2 grant types that should be allowed
            };
        }
        return _return;
    })
};
/*
 * Get user.
 */
module.exports.getUser = function*(username, password) {
    return MODELS.user.findOne({
        where: {
            username: username
        }
    }).then(user => {
        let _return = null;
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                _return = user;
            }
        }
        return _return;
    });
};
/*
 * Get access token.
 */
module.exports.getAccessToken = function(bearerToken) {
    return MODELS.oauth_token.findOne({
        where: {
            access_token: bearerToken
        }
    }).then(token => {
        let _return = null;
        if (token) {
            _return = MODELS.user.findOne({
                where: {
                    id: token.user_id
                },
                include: ['Customer']
            }).then(
                user => {
                    return {
                        accessToken: token.access_token,
                        client: {
                            id: token.client_id
                        },
                        expires: token.access_token_expire_date,
                        user: {
                            id: token.user_id,
                            instance: user
                        }
                    };
                }
            )
        }
        return _return;
    });
};
/**
 * Get refresh token.
 */
module.exports.getRefreshToken = function(bearerToken) {
    return MODELS.oauth_token.findOne({
        where: {
            refresh_token: bearerToken
        }
    }).then(token => {
        let _return = null;
        if (token) {
            _return = serializeToken(token);
        }
        return _return;
    })
};
/**
 * Revoke token.
 */
module.exports.revokeToken = function(oauth_token) {
    //return the affectedRows, oauth2 needs a status, so we're good
    return MODELS.oauth_token.destroy({
        where:{
            refresh_token: oauth_token.refreshToken
        }
    });
}
/**
 * Save token.
 */
module.exports.saveToken = function*(token, client, user) {
    return MODELS.oauth_token.create({
        access_token: token.accessToken,
        access_token_expire_date: token.accessTokenExpiresAt,
        refresh_token: token.refreshToken,
        refresh_token_expire_date: token.refreshTokenExpiresAt,
        client_id: client.id,
        user_id: user.id
    }).then(_token => {
        return serializeToken(_token)
    });
};
