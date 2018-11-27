const cors = require('cors');

/**
 * Init routers
 * @param server
 * @return Object
 */
module.exports = function(server) {
    // Init
    let ROUTERS = { 
        OAuthRouter: require('routers/oauth-router'),
        UserRouter: require('routers/user-router'),
        CustomerRouter: require('routers/customer-router'),
    };

    server.pre(cors({exposedHeaders: ['Content-Range', 'Content-Disposition']}));
    server.pre(function(req, res, next) {
        if (req.method == 'POST') {
            res.status(201)
        }
        next()
    })

    // Launch
    ROUTERS.OAuthRouter(server);
    ROUTERS.UserRouter(server);
    ROUTERS.CustomerRouter(server);
    
    // Return all routers
    return ROUTERS;
};