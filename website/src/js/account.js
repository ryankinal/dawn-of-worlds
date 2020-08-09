import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

export class Account {
	constructor() {
		this.amazonUser = null;
	}

	formatData(data) {
		return Object.keys(data).map(function(key) {
			return new CognitoUserAttribute({
				Name: key,
				Value: data[key]
			});
		});
	}

	signUp(email, password) {
		let self = this;
		let data = {
			email: email
		};
		let attributes = this.formatData(data);
		
		return new Promise(function(resolve, reject) {
			let userPool = new CognitoUserPool(window.config.cognito);

			userPool.signUp(email, password, attributes, null, function(err, result) {
				if (err) {
					reject(err);
					return;
				}

				self.amazonUser = result.user;
				resolve(result);
			});
		});
	}

	confirm(code, user) {
		if (typeof user === 'undefined') {
			user = this.amazonUser;
		}

		if (user && code) {
			return new Promise(function(resolve, reject) {
				user.confirmRegistration(code, false, function(err, result) {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});
			});
		} else {
			return Promise.reject();
		}
	}

	signIn(email, password) {
		let self = this;

		if (email && password) {
			let userPool = new CognitoUserPool(window.config.cognito);
			let user = new CognitoUser({
				Username: email,
				Pool: userPool
			});
			let authDetails = new AuthenticationDetails({
				Username: email,
				Password: password
			});

			return new Promise(function(resolve, reject) {
				user.authenticateUser(authDetails, {
					onSuccess: resolve,
					onFailure: reject
				});
			});
		} else {
			return Promise.resolve(userPool);	
		}
	}
}