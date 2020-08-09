import { Account } from '../account.js';

var account = new Account(),
	accountPanel = document.querySelector('.account-panel'),
	signupEmailInput = document.getElementById('signupEmail'),
	signupPasswordInput = document.getElementById('signupPassword'),
	signupConfirmPasswordInput = document.getElementById('signupConfirmPassword'),

	confirmCodeInput = document.getElementById('confirmCode'),
	confirmButton = document.getElementById('confirmButton'),

	signinEmailInput = document.getElementById('signinEmail'),
	signinPasswordInput = document.getElementById('signinPassword'),
	signinButton = document.getElementById('signinButton');

function clearInputError(e) {
	if (e && e.target && e.target.classList) {
		e.target.classList.remove('error');
	}
}

signupEmailInput.addEventListener('change', clearInputError);
signupPasswordInput.addEventListener('change', clearInputError);
signupConfirmPasswordInput.addEventListener('change', clearInputError);
confirmCodeInput.addEventListener('change', clearInputError);
signinEmailInput.addEventListener('change', clearInputError);
signinPasswordInput.addEventListener('change', clearInputError);

document.getElementById('signupButton').addEventListener('click', function() {
	var email = signupEmailInput.value,
		password = signupPasswordInput.value,
		confirm = signupConfirmPasswordInput.value;

	if (email !== '' && password !== '' && password === confirm) {
		account.signUp(email, password).then(function(data) {
			accountPanel.classList.add('step-two');
		}).catch(function(err) {
			// Do something?
		});
	} else {
		if (email === '') {
			signupEmailInput.classList.add('error');
		}

		if (password === '') {
			signupPasswordInput.classList.add('error');
		}

		if (password !== confirm) {
			signupConfirmPasswordInput.classList.add('error');
		}
	}
});

confirmButton.addEventListener('click', function() {
	var code = confirmCodeInput.value;

	if (code) {
		account.confirm(code).then(function(result) {
			accountPanel.querySelector('.signup-form').classList.add('hide');
			accountPanel.classList.remove('step-two');
		}).catch(function(err) {
			// Probably an error or something
		});
	} else {
		confirmCodeInput.classList.add('error');
	}
});

signinButton.addEventListener('click', function() {
	var email = signinEmailInput.value,
		password = signinPasswordInput.value;

	if (email && password) {
		account.signIn(email, password).then(function(result) {
			console.log(result);
		}).catch(function(err) {
			console.log(err);
		});
	} else {
		if (!email) {
			signinEmailInput.classList.add('error');
		}

		if (!password) {
			signinPasswordInput.classList.add('error');
		}
	}
});