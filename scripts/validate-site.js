const fs = require("fs");
const vm = require("vm");

const requiredFiles = [
  "index.html",
  "assets/css/site.css",
  "assets/js/site.js",
  "data/experiences.json",
  "images/avatar2.png",
  "llms.txt",
  "robots.txt",
  "sitemap.xml",
];

const forbiddenPublicTerms = ["CDNCloud", "source_text", "基本上就是公司全部業務我都會", "沒得名"];

function readText(path) {
  return fs.readFileSync(path, "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseJsonFile(path) {
  return JSON.parse(readText(path));
}

function validateFilesExist() {
  for (const file of requiredFiles) {
    assert(fs.existsSync(file), `Missing required file: ${file}`);
  }
}

function validateNoForbiddenPublicTerms(files) {
  for (const file of files) {
    const content = readText(file);
    for (const term of forbiddenPublicTerms) {
      assert(!content.includes(term), `Forbidden public term "${term}" found in ${file}`);
    }
  }
}

function validateExperiences(data) {
  assert(Array.isArray(data.categories), "data.categories must be an array");
  assert(Array.isArray(data.experiences), "data.experiences must be an array");

  const categoryKeys = new Set(data.categories.map((category) => category.key));
  const ids = new Set();
  const requiredItemFields = ["id", "section", "title", "sort_order"];

  for (const category of data.categories) {
    assert(category.key, "Each category needs a key");
    assert(category.label, `Category ${category.key} needs a label`);
    assert(Number.isFinite(Number(category.sort_order)), `Category ${category.key} needs numeric sort_order`);
  }

  for (const item of data.experiences) {
    for (const field of requiredItemFields) {
      assert(item[field] !== undefined && item[field] !== "", `Experience item missing ${field}`);
    }
    assert(!ids.has(item.id), `Duplicate experience id: ${item.id}`);
    ids.add(item.id);
    assert(categoryKeys.has(item.section), `Unknown section "${item.section}" on ${item.id}`);
    assert(!Object.prototype.hasOwnProperty.call(item, "source_text"), `${item.id} leaks source_text`);
    if (item.featured_rank !== "") {
      assert(Number.isFinite(Number(item.featured_rank)), `${item.id} featured_rank must be numeric or empty`);
    }
    if (item.case_study) {
      for (const field of ["problem", "role", "stack", "outcome"]) {
        assert(item.case_study[field], `${item.id} case_study missing ${field}`);
      }
      assert(Number.isFinite(Number(item.case_rank)), `${item.id} case_rank must be numeric`);
      assert(item.url, `${item.id} case project should include a URL`);
    }
  }

  const currentRoles = data.experiences.filter((item) => item.section === "work" && item.end_date === "present");
  assert(currentRoles.some((item) => item.title === "NCSE Network"), "Current roles must include NCSE Network");
  assert(currentRoles.some((item) => item.title === "諾科雲有限公司"), "Current roles must include 諾科雲有限公司");
}

function validateHtml() {
  const html = readText("index.html");
  const requiredSnippets = [
    "諾科雲有限公司",
    "NCSE Network Founder",
    "/data/experiences.json",
    "application/ld+json",
    "og:image:alt",
    "twitter:image:alt",
    "<noscript>",
  ];

  for (const snippet of requiredSnippets) {
    assert(html.includes(snippet), `index.html missing required content: ${snippet}`);
  }

  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert(jsonLdMatch, "index.html missing JSON-LD script");
  JSON.parse(jsonLdMatch[1]);
}

function validateScriptSyntax() {
  const script = readText("assets/js/site.js");
  new vm.Script(script, { filename: "assets/js/site.js" });
  assert(script.includes("aria-controls"), "site.js should wire aria-controls for expand buttons");
}

function validateCrawlerFiles() {
  const llms = readText("llms.txt");
  const sitemap = readText("sitemap.xml");

  assert(llms.includes("Network Engineer at 諾科雲有限公司"), "llms.txt current role is out of sync");
  assert(llms.includes("https://yuan-tw.net/data/experiences.json"), "llms.txt should expose structured data");
  assert(sitemap.includes("https://yuan-tw.net/data/experiences.json"), "sitemap should include structured data");
  assert(!sitemap.includes("https://blog.yuan-tw.net/"), "sitemap should not include cross-subdomain blog URL");
}

function main() {
  validateFilesExist();
  validateNoForbiddenPublicTerms(["index.html", "assets/js/site.js", "data/experiences.json", "llms.txt"]);
  const data = parseJsonFile("data/experiences.json");
  validateExperiences(data);
  validateHtml();
  validateScriptSyntax();
  validateCrawlerFiles();
  console.log("Site validation passed.");
}

main();
