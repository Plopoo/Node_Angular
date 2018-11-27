'use strict';
const MODELS = require('./../models/index');

class ACL {
	/**
     * Construct
     */
    constructor(language = null, server) {
		this.server = server
		this.language = language
	}
	//////////////////////////////////////////////////////////////////////
	///////////////////////////////////// METHOD(S) //////////////////////
	//////////////////////////////////////////////////////////////////////
	/**
	 * ACL Middleware chaining
	 * @param string roleMini
	 * @param string modelName
	 * @param string paramName
	 */
	acl(roleMini, modelName = null, paramName = null) {
		if (!modelName) {
			return [
				this.server.oauth.authenticate(),
				this.checkRole(roleMini)
			]
		}
		else {
			return [
				this.server.oauth.authenticate(),
				this.checkRole(roleMini),
				this.checkAccess(modelName, paramName)
			]
		}
	}

	///////////////////////////////////////////////////////////////////////
	///////////////////////////////////// PRIVATE METHODS /////////////////
	///////////////////////////////////////////////////////////////////////
	/**
	 * Check if role
	 * @param string routeMinRole
	 */
	checkRole(routeMinRole) {
		return function (req, res, next) {
			let user = getUserConnected(res)
			if (user) {
				let classification = {
					roleUndefined: 	['roleUndefined'],
					user: 			['admin', 'user'],
					admin: 			['admin']
				}
	
				if (classification[routeMinRole].includes(user.role)) {
					next()
				}
				else {
					next(new Errors.ErrorInvalidCredentials('error.forbidden.user'))
				}
			}
		}
	}	
	/**
	 * Find ressource by ID
	 * @param MODEL model 
	 * @param number id 
	 * @return Promise
	 */
	findRessourceById (model, id) {
		return model.findOne({
			where: {
				id: id,
			}
		})
	}
	/**
	 * Compare if ressource belongsTo currentUser
	 * @param User currentUser 
	 * @param Customer ressourceOwner
	 * @return Boolean 
	 */
	compareClient (currentUser, ressourceOwner) {
		return currentUser.Customer.id == ressourceOwner.id
	}
	/**
	 * Check if currentUser has permission to get the ressource
	 * @param string modelName
	 * @param string paramName
	 */
	checkAccess (modelName, paramName) {
		let that = this
		return function (req, res, next) {
			let VALID = null
			let useModel = (MODELS[modelName]) ? MODELS[modelName] : null;

			if (useModel) {
				// Get current User
				let currentUser = getUserConnected(res)
				if (currentUser) {
					if (!paramName) {
						// No parameter set in request
						next()
					} else {
						if (currentUser.role == 'admin') {
							next()
						} else {
							// Get ressource
							let ressource = that.findRessourceById(useModel, req.params[paramName]).then(
								ressource => {
									if (ressource != null) {
										useModel.prototype.getOwner(ressource.id).then(
											ressourceOwner => {
												if (ressourceOwner != null) {
													// If currentUser is user
													if (currentUser.role == 'user') {
														VALID = that.compareClient(currentUser, ressourceOwner)
													}
													// VALIDATION
													if (VALID) {
														next()
													} else {
														next(new Errors.ErrorInvalidCredentials('error.forbidden.user'))
													}
												} else {
													// No RessourceOwner found
													next(new Errors.ErrorNotFound())
												}
											}
										)
									}
									else {
										// No Ressource found
										next(new Errors.ErrorNotFound());
									}
								}
							)
						}
					}
				}
			}
		}
	}
}

module.exports = ACL