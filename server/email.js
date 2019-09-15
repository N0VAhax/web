var fs = require('fs');
var ejs = require('ejs');
var sendgrid = require('@sendgrid/mail');
var config = require('../config/config');

exports.passwordReset = function(email, recoveryCode) {
	sendgrid.setApiKey(config.SENDGRID_KEY);

	const msg = ejs.render(
		fs.readFileSync(__dirname + '../templates/password.ejs', 'utf8'),
		{ passcode: recoveryCode },
	);

	const mail = {
	  to: email,
	  from: config.SUPPORT_EMAIL,
	  subject: 'Proof Of Crash Password Reset',
		content: [
			{
				type: 'text/html',
				value: msg,
			},
		]
	};
	sgMail.send(mail);
	return true
}

exports.contact = function(from, content) {
	sendgrid.setApiKey(config.SENDGRID_KEY);

	var details = {
        to: config.CONTACT_EMAIL,
        from: 'contact@moneypot.com',
        replyTo: from,
        subject: 'Contact (' + from + ')',
        html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
            '<html xmlns="http://www.w3.org/1999/xhtml">' +
            '<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
            '<title>Contact</title>' +
            '</head>' +
            '<body>'+
            '<table width="100%" cellpadding="0" cellspacing="0" bgcolor="e4e4e4"><tr><td> <table id="top-message" cellpadding="20" cellspacing="0" width="600" align="center"> <tr> <td></td> </tr> </table> <table id="main" width="600" align="center" cellpadding="0" cellspacing="15" bgcolor="ffffff"> <tr> <td> <table id="content-1" cellpadding="0" cellspacing="0" align="center"> <tr> <td width="570" valign="top"> <table cellpadding="5" cellspacing="0"> <div style="background-color:#000;"> <div style="text-align:center;margin-left: 230"> </div> </div> </td> </tr> </table> </td> </tr> <tr> <td> <table id="content-6" cellpadding="0" cellspacing="0"> <p> ' + content +' </p> </table> </td> </tr> </table> </td></tr></table>'+
            '</body></html>'
  };
	sgMail.send(details);
	return true
}

// const email = data => {
// 	if (!data.type || !data.email) {
// 		return new Promise(reject => {
// 			const err = 'Missing data.type OR data.email!';
// 			logger.error(err);
// 			reject(err);
// 		});
// 	}
//
// 	return new Promise((resolve, reject) => {
// 		if (config.env === 'test' || config.env === 'local') {
// 			return resolve();
// 		}
//
// 		sendgrid.setApiKey(config.email.sendgrid.secret);
// 		const type = data.type.toLowerCase();
//
// 		if (data.type === 'welcome') {
// 			const msg = ejs.render(
// 				fs.readFileSync(__dirname + '/templates/welcome.ejs', 'utf8'),
// 			);
//
// 			const obj = {
// 				to: data.email,
// 				from: {
// 					name: config.email.sender.default.name,
// 					email: config.email.sender.default.email,
// 				},
// 				subject: 'Welcome to Winds!',
// 				content: [
// 					{
// 						type: 'text/html',
// 						value: msg,
// 					},
// 				],
// 			};
//
// 			sendgrid
// 				.send(obj)
// 				.then(res => {
// 					resolve(res);
// 				})
// 				.catch(err => {
// 					logger.error(err);
// 					reject(err);
// 				});
// 		}
//
// 		if (data.type === 'password') {
// 			if (!data.passcode) {
// 				return new Promise(reject => {
// 					const err = 'Missing data.passcode!';
// 					logger.error(err);
// 					reject(err);
// 				});
// 			}
//
// 			const msg = ejs.render(
// 				fs.readFileSync(__dirname + '/templates/password.ejs', 'utf8'),
// 				{ passcode: data.passcode },
// 			);
//
// 			const obj = {
// 				to: data.email,
// 				from: {
// 					name: config.email.sender.support.name,
// 					email: config.email.sender.support.email,
// 				},
// 				subject: 'Forgot Password',
// 				content: [
// 					{
// 						type: 'text/html',
// 						value: msg,
// 					},
// 				],
// 			};
//
// 			sendgrid
// 				.send(obj)
// 				.then(res => {
// 					resolve(res);
// 				})
// 				.catch(err => {
// 					logger.error(err);
// 					reject(err);
// 				});
// 		}
// 	});
// };
//
// export default email;
