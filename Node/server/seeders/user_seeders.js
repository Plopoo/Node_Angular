'use strict';
require('app-module-path').addPath(__dirname + '/..');
const MODELS = require('models/index');
const bcrypt = require('bcrypt-nodejs')
const CRYPT_CONFIG = require('../config/crypt');

module.exports = {
    up: (queryInterface, Sequelize, done) => {
        let sequelize = queryInterface.sequelize

        let promises = []

        promises.push(new Promise(function(resolve, reject){
            return MODELS.sequelize.transaction((t)=>{
                return MODELS.oauth_client.create({
                    client_id: 'client_1',
                    client_secret: 'client_secret'
                }, {transaction:t }).then((client) => {
                    return MODELS.user.create({
                        username: 'User',
                        password: bcrypt.hashSync('password', CRYPT_CONFIG.salt),
                        email: 'john@gmail.com',
                        role: 'user'
                    }, {
                        transaction:t 
                    }).then((user)=>{
                        return MODELS.oauth_token.create({
                            access_token: 'client_token',
                            access_token_expire_date: new Date(),
                            refresh_token: 'rclient_token',
                            refresh_token_expire_date: new Date(),
                            user_id: user.get('id'),
                            client_id: client.get('id')
                        }, {
                            transaction:t 
                        });
                    });
                });
            }).then(token=>{
                token.getUser().then(user=>{
                    user.getAccessTokens().then(at=>console.log(at));
                    resolve(user);
                })
            });
        }));
        promises.push(new Promise(function(resolve, reject){
            return MODELS.sequelize.transaction((t) => {
                return MODELS.oauth_client.create({
                    client_id: 'client_2',
                    client_secret: 'client_secret'
                }, {
                    transaction: t
                }).then((client) => {
                    return MODELS.user.create({
                        username: 'Admin',
                        password: bcrypt.hashSync('password', CRYPT_CONFIG.salt),
                        email: 'admin@gmail.com',
                        role: 'admin'
                    }, {
                        transaction: t
                    }).then((user) => {
                        return MODELS.oauth_token.create({
                            access_token: 'admin_token',
                            access_token_expire_date: new Date(),
                            refresh_token: 'radmin_token',
                            refresh_token_expire_date: new Date(),
                            user_id: user.get('id'),
                            client_id: client.get('id')
                        }, {
                            transaction: t
                        });
                    });
                });
            }).then(token=>{
                token.getUser().then(user=>{
                    user.getAccessTokens().then(at=>console.log(at));
                    resolve(user);
                })
            });
        }));

        return Promise.all(promises).then(function () {
            done()
        })

    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', null, {});
    }
};
