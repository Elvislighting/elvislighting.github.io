const fs = require("fs");
const path = require("path");

const root = __dirname;
const dataFile = path.join(root, "data", "projects.js");
const assetsRoot = path.join(root, "project-assets");

global.window = {};
require(dataFile);

function titleFromFile(fileName) {
  return path
    .basename(fileName, path.extname(fileName))
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function relativeAssetPath(...parts) {
  return parts.join("/").replace(/\\/g, "/");
}

let changed = 0;

window.PORTFOLIO_PROJECTS.forEach((project) => {
  const pdfDir = path.join(assetsRoot, project.id, "pdf");
  if (!fs.existsSync(pdfDir)) return;

  const pdfFiles = fs
    .readdirSync(pdfDir)
    .filter((file) => path.extname(file).toLowerCase() === ".pdf")
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

  const existingPdfs = project.pdfs || [];
  const pdfFileSet = new Set(pdfFiles.map((file) => relativeAssetPath("project-assets", project.id, "pdf", file)));
  const existingByFile = new Map(existingPdfs.map((pdf) => [pdf.file, pdf]));

  const nextPdfs = existingPdfs.filter((pdf) => pdfFileSet.has(pdf.file));
  pdfFiles.forEach((file) => {
    const filePath = relativeAssetPath("project-assets", project.id, "pdf", file);
    if (existingByFile.has(filePath)) return;

    const title = titleFromFile(file);
    nextPdfs.push({
      title: { en: title, zh: title },
      file: filePath
    });
  });

  if (JSON.stringify(project.pdfs || []) !== JSON.stringify(nextPdfs)) {
    project.pdfs = nextPdfs;
    changed += 1;
  }
});

const output = `window.PORTFOLIO_PROJECTS = ${JSON.stringify(window.PORTFOLIO_PROJECTS, null, 2)};\n\nwindow.PORTFOLIO_FILTERS = ${JSON.stringify(window.PORTFOLIO_FILTERS)};\n`;
fs.writeFileSync(dataFile, output, "utf8");

console.log(`PDF sync complete. Updated ${changed} project${changed === 1 ? "" : "s"}.`);
