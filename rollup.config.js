import PeerDepsExternalPlugin from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      entryFileNames: "index.js",
      format: "cjs",
      exports: "named",
    },
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
      dir: "dist",
      entryFileNames: "index.mjs",
      format: "esm",
      exports: "named",
    },
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
      dir: "dist",
      entryFileNames: "index.d.ts",
    },
    plugins: [dts.default()],
    external: [/\.css/],
  },
];
