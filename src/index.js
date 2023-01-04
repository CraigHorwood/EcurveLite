const ecurve = require("./ecurve");
const crypt = require("./crypt");

const ecl = {};

Object.keys(ecurve).forEach(key => {
	ecl[key] = ecurve[key];
});

Object.keys(crypt).forEach(key => {
	ecl[key] = crypt[key];
});

module.exports = ecl;