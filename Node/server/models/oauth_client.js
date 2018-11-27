'use strict';
module.exports = (sequelize, DataTypes) => {
    var oauth_client = sequelize.define('oauth_client', {
        client_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        client_secret: {
            type:DataTypes.STRING,
            allowNull: false
        },
        redirect_uri: DataTypes.STRING
    }, {});
    oauth_client.associate = function(models) {
        // associations can be defined here
    };
    return oauth_client;
};
