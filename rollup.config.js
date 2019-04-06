import resolve from 'rollup-plugin-node-resolve';
import common from 'rollup-plugin-commonjs';

export default {
	input: 'src/index.js',
	external: [
		'fs',
		'path',
	],
	output: {
		file: 'index.js',
		format: 'commonjs'
	},
	plugins: [
		resolve(),
		common(),
	]
};
