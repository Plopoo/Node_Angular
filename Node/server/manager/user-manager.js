const MODELS = require('./../models/index');
const Methods = require('../methods/methods');
const bcrypt = require('bcrypt-nodejs');
const CRYPT = require('../config/crypt');

// Hook Before Create
MODELS.user.beforeCreate((user, options) => {
	if (!user.password) {
		user.password = bcrypt.hashSync('password', CRYPT.salt);
	}
});
// Hook Before Update
MODELS.user.beforeUpdate((user, options) => {
	// Check if update Customer's semail
	if (user.previous().email) {
		return Methods.updateUsersCustomer(user)
	}
	if (!user.isNewRecord) {
		if (user.password && isNaN(bcrypt.getRounds(user.password)) ) {
			user.password = bcrypt.hashSync(user.password, CRYPT.salt);
		}
	}
});

/*
 * Get a user.
 */
module.exports.getUser = function (id, scope = 'user') {
	return MODELS.user.scope(scope).findOne({
		where: {
			id: id,
		},
		include: ['Customer']
	}).then(
		user => {
			if (user) {
				return user;
			} else {
				return new Promise(function (resolve, reject) {
					reject(new Errors.ErrorNotFound('error.not_found.user'));
				});
			}
		},
		error => {
			return new Promise(function (resolve, reject) {
				reject(error);
			});
		}
	);
};
/*
 * Get All users
 */
module.exports.getUsers = function () {
	return MODELS.user.findAll({
		include: ['Customer']
	}).then(
		users => {
			let _return = [];
			if (users) {
				_return = users;
			}
			return _return;
		},
		error => {
			return error;
		}
	);
};
/*
 * Get a user by role.
 */
module.exports.getUserByRole = function (scope = 'user', id) {
	return MODELS.user.scope(scope).findOne({
		where: {
			id: id,
		}
	}).then(
		user => {
			if (user) {
				return user;
			} else {
				return new Promise(function (resolve, reject) {
					reject(new Errors.ErrorNotFound('error.not_found.user'));
				});
			}
		},
		error => {
			return new Promise(function (resolve, reject) {
				reject(error);
			});
		}
	);
};
/*
 * Get All users by role
 */
module.exports.getUsersByRole = function (scope = 'user') {
	if (['admin', 'user'].includes(scope)) {
		return MODELS.user.scope(scope).findAll({}).then(
			users => {
				let _return = [];
				if (users) {
					_return = users;
				}
				return _return;
			},
			error => {
				return error;
			}
		);
	} else {
		return new Promise(function (resolve, reject) {
			reject(new Errors.ErrorNotFound('error.not_found.role'));
		});
	}
};
/*
 * Create user
 */
module.exports.createUser = function (data) {
	debug('createUser');
	return MODELS.user.find({
		where: {
			$or: [{
				username: {
					$eq: data.firstname
				}
			}, {
				email: {
					$eq: data.email
				}
			}]
		}
	}).then(
		user => {
			let errors = [];
			if (user) {
				if (user.email == data.email) {
					errors.push({
						type: 'body',
						field: 'email',
						value: data.email,
						message: 'validation.body.unique.email'
					});
				}
				if (user.username == data.username) {
					errors.push({
						type: 'body',
						field: 'username',
						value: data.email,
						message: 'validation.body.unique.username'
					});
				}
			}
			if (["admin", "user"].indexOf(data.role) == -1) {
				errors.push({
					type: 'body',
					field: 'role',
					value: data.role,
					message: 'validation.body.bad.role'
				});
			}
			if (errors.length > 0) {
				return new Promise(function (resolve) {
					resolve({
						success: false,
						errors: errors
					});
				});
			} else {
				return MODELS.user.create(data).then(
					user => {
						if (user.role != 'user') {
							
						}
						return new Promise(function (resolve) {
							resolve({
								success: true,
								user: user,
							});
						});
					},
					error => {
						return new Promise(function (resolve, reject) {
							reject(error);
						});
					}
				);
			}
		},
		error => {
			return new Promise(function (resolve, reject) {
				reject(error);
			});
		}
	);
};
/*
 * Update user
 */
