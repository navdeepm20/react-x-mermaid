import PeerDepsExternalPlugin from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      { file: packageJson.main, format: "cjs", sourceMap: true },
      { file: packageJson.module, format: "esm", sourceMap: true },
    ],
    plugins: [
      PeerDepsExternalPlugin(),
      resolve(),
      terser(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss(),
    ],
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.types,
      },
    ],
    plugins: [dts.default()],
    external: [/\.css/],
  },
];
