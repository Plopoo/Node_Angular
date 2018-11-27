const MODELS = require('./../models/index');
const Methods = require('../methods/methods');

// Hook After Update
MODELS.customer.afterUpdate((customer, options)=> {
    return Methods.triggerCustomerAfter(customer)
});
// Hook After Create
MODELS.customer.afterCreate((customer, options) => {
    return Methods.triggerCustomerAfter(customer)
});
/*
 * Get all customers
 */
module.exports.getCustomers = function() {
    return MODELS.customer.findAll({
        include: ['User']
    }).then(
        customers => {
            let _return = [];
            if (customers) {
                _return = customers;
            }
            return _return;
        },
        error => {
            return error;
        }
    );
};
/**
 * Get a customer by ID
 */
module.exports.getCustomer = function(id) {
    return MODELS.customer.findOne({
        where: {
            id: id,
        },
        include: ['User'],
    }).then(
        customer => {
            if (customer) {
                return customer;
            } else {
                return new Promise(function(resolve, reject) {
                    reject(new Errors.ErrorNotFound('error.not_found.customer'));
                });
            }
        },
        error => {
            return new Promise(function(resolve, reject) {
                reject(error);
            });
        }
    );
};
/*
 * Update customer
 */
module.exports.updateCustomer = function(id, data = {}) {
    return MODELS.customer.find({
        where: {
            id: id
        },
    }).then(
        customer => {
            if (customer) {
                previousData = global.getFieldsValues(customer)
                let errors = [];
                let fields = customer.getFieldsAllowedToUpdate();
                
                if (errors.length > 0) {
                    return new Promise(function(resolve) {
                        resolve({
                            success: false,
                            errors: errors
                        });
                    });
                } 
                return customer.update(data, {
                    'fields': fields
                }).then(
                    error => {
                        return new Promise(function(resolve, reject) {
                            if (error.name == "SequelizeForeignKeyConstraintError") {
                                reject(new Errors.ErrorNotFound('error.not_found.sie'));
                            }
                            reject(error);
                        });
                    }
                );
            } else {
                return new Promise(function(resolve, reject) {
                    reject(new Errors.ErrorNotFound('error.not_found.customer'));
                });
            }
        },
        error => {
            return new Promise(function(resolve, reject) {
                reject(error);
            });
        }
    );
};
/*
 * Delete customer
 */
module.exports.deleteCustomer = function(id) {
    debug('deleteCustomer');
    return MODELS.customer.destroy({
        where: {
            id: id
        }
    }).then(
        numberOfDeleted => {
            return new Promise(function(resolve) {
                resolve({
                    success: true,
                    number_of_deleted: numberOfDeleted,
                });
            });
        },
        error => {
            return new Promise(function(resolve, reject) {
                reject(error);
            });
        }
    );
};
/*
 * Create customer
 */
module.exports.createCustomer = function(data) {
    debug('createCustomer');
    return MODELS.customer.find({
        where: {
            $or: [{
                email: {
                    $eq: data.email
                }
            }]
        }
    }).then(
        customer => {
            let errors = [];
            if (customer) {
                if (data.email == null) {
                    errors.push({
                        type: 'body',
                        field: 'email',
                        value: data.email,
                        message: 'validation.body.required.email'
                    });
                }
                if (data.username == null) {
                    errors.push({
                        type: 'body',
                        field: 'username',
                        value: data.username,
                        message: 'validation.body.required.username'
                    });
                }
                if (customer.email == data.email) {
                    errors.push({
                        type: 'body',
                        field: 'email',
                        value: data.email,
                        message: 'validation.body.unique.email'
                    });
                }
            }
            if (errors.length > 0) {
                return new Promise(function(resolve) {
                    resolve({
                        success: false,
                        errors: errors
                    });
                });
            } else {
                let errors = []
                    if (errors.length > 0) {
                        return new Promise(function(resolve) {
                            resolve({
                                success: false,
                                errors: errors
                            });
                        });
                    }
                }
                return MODELS.customer.create(data).then(
                    createdCustomer => {
                        return new Promise(function(resolve) {
                            resolve({
                                success: true,
                                customer: createdCustomer,
                            });
                        });
                    },
                    error => {
                        return new Promise(function(resolve, reject) {
                            reject(error);
                        });
                    }
                );
            },
        error => {
            return new Promise(function(resolve, reject) {
                reject(error);
            });
        }
    );
};