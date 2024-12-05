// src/index.ts
import { ReportManager } from "made-report-lib";
import fs from "fs";
import util from "util";
var readFileAsync = util.promisify(fs.readFile);
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
    const report = new ReportManager();
    directories.forEach((dir) => {
      if (dir.path) {
        report.createReport(dir.path);
      }
    });
  } catch (error) {
  }
}
main();
