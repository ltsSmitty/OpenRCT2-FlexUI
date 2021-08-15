import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

export default [{
	// Library packaging
	input: "./src/fui.ts",
	output: {
		file: "./dist/index.min.js",
		format: "cjs",
		exports: "default"
	},
	plugins: [
		replace({
			include: "./src/utilities/environment.ts",
			preventAssignment: true,
			values: {
				__BUILD_CONFIGURATION__: JSON.stringify("production")
			}
		}),
		typescript({ tsconfig: "./tsconfig.json" }),
		terser({
			compress: {
				passes: 3
			},
			format: {
				comments: false,
				quote_style: 1,
				wrap_iife: true,
				preamble: "// Get the latest version: https://github.com/Basssiiie/OpenRCT2-FluentUI",
			},
			mangle: {
				properties: {
					regex: /^_/
				}
			},
		}),
	],
},
{
	// Declaration file packaging
	input: "./src/fui.ts",
	output: {
		file: "./dist/index.d.ts",
		format: "es",
	},
	plugins: [
		typescript({ tsconfig: "./tsconfig.dts.json" }),
		dts()
	]
}];
