const chalk = require('chalk');

function error (msg) {
	console.error(chalk.red('error') + ' ' + msg);
}

function success (msg) {
	console.log(chalk.green('success') + ' ' + msg);
}

function info (msg) {
	console.log(chalk.blue('info') + ' ' + msg);
}

module.exports = {
	error,
	success,
	info
}
