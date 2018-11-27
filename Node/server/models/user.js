'use strict';

module.exports = (sequelize, DataTypes) => {
	// Roles
	let ROLES = {
		USER: 'user',
		ADMIN: 'admin'
	};

	// Definition
	let user = sequelize.define('user', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true
		},
		email: {
			validate: {
				isEmail: true
			},
			allowNull: false,
			type: DataTypes.STRING
		},
		role: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: ROLES.USER
		}
	}, {
			underscored: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			scopes: {
				'user': {
					where: {
						role: ROLES.USER
					}
				},
				'admin': {
					where: {
						role: ROLES.ADMIN
					}
				},
			},
			indexes: [{
				unique: true,
				fields: ['email']
			}],
		});
	user.associate = function (models) {
		// AccessToken
		user.hasMany(models.oauth_token, {
			as: 'AccessTokens',
			onDelete: 'cascade',
			hooks: true
		});

		// Customer
		user.hasOne(models.customer, {
			as: 'Customer',
			foreignKey: 'user_id'
		});
	};

	// AllowedFields for Notifications
	user.prototype.allowedFields = ['username', 'email']

	// Methods
	user.prototype.hasRole = function (role) {
		return this.role === role;
	};
	user.prototype.getFieldsAllowedToUpdate = function () {
		let fields = [];
		let excludes = ['id', 'updated_at', 'created_at'];
		Object.keys(this.rawAttributes).forEach(function (k) {
			if (!excludes.includes(k)) {
				fields.push(k);
			}
		});
		return fields;
	};
	user.prototype.getOwner = function (id) {
		// Get user
		return user.findOne({
			where: {
				id: id
			},
			include: ['Customer']
		}).then(
			user => {
				return user.Customer
			}
		)
	};

	return user;
};
