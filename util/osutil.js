const fs = require('fs');

//function will check if a directory exists, and create it if it doesn't
function checkDirectory(directory, callback) {
	fs.stat(directory, function(err, stats) {
		//Check if error defined and the error code is "not exists"
		if (err && err.errno === 34 || err && err.errno === -4058) {
			callback(false);
		} else if (err) {
			//just in case there was a different error:
			callback(false, err);
		}
		else {
			callback(true);
		}
	});
}

function checkValidPath(path, callback) {
	// Test if the path is a link to a zip file
	if (/^((?:http(s?):)(?:[/|.|\w|\s:])*\.(?:zip))$/.test(path)) {
		// Download File
		callback(path, "download")
	}
	// Path incorrect
	else {
		fs.stat(path, function(err, stats) {
			// If there was an error
			if (err) {
				callback(false, '\n  ' + err);
			}
			// Check for a zip file
			else if (!stats.isFile() || !path.includes('zip')){
				callback(false, "Path given is not a zip file.");
			}
			else {
				callback(path, "local");
			}
		});
	}
}


module.exports = {
	checkDirectory: checkDirectory,
	checkValidPath: checkValidPath
}
