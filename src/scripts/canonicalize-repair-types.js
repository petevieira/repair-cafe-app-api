/**
 * One-shot migration: rewrite Repair.type values to canonical short names
 * (e.g. "Misc" instead of "Misc (Any electronic device...)").
 *
 * Dry-run (default): prints what would change, writes nothing.
 *   NODE_ENV=development node src/scripts/canonicalize-repair-types.js
 *
 * Apply:
 *   NODE_ENV=development node src/scripts/canonicalize-repair-types.js --apply
 *
 * Use NODE_ENV=staging or production for those databases.
 */

require("dotenv").config();

const database = require("../database/database-config");
const Repair = require("../models/repair");
const { canonicalizeProductCategory } = require("../helpers/product-categories");

const APPLY = process.argv.includes("--apply");

async function main() {
  await database.connect();

  const distinctTypes = await Repair.distinct("type");
  console.log(`Found ${distinctTypes.length} distinct type value(s) in ${process.env.NODE_ENV}`);
  console.log(APPLY ? "Mode: APPLY (will write)\n" : "Mode: DRY RUN (no writes)\n");

  let wouldUpdate = 0;
  let unchanged = 0;
  const unmatched = [];
  const planned = [];

  for (const stored of distinctTypes) {
    const { canonical, known } = canonicalizeProductCategory(stored);
    const count = await Repair.countDocuments({ type: stored });

    if (!known) {
      unmatched.push({ stored, count, canonical });
      continue;
    }

    if (stored === canonical) {
      unchanged += count;
      continue;
    }

    planned.push({ from: stored, to: canonical, count });
    wouldUpdate += count;
  }

  if (planned.length > 0) {
    console.log("Mappings:");
    planned
      .sort((a, b) => b.count - a.count)
      .forEach((row) => {
        console.log(`  ${row.count}x  ${JSON.stringify(row.from)}  ->  ${JSON.stringify(row.to)}`);
      });
    console.log("");
  }

  console.log(`Already canonical: ${unchanged} document(s)`);
  console.log(`Would update:      ${wouldUpdate} document(s) across ${planned.length} value(s)`);

  if (unmatched.length > 0) {
    console.log(`\nUnmapped (left unchanged, ${unmatched.reduce((n, r) => n + r.count, 0)} document(s)):`);
    unmatched
      .sort((a, b) => b.count - a.count)
      .forEach((row) => {
        console.log(`  ${row.count}x  ${JSON.stringify(row.stored)}  (stripped: ${JSON.stringify(row.canonical)})`);
      });
  }

  if (APPLY && planned.length > 0) {
    let modified = 0;
    for (const row of planned) {
      const result = await Repair.updateMany({ type: row.from }, { $set: { type: row.to } });
      modified += result.modifiedCount;
    }
    console.log(`\nUpdated ${modified} document(s).`);
  } else if (!APPLY && planned.length > 0) {
    console.log("\nRe-run with --apply to write these changes.");
  }

  await database.close();
}

main().catch(async (error) => {
  console.error(error);
  try {
    await database.close();
  } catch (closeError) {
    console.error(closeError);
  }
  process.exit(1);
});
