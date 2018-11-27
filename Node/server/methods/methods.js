const MODELS = require('./../models/index');

module.exports.updateFromCustomer = function (customer) {
    let pUser
    let creation = false
    
    // NO Customer Id
    if (customer.user_id == undefined && customer.user_id == null) {
        customer.password = 'password';
        let role = !customer.role ? 'user' : customer.role
        let userObject = {
            username:        customer.username,
            email:           customer.email,
            password:        customer.password,
            password_repeat: customer.password,
            role:            role
        }
        pUser = MODELS.user.create(userObject)
        creation = true
    } else {
        pUser = MODELS.user.find({
            where: {
                id: customer.user_id
            }
        })
        creation = false
    }
    
    return pUser.then(
        user => {
            let data = {}
            if (customer.email != customer.previous('email')) {
                data.email = customer.email
            }
            if (customer.password != customer.previous('password')) {
                data.password = customer.password
            }
            return user.update(data, {fields: Object.keys(data)})
        }
    )
}
module.exports.triggerCustomerAfter = function(customer) {
    return this.updateFromCustomer(customer).then(
        user => {
            let Prom
            if (!customer.user_id){
                customer.user_id = user.id

                let data = {user_id: user.id}
                Prom = customer.update(data, {fields: Object.keys(data)}).then(
                    customerUpdated => {
                        return customerUpdated
                    },
                    error => {
                        return new Promise(function(resolve, reject) {
                            reject(error);
                        });
                    }
                )
            }
            else {
                Prom = new Promise(function(resolve) {
                    resolve(customer);
                });
            }
            return Prom
        }
    );
}
/**
 * Check if update Customer's semail
 * @param model user(with Customer)
 * @return user
 */
module.exports.updateUsersCustomer = function(user) {
    if (user.role != 'user') {
        return new Promise((resolve) => {
            resolve(user)
        })
    }
    else {
        return MODELS.customer.findOne({
            where: {
                user_id: user.id
            }
        }).then(
            customer => {
                if (!customer) {
                    return user
                }
                else {
                    let email = { email: user.email }
                    return customer.update(email).then(
                        updatedCustomer => {
                            return user.Customer = updatedCustomer
                        }
                    )
                }
            }
        )
    }
}