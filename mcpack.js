const fs = require('fs');
const path = require('path');
const mcutil = require('./util/mcutil');
const output = require('./util/output');

function createIfNot(world) {
	let pathToFile = path.join(mcutil.getWorld(world), 'data/mcpack.json');

	fs.stat(pathToFile, function(err, stats) {
		if (err && err.errno === 34 || err && err.errno === -4058) {
			// Does not exist
			let json = {
				name: world,
				packages: []
			}
			// Create it
			modifyPackFile(world, json);
		}
		else if (err) {
			output.error('Could not read mcpack.json.' + err);
			process.exit(1);
		}
	})
}

function modifyPackFile(world, obj) {
	let pathToFile = path.join(mcutil.getWorld(world), 'data/mcpack.json');

	fs.writeFile(pathToFile, JSON.stringify(obj), 'utf8', function(err) {
		if(err) {
			output.error(err);
			process.exit(1);
		}

		output.success('Saved changes to mcpack.json in world \"' + world + '\"');
	});
}

function addPackagesToFile(world, packs) {
	let pathToFile = path.join(mcutil.getWorld(world), 'data/mcpack.json');
	fs.readFile(pathToFile, 'utf8', function (err, data) {
		if (err) {
			output.error('Could not access mcpack.json. ' + err);
			process.exit(1);
		}

		var json;

		try {
			json = JSON.parse(data);
		}
		catch(e) {
			output.error('Could not read mcpack.json. ' + e);
			process.exit(1);
		}

		packs.forEach((e) => {
			json.packages.push(e);
		});

		modifyPackFile(world, json);
	})
}

function getMCPack(world, callback) {
	let pathToFile = path.join(mcutil.getWorld(world), 'data/mcpack.json');
	fs.readFile(pathToFile, 'utf8', function (err, data) {
		if (err) {
			output.error('Could not access mcpack.json. ' + err);
			process.exit(1);
		}

		var json;

		try {
			json = JSON.parse(data);
		}
		catch(e) {
			output.error('Could not read mcpack.json. ' + e);
			process.exit(1);
		}

		callback(json);
	})
}



module.exports = {
	createIfNot,
	modifyPackFile,
	addPackagesToFile,
	getMCPack
}
