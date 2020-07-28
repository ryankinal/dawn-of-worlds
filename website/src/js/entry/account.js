import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';

let userPool = new CognitoUserPool(window.config.cognito);
let email = 'ryan.kinal@gmail.com';
let password = 'Testing1!';
let data = {
	email: email,
	nickname: 'JR'
};
let attributes = Object.keys(data).map(function(key) {
	return new CognitoUserAttribute({
		Name: key,
		Value: data[key]
	});
});

console.log(window.config.cognito);
console.log(userPool);

userPool.signUp(email, password, attributes, null, function(err, result) {
	if (err) {
		alert(err.message || JSON.stringify(err));
		return;
	}

	console.log(result.user);
});