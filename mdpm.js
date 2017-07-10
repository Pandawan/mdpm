#!/usr/bin/env node

const pkginfo = require('pkginfo')(module);
const chalk = require('chalk');
const program = require('commander');

program
	.version(module.exports.version)
	.command('install <world> <packages...>', 'Install Minecraft Data Packs to a world')
	.parse(process.argv);

if (program.args && program.args[0] !== 'install'){
	console.log('Did you mean ' + chalk.grey('mdpm install') + '?')
} else if (!program.args) {
	console.log([
		'',
		'  Usage: mdpm [options] [command]',
		'',
		'  Options:',
		'',
		'    -V, --version  output the version number',
		'    -h, --help     output usage information',
		'',
		'  Commands:',
		'    install <world> <packages...>  Install Minecraft Data Packs to a world',
		'    help [cmd]                     display help for [cmd]',
		''
	].join('\n'));
}
