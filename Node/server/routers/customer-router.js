// Lib
const CustomerManager = require('../manager/customer-manager');
const CustomerOutput = require('../outputs/customer-output');
const SuccessOutput = require('../outputs/success-output');

module.exports = function(server) {
    /**
     * List all customers 
     */
    server.get('/customers', ACL.acl('admin'), function(req, res, next) {
        let customerOutput = [];
        CustomerManager.getCustomers().then(
            customers => {
                if (true === Array.isArray(customers)) {
                    customers.forEach(function(customer) {
                        customerOutput.push(new CustomerOutput(customer));
                    });
                } else {
                    customerOutput = [];
                }
                res.json(customerOutput);
            },
            error => {
                next(error);
            }
        );
    });
    /**
     * Get a customer by ID
     */
    server.get('/customers/:customer_id', ACL.acl('user', 'customer', 'customer_id'), function(req, res, next) {
        CustomerManager.getCustomer(req.params.customer_id).then(
            customer => {
                if (null !== customer) {
                    res.json(new CustomerOutput(customer));
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
     * Create customer
     */
    server.post('/customers', ACL.acl('admin'), function(req, res, next) {
        CustomerManager.createCustomer(req.body).then(
            result => {
                if (result.success == true) {
                    res.json(new CustomerOutput(result.customer));
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
     * Update customer
     */
    server.put('/customers/:customer_id', ACL.acl('user', 'customer', 'customer_id'), function(req, res, next) {
        CustomerManager.updateCustomer(req.params.customer_id, req.body).then(
            result => {
                if (result.success == true) {
                    res.json(new CustomerOutput(result.customer));
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
     * Delete customer
     */
    server.del('/customers/:customer_id', ACL.acl('admin'), function(req, res, next) {
        CustomerManager.deleteCustomer(req.params.customer_id).then(
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
};