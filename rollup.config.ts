import pluginNodeResolve from "@rollup/plugin-node-resolve";
import pluginCommonjs from "@rollup/plugin-commonjs";
import { babel as pluginBabel } from "@rollup/plugin-babel";
import { terser as pluginTerser } from "rollup-plugin-terser";
import pluginTypescript from '@rollup/plugin-typescript'
import * as path from "path";
import camelCase from "lodash.camelcase";
import upperFirst from "lodash.upperfirst";
import pkg from "./package.json";

const moduleName = upperFirst(camelCase(pkg.name.replace(/^\@.*\//, '')));

const banner = `/*!
  ${moduleName}.js v${pkg.version}
  ${pkg.homepage}
  Released under the ${pkg.license} License.
*/`;

const BABELRC = ".babelrc.js"

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        name: moduleName,
        file: pkg.browser,
        format: 'iife',
        sourcemap: 'inline',
        banner,
      },
      {
        name: moduleName,
        file: pkg.browser.replace('.js', '.min.js'),
        format: 'iife',
        banner,
        plugins: [
          pluginTerser(),
        ],
      },
    ],
    plugins: [
      pluginTypescript(),
      pluginCommonjs({
        extensions: [".js", ".ts"],
      }),
      pluginBabel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, BABELRC),
      }),
      pluginNodeResolve({
        browser: true,
      }),
    ],
  },
  {
    input: `src/${pkg.name.replace(/^\@.*\//, "")}.ts`.replace('.ts', '.d.ts'),
    output: [
      {
        file: pkg.module,
        format: "esm",
        sourcemap: "inline",
        banner,
        exports: "named",
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      pluginTypescript({ compilerOptions: { outDir: "types", declaration: true}}),
      pluginBabel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, BABELRC),
      }),
    ],
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: "inline",
        banner,
        exports: "default",
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      pluginTypescript(),
      pluginBabel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, BABELRC),
      }),
    ],
  },
];
