import dts from "bun-plugin-dts";

await Bun.build({
	entrypoints: ["src/index.ts"],
	target: "bun",
	minify: true,
	outdir: "dist",
	packages: "external",
	sourcemap: "linked",
	plugins: [dts({ output: {} })],
});
