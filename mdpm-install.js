#!/usr/bin/env node

const path = require('path');
const chalk = require('chalk');
const program = require('commander');
const mcutil = require('./util/mcutil');
const osutil = require('./util/osutil');
const dl = require('download');
const decompress = require('decompress');

program._name = 'mdpm install';

program
.description('Install Minecraft Data Packs to a world')
.usage('\n    $ mdpm install <world> <packages...>')
.on('--help', usage)
.parse(process.argv);

var args = program.args;

// Setup a better parameters/args object
let parameters = {
	world: args[0],
	packages: args.splice(1, args.length)
}

// Check that a world was given
if (!parameters.world) {
	console.error(chalk.red('error') + ' The world name is required!');
	console.log(chalk.blue('info') + ' Use --help for help.')
	process.exit(1);
}

// Check that at least one package was given
if (!parameters.packages || parameters.packages.length === 0) {
	console.error(chalk.red('error') + ' Missing list of data packs to install!');
	console.log(chalk.blue('info') + ' Use --help for help.')
	process.exit(1);
}

console.log();

checkForWorld(fetchPackages);

/* Functions */

// Check that the world is correct and exists
function checkForWorld(callback) {
	let worldPath = mcutil.getWorld(parameters.world);
	osutil.checkDirectory(worldPath, function (success, err) {
		if (err) {
			// Other error
			console.error(chalk.red('error') + ' ' + err);
			process.exit(1);
		}
		else if (!success) {
			// World doesn't exist
			console.error(chalk.red('error') + ' World \"' + parameters.world + '\" does not exist!');
			process.exit(1);
		}
		else {
			// Success
			console.log(chalk.green('success') + ' Found World \"' + parameters.world + '\" at ' + worldPath);
			callback();
		}
	});
}

function fetchPackages() {
	let worldPath = path.join(mcutil.getWorld(parameters.world), 'data');
	parameters.packages.forEach(function (e) {
		osutil.checkValidPath(e, function (result, msg) {
			if (!result) {
				console.error(chalk.red('error') + ' Could not install ' + chalk.cyan.underline(e) + '. ' + msg);
			} else {
				if (msg === 'download') {
					dl(result, worldPath, { extract: true }).then(() => {
						console.log(chalk.green('success') + ' Installed pack ' + chalk.cyan.underline(e) + '.');
					}).catch((err) => {
						console.log(chalk.red('error') + ' ' + err.response.body);
					});
				}
				else if (msg === 'local') {
					decompress(result, worldPath).then(files => {
						console.log(chalk.green('success') + ' Installed pack ' + chalk.cyan.underline(e) + '.');
					}).catch((err) => {
						console.log(chalk.red('error') + ' ' + err.response.body);
					});
				}
			}
		});
	});
}

function usage() {
	console.log([
		'',
		'  Examples:',
		'',
		'    Install data pack from remote archive to world \"My World\"',
		'      $ mdpm install \"My World\" \"https://path/to/the/pack.zip\"',
		'',
		'    Install data pack from local directory hey.zip to world \"cool\"',
		'      $ mdpm install cool ./hey.zip',
		'',
		'    Install multiple data packs at once',
		'      $ mdpm install cool ./hey.zip \"https://path/to/the/pack.zip\" ./otherpack.zip',
		''
	].join('\n'))
}