module.exports.updateUser = function (id, data = {}) {
	let previousData = null
	return MODELS.user.find({
		where: {
			id: id
		},
		include: ['Customer']
	}).then(
		user => {
			if (user) {
				previousData = global.getFieldsValues(user)
				let fields = user.getFieldsAllowedToUpdate();
				let errors = []
				let roles = ["admin", "user"]

				if (data.role != null && roles.indexOf(data.role) == -1) {
					errors.push({
						type: 'body',
						field: 'role',
						value: data.role,
						message: 'validation.body.bad.role'
					});
				}
				if (data.password != data.password_repeat) {
					errors.push({
						type: 'body',
						field: 'password_repeat',
						value: data.password_repeat,
						message: 'validation.body.repeat.password'
					});
				}
				if (errors.length > 0) {
					return new Promise(function (resolve) {
						resolve({
							success: false,
							errors: errors
						});
					});
				} else {

					return user.update(data, {
						'fields': fields
					}).then(
						error => {
							return new Promise(function (resolve, reject) {
								reject(error);
							});
						}
					);
				}

			} else {
				return new Promise(function (resolve, reject) {
					reject(new Errors.ErrorNotFound('error.not_found.user'));
				});
			}
		},
		error => {
			return new Promise(function (resolve, reject) {
				reject(error);
			});
		}
	);
};
/*
 * Delete user
 */
module.exports.deleteUser = function (id) {
	debug('deleteUser');
	return MODELS.user.destroy({
		where: {
			id: id
		}
	}).then(
		numberOfDeleted => {
			return new Promise(function (resolve) {
				resolve({
					success: true,
					number_of_deleted: numberOfDeleted,
				});
			});
		},
		error => {
			return new Promise(function (resolve, reject) {
				reject(error);
			});
		}
	);
};
/*
 * Register user NOPE
 */
module.exports.registerUser = function (data) {
	return module.exports.createUser(data).then(
		result => {
			if (true == result.success) {
				return new Promise(function (resolve) {
					resolve({
						success: true,
						user: result.user,
					});
				});
			}
			return new Promise(function (resolve) {
				resolve(result);
			});
		},
		error => {
			return new Promise(function (resolve, reject) {
				reject(error);
			});
		}
	);
};
/*
 * Login user NOPE
 */
module.exports.loginUser = function (data) {
	return MODELS.user.find({
		where: {
			$or: [{
				email: {
					$eq: data.email
				}
			}]
		}
	}).then(
		user => {
			let errors = [];
			if (user) {
				let passwordMatch = bcrypt.compareSync(data.password, user.password)
				if (!passwordMatch) {
					errors.push({
						type: 'body',
						field: 'password',
						value: data.password,
						message: 'validation.body.bad.password'
					});
				}
				if (user.email != data.email) {
					errors.push({
						type: 'body',
						field: 'email',
						value: data.email,
						message: 'validation.body.bad.email'
					});
				}
				if (errors.length > 0) {
					return new Promise(function (resolve) {
						resolve({
							success: false,
							errors: errors
						});
					});
				} else {
					debug("loggedUser");
					return new Promise(function (resolve) {
						resolve({
							success: true,
							user: user,
						});
					});
				}

			}
		}
	);
};
/*
 * Reset password
 */
module.exports.passwordReset = function (data) {
	return MODELS.user.findOne({
		where: {
			email: data.email,
		}
	}).then(
		user => {
			if (user) {
				let randomstring = Math.random().toString(36).slice(-8);

				let data = { password: randomstring }
				return user.update(data, {
					'fields': ['password']
				}).then(
					userUpdated => {
						return new Promise(function (resolve) {
							resolve(user);
						});
					},
					error => {
						return new Promise(function (resolve, reject) {
							reject(error);
						});
					}
				);
			} else {
				return new Promise(function (resolve, reject) {
					reject(new Errors.ErrorNotFound('error.not_found.user'));
				});
			}
		},
		error => {
			return new Promise(function (resolve, reject) {
				reject(error);
			});
		}
	);
};
