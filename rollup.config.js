import svelte from "rollup-plugin-svelte"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import pkg from "./package.json"

export default [
  {
		input: "src/TinyGallery.svelte",
		output: [
			{
				file: pkg.module,
				"format": "en"
			},
			{
				file: pkg.main,
				"format": "umd",
				name: "TinyGallery"
			}
		],
		plugins: [
			svelte(),
			resolve({
				dedupe: ["svelte"]
			}),
			commonjs()
		]
	},
]
