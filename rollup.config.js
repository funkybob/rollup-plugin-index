import pkg from './package.json';

import resolve from 'rollup-plugin-node-resolve';
import common from 'rollup-plugin-commonjs';
import {terser} from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/index.js',
	external: [
		'fs',
		'path',
	],
	output: [
		{ file: pkg.main, format: 'cjs' },
		{ file: pkg.module, format: 'es' },
	],
	plugins: [
		resolve(),
		common(),
		production && terser({
			module: true,
			nameCache: {},
			ecma: 8,
			compress: {
				passes: 2,
			},
			output: {
				beautify: false
			}
		}),

	]
};
