"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_made_report_lib = require("made-report-lib");
var import_fs = __toESM(require("fs"), 1);
var import_util = __toESM(require("util"), 1);
var readFileAsync = import_util.default.promisify(import_fs.default.readFile);
async function readDirectoriesFromJson(filePath) {
  try {
    const fileContent = await readFileAsync(filePath, "utf-8");
    const directories = JSON.parse(fileContent);
    return directories;
  } catch (error) {
    throw error;
  }
}
async function main() {
  try {
    const directories = await readDirectoriesFromJson("./directories.json");
    const report = new import_made_report_lib.ReportManager();
    directories.forEach((dir) => {
      if (dir.path) {
        report.createReport(dir.path);
      }
    });
  } catch (error) {
  }
}
main();
