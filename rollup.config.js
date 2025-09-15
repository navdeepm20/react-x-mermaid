import PeerDepsExternalPlugin from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import { visualizer } from "rollup-plugin-visualizer";

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      entryFileNames: "index.js",
      format: "cjs",
      exports: "named",
      // Inline dynamic imports so Rollup doesn't create multiple chunk files
      // when bundling dependencies that use dynamic import().
      inlineDynamicImports: true,
    },
    external: ["mermaid"],
    plugins: [
      PeerDepsExternalPlugin(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss(),
      terser(),
      visualizer({
        open: true, // This will automatically open the report in your browser
        gzipSize: true, // Collect and display gzip sizes
        brotliSize: true, // Collect and display brotli sizes
      }),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      entryFileNames: "index.mjs",
      format: "esm",
      exports: "named",
      inlineDynamicImports: true,
    },
    external: ["mermaid"],
    plugins: [
      PeerDepsExternalPlugin(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss(),
      terser(),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
    },
    plugins: [dts.default()],
    external: [/\.css/, "mermaid"],
  },
];
