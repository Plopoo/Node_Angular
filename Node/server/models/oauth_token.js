'use strict';
module.exports = (sequelize, DataTypes) => {
    let oauth_token = sequelize.define('oauth_token', {
        access_token: {
            type:DataTypes.STRING,
            allowNull: false
        },
        access_token_expire_date: {
            type:DataTypes.DATE,
            allowNull: false
        },
        refresh_token: {
            type:DataTypes.STRING,
            allowNull: false
        },
        refresh_token_expire_date:{
            type:DataTypes.DATE,
            allowNull: false
        }
    }, {
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    oauth_token.associate = function(models) {
        oauth_token.belongsTo(models.user, {as:"User", foreignKey: "user_id"});
        oauth_token.belongsTo(models.oauth_client, {as: "Client", foreignKey: "client_id"});
    };
    return oauth_token;
};
