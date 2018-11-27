require('app-module-path').addPath(__dirname + '/..');
const MODELS = require('models/index');

module.exports = {
    up: (queryInterface, Sequelize, done) => {
        let sequelize = queryInterface.sequelize

        let promises = []

        promises.push(new Promise(function (resolve, reject) {
            return sequelize.transaction((t) => {
                return MODELS.customer.create({
                    firstname: 'firstname',
                    lastname: 'lastname',
                    email: 'test@gmail.com'
                })
            })
        }));

        return Promise.all(promises).then(function () {
            done()
        })

    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('customers', null, {});
    }
};
