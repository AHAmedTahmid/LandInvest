// Verification test for translation dictionary completeness
import fs from "fs";
import path from "path";

const i18nFile = path.resolve("src/lib/i18n.tsx");
const content = fs.readFileSync(i18nFile, "utf-8");

// Extract DICT entries
const dictMatch = content.match(/const DICT:\s*Record<string,\s*\{[^}]+\}>\s*=\s*\{([\s\S]*?)\n\};/);
if (!dictMatch) {
  console.error("FAIL: Could not parse DICT from src/lib/i18n.tsx");
  process.exit(1);
}

const dictText = dictMatch[1];
const keyRegex = /^\s*([a-zA-Z0-9_]+):\s*\{\s*en:\s*"([^"]+)",\s*bn:\s*"([^"]+)"\s*\}/gm;

const translations = new Map();
let m;
while ((m = keyRegex.exec(dictText)) !== null) {
  translations.set(m[1], { en: m[2], bn: m[3] });
}

// Critical dashboard keys that must never render as raw identifiers
const requiredKeys = [
  "dashboard",
  "cashBalance",
  "bankBalance",
  "unsoldInventory",
  "receivables",
  "salesMonth",
  "salesYear",
  "totalLiquidity",
  "workingCapital",
  "totalEquity",
  "capitalDeployed",
  "overdueReceivables",
  "expensesMonth",
  "pendingApprovals",
  "realizedProfit",
  "portfolioRoi",
  "futureDated",
];

let failed = false;
console.log(`Checking ${requiredKeys.length} critical dashboard translation keys...`);

for (const key of requiredKeys) {
  const tr = translations.get(key);
  if (!tr) {
    console.error(`FAIL: Missing key "${key}" in i18n DICT!`);
    failed = true;
    continue;
  }
  if (!tr.en || tr.en.trim() === "" || tr.en === key) {
    console.error(`FAIL: Key "${key}" has invalid English translation: "${tr.en}"`);
    failed = true;
  }
  if (!tr.bn || tr.bn.trim() === "" || tr.bn === key) {
    console.error(`FAIL: Key "${key}" has invalid Bengali translation: "${tr.bn}"`);
    failed = true;
  }
  console.log(`  ✓ ${key.padEnd(20)} [EN]: ${tr.en.padEnd(30)} [BN]: ${tr.bn}`);
}

if (failed) {
  console.error("\nTEST FAILED: One or more translation keys are missing or unlocalized.");
  process.exit(1);
}

console.log("\nSUCCESS: All critical dashboard translation keys are fully localized in EN and BN.");
process.exit(0);

