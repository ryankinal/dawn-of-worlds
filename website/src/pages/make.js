'use strict';

var Promise = require('bluebird');
var Mustache = require('mustache');
var fs = Promise.promisifyAll(require('fs'));

var pages = [{
	name: 'index',
	base: __dirname + '/outer.tpl',
	content: __dirname + '/index/index.tpl',
	data: {
		title: 'Home | Dawn of Worlds',
		styles: [
			'styles/index.css'
		]
	},
	partials: [
	]
}];

pages.forEach((config) => {
	Promise.all([
		fs.readFileAsync(config.content),
		fs.readFileAsync(config.base)
	]).then((data) => {
		config.data.content = Mustache.render(data[0].toString(), config.data, config.partials);
		process.stdout.write(`Writing file <${config.name}.html>... `);
		return fs.writeFileAsync(`./dist/${config.name}.html`, Mustache.render(data[1].toString(), config.data, config.partials));
	}).then((data) => {
		process.stdout.write('done\n');
	}).catch((a, b) => {
		process.stdout.write('failed\n');
	});
});