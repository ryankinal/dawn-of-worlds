module.exports = (env) => {
	var environment = (env && env.production) ? 'prod' : 'dev';

	return {
		mode: (env && env.production) ? 'production' : 'development',
		entry: {
			map: './src/js/entry/map.js',
			account: './src/js/entry/account.js',
			config: `./src/js/config.${environment}.js`
		},
		output: {
			path: __dirname + '/dist/scripts/',
			filename: '[name].js',
		}
	}
};