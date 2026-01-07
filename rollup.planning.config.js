import { PLANNING_URL } from "./private.env.js";

export default {
	input: "src/planning.js",
	output: {
		file: "dist/planning.user.js",
		format: "iife",
		// inlineDynamicImports: true,
	},
	plugins: [
		{
			name: "inject-match",
			renderChunk(code) {
				return code.replace("__PLANNING_URL__", PLANNING_URL);
			}
		}
	]
};
