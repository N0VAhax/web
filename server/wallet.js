var jwt = require('jsonwebtoken');
var request = require('request-promise');
var config = require('../config/config');
var secret = config.SIGNING_SECRET;
var devMode = true;

exports.createWallet = function(user, callback) {
	if (devMode == true) {
		callback(null, '0xb0947c36bAa8b72591D7f83930C2ce4107248Dc4');
	} else {

		var token = jwt.sign({id: -1}, secret, { expiresIn: 60*60});

		const options = {
			method: "POST",
			uri: config.WALLET_API_DOMAIN + '/account',
			headers: {
				'Authorization': token
			},
			body: {
				uid: user.id,
				email: user.email
			},
			json: true
		}

		request(options)
			.then(function (newWalletAddress) {
				console.log(newWalletAddress);
				callback(null, newWalletAddress);
			})
			.catch(function (err) {
				console.log(err);
				callback(err, null);
			})
	}
}

exports.getWallet = function(user, callback) {
	if (devMode == true) {
		callback(null, '0xb0947c36bAa8b72591D7f83930C2ce4107248Dc4');
	} else {
		var token = jwt.sign({id: -1}, secret, { expiresIn: 60*60});

		const options = {
			method: "POST",
			uri: config.WALLET_API_DOMAIN + '/address',
			headers: {
				'Authorization': token
			},
			body: {
				uid: user.id,
			},
			json: true
		}

		request(options)
			.then(function (walletAddress) {
				console.log(walletAddress);
				callback(null, walletAddress);
			})
			.catch(function (err) {
				console.log(err);
				callback(err, null);
			})
	}
}

exports.updateBalanceArray = function(bonuses, callback) {
	if (devMode == true) {
		callback(null, []);
	} else {
		var token = jwt.sign({id: -1}, secret, { expiresIn: 60*60});

		const options = {
			method: "POST",
			uri: config.WALLET_API_DOMAIN + '/update',
			headers: {
				'Authorization': token
			},
			body: {
				users: bonuses.map(function (bonus) {
								return {
									id: bonus.user.id,
									pnl: bonus.amount
								}
							})
			},
			json: true
		}

		request(options)
			.then(function (updatedBalances) {
				console.log(updatedBalances);
				callback(null, updatedBalances);
			})
			.catch(function (err) {
				console.log(err);
				callback(err, null);
			})
	}
}

exports.updateBalance = function(userId, updateAmount, callback) {
	console.log(userId, updateAmount);
	if (devMode == true) {
		callback(null, '0xb0947c36bAa8b72591D7f83930C2ce4107248Dc4');
	} else {
		var token = jwt.sign({id: -1}, secret, { expiresIn: 60*60});

		const options = {
			method: "POST",
			uri: config.WALLET_API_DOMAIN + '/update',
			headers: {
				'Authorization': token
			},
			body: {
				users: [
					{
						id: userId,
						pnl: updateAmount
					}
				]
			},
			json: true
		}

		request(options)
			.then(function (updatedBalances) {
				console.log(updatedBalances);
				callback(null, updatedBalances);
			})
			.catch(function (err) {
				console.log(err);
				callback(err, null);
			})
	}
}

exports.getBankroll = function(callback) {
	if (devMode == true) {
		callback(null, 1000000000000);
	} else {
		var token = jwt.sign({id: -1}, secret, { expiresIn: 60*60});

		const options = {
			method: "GET",
			uri: config.WALLET_API_DOMAIN + '/bankroll',
			headers: {
				'Authorization': token
			},
			body: {
			},
			json: true
		}

		request(options)
			.then(function (balanceHouse) {
				console.log(balanceHouse);
				callback(null, balanceHouse);
			})
			.catch(function (err) {
				console.log(err);
				callback(err, null);
			})
		}
}

exports.getHouseBalance = function(callback) {
	if (devMode == true) {
		callback(null, 1000000000000);
	} else {
		var token = jwt.sign({id: -1}, secret, { expiresIn: 60*60});

		const options = {
			method: "GET",
			uri: config.WALLET_API_DOMAIN + '/house',
			headers: {
				'Authorization': token
			},
			body: {
			},
			json: true
		}

		request(options)
			.then(function (balanceHouse) {
				console.log(balanceHouse);
				callback(null, balanceHouse);
			})
			.catch(function (err) {
				console.log(err);
				callback(err, null);
			})
	}
}

exports.withdraw = function(userId, amount, withdrawal_address, callback) {
	if (devMode == true) {
		callback(null, 'FakeTxHash');
	} else {
		var token = jwt.sign({id: -1}, secret, { expiresIn: 60*60});

		const options = {
			method: "POST",
			uri: config.WALLET_API_DOMAIN + '/withdraw',
			headers: {
				'Authorization': token
			},
			body: {
				uid: userId,
				amount: amount,
				withdrawal_address: withdrawal_address
			},
			json: true
		}

		request(options)
			.then(function (hash) {
				console.log(hash);
				callback(null, hash);
			})
			.catch(function (err) {
				console.log(err);
				callback(err);
			})
	}
}
