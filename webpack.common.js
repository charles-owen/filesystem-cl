const path = require('path');

module.exports = {
	entry: {
		FileSystemConsole: {
			import: path.resolve(__dirname, 'js/Console/index.js'),
			dependOn: ['Console', 'Users', 'Site']
		}
	}
}
