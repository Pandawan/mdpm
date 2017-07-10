const os = require('os');
const path = require('path');
const homeDir = require('home-dir').directory;

function getMCPath() {
	switch (os.platform()) {
		case 'win32': return path.join(homeDir, 'AppData/Roaming/.minecraft')
		case 'linux': return path.join(homeDir, '.minecraft')
		case 'darwin': return path.join(homeDir, 'Library/Application Support/minecraft')
	}
}

function getWorld (worldName) {
	return path.join(getMCPath(), 'saves/' + worldName)
}

module.exports = {
	getMCPath: getMCPath,
	getWorld: getWorld
}
