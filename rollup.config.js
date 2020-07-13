import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";
import svgr from "@svgr/rollup";
import url from "rollup-plugin-url";

const extensions = [".js"];

export default {
  input: "./src/index.js",
  plugins: [
    resolve({ extensions }),
    babel({ extensions, include: ["lib/**/*"], runtimeHelpers: true }),
    commonjs({
      include: "node_modules/**",
    }),
    url(),
    svgr(),
  ],
  output: [
    {
      file: pkg.module,
      format: "es",
    },
  ],
};
