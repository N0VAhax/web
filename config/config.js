// SET ENVIRONMENT VARIABLES IN PRODUCTION

var fs = require('fs');

module.exports = {
  "DATABASE_URL": process.env.DATABASE_URL || "postgres://bustabit:bustabit@localhost:5432/pocgamedb_test",
  "EXCHANGE_ADDRESS": process.env.EXCHANGE_ADDRESS || "",
  "JWT_SECRET": process.env.JWT_SECRET || "",
  "SENDGRID_KEY": process.env.SENDGRID_KEY || "",
  "SUPPORT_EMAIL": process.env.SUPPORT_EMAIL || "",
  "GAS_FEE": process.env.GAS_FEE || "",
  "RECAPTCHA_PRIV_KEY": process.env.RECAPTCHA_PRIV_KEY || "6LcsirgUAAAAAMf-S--MLYPz9PH5DItbDOZ787W2",
  "RECAPTCHA_SITE_KEY": process.env.RECAPTCHA_SITE_KEY || "6LcsirgUAAAAAIZDdIi6Q9-gQHK6vFRGK5Yej1KA",
  "PORT": process.env.PORT || "4000",
  "SIGNING_SECRET": process.env.SIGNING_SECRET || "testing",
  "WALLET_API_DOMAIN": "",
  "MINIMUM_WITHDRAW": process.env.MINIMUM_WITHDRAW || (0.0009 * 1e3),
  "AWS_SES_KEY": process.env.AWS_SES_KEY || "",
  "AWS_SES_SECRET": process.env.AWS_SES_SECRET || "",
  "CONTACT_EMAIL": ""
  // "SITE_URL": process.env.SITE_URL || ""
};

// var production = process.env.NODE_ENV === 'production';

// var prodConfig;
// if(production) {
//   prodConfig = JSON.parse(fs.readFileSync(__dirname + '/build-config.json'));
//   console.log('Build config loaded: ', prodConfig);
// }

// module.exports = {
//   "PRODUCTION": production,
//   "DATABASE_URL": process.env.DATABASE_URL || "mongodb://127.0.0.1/testing",
//   "BIP32_DERIVED": process.env.BIP32_DERIVED_KEY,
//   "AWS_SES_KEY": process.env.AWS_SES_KEY,
//   "AWS_SES_SECRET": process.env.AWS_SES_SECRET,
//   "CONTACT_EMAIL": process.env.CONTACT_EMAIL || "",
//   "SITE_URL": process.env.SITE_URL || "",
//   "ENC_KEY": process.env.ENC_KEY || "",
//   "SIGNING_SECRET": process.env.SIGNING_SECRET || "secret",
//   "BANKROLL_OFFSET": parseInt(process.env.BANKROLL_OFFSET) || 0,
//   "RECAPTCHA_PRIV_KEY": process.env.RECAPTCHA_PRIV_KEY || '6LeXIAoTAAAAAFGjKCoONRo8L3gD5IVG39F7d_St',
//   "RECAPTCHA_SITE_KEY": process.env.RECAPTCHA_SITE_KEY || '6LeXIAoTAAAAAA2lTK931SbFIq2Cn88HFE4XxZPR',
//   "BITCOIND_HOST": process.env.BITCOIND_HOST,
//   "BITCOIND_PORT": process.env.BITCOIND_PORT || 8332,
//   "BITCOIND_USER": process.env.BITCOIND_USER,
//   "BITCOIND_PASS": process.env.BITCOIND_PASS,
//   "BITCOIND_CERT": process.env.BITCOIND_CERT  || '',
//   "PORT":  process.env.PORT || 3841,
//   "MINING_FEE": process.env.MINING_FEE || 10000,
//   "BUILD": prodConfig
// };
