#!/usr/bin/env node

const path = require('path');

const chalk = require('chalk');
const program = require('commander');
const dl = require('download');
const decompress = require('decompress');

const mcutil = require('./util/mcutil');
const osutil = require('./util/osutil');
const output = require('./util/output');
const mcpack = require('./mcpack');

// Setup cli program
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
	output.error('The world name is required!');
	output.info('Use --help for help.')
	process.exit(1);
}

// Check that at least one package was given
if (!parameters.packages || parameters.packages.length === 0) {
	output.error('Missing list of data packs to install!');
	output.info('Use --help for help.')
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
			output.error(err);
			process.exit(1);
		}
		else if (!success) {
			// World doesn't exist
			output.error('World \"' + parameters.world + '\" does not exist!');
			process.exit(1);
		}
		else {
			// Success
			output.success('Found World \"' + parameters.world + '\" at ' + worldPath);
			callback();
		}
	});
}

function fetchPackages() {
	mcpack.createIfNot(parameters.world);

	let newPackages = [];

	// Loop through every package
	parameters.packages.forEach(function (e, index, array) {
		// Make sure they have a valid URL/Local path
		osutil.checkValidPath(e, function (result, msg) {
			if (!result) {
				output.error('Could not install ' + chalk.cyan.underline(e) + '. ' + msg);
			} else {
				// Download Packages Online
				if (msg === 'download') {
					downloadPackage(result, parameters.world, () => {
						var pkgObj = { path: result, type: 'url' };
						mcpack.hasPackage(pkgObj, parameters.world, () => {
							newPackages.push(pkgObj);
						});

						// Save packages to mcpack.json on last element
						if (index === array.length - 1) {
							doneInstall(newPackages);
						}
					});
				}
				// Extract Packages Local
				else if (msg === 'local') {
					extractLocal(result, parameters.world, () => {
						var pkgObj = { path: result, type: 'local' };
						mcpack.hasPackage(pkgObj, parameters.world, () => {
							newPackages.push(pkgObj);
						});

						// Save packages to mcpack.json on last element
						if (index === array.length - 1) {
							doneInstall(newPackages);
						}
					});
				}
			}
		});
	});
}

function downloadPackage (pkg, world, callback) {
	let worldPath = path.join(mcutil.getWorld(world), 'data');

	dl(pkg, worldPath, { extract: true }).then(() => {
		output.success('Installed pack ' + chalk.cyan.underline(pkg) + '.');
		callback();

	}).catch((err) => {
		if (err.response)
		output.error(err.response.body);
		else
		output.error(err);
	});
}

function extractLocal(pkg, world, callback) {
	let worldPath = path.join(mcutil.getWorld(world), 'data');

	decompress(pkg, worldPath).then((files) => {
		output.success('Installed pack ' + chalk.cyan.underline(pkg) + '.');
		callback();

	}).catch((err) => {
		if (err.response)
		output.error(err.response.body);
		else
		output.error(err);
	});
}

function doneInstall (packages) {
	mcpack.addPackagesToFile(parameters.world, packages);
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
