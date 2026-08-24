/**
 * Recategorize Misc repairs from product / brand / model text.
 *
 * Dry-run (default): prints suggestions, writes nothing.
 *   NODE_ENV=development node src/scripts/suggest-misc-categories.js
 *
 * Apply high-confidence suggestions:
 *   NODE_ENV=development node src/scripts/suggest-misc-categories.js --apply
 */

require("dotenv").config();

const database = require("../database/database-config");
const Repair = require("../models/repair");
const {
  canonicalizeProductCategory,
  suggestProductCategory,
} = require("../helpers/product-categories");

const APPLY = process.argv.includes("--apply");

const isMiscType = (stored) => canonicalizeProductCategory(stored).canonical === "Misc";

async function main() {
  await database.connect();

  const repairs = await Repair.find({}).select("product brand model type").lean();
  const misc = repairs.filter((repair) => isMiscType(repair.type));

  console.log(`Found ${misc.length} Misc repair(s) in ${process.env.NODE_ENV}`);
  console.log(APPLY ? "Mode: APPLY (will write)\n" : "Mode: DRY RUN (no writes)\n");

  const suggestions = [];
  const skipped = [];

  for (const repair of misc) {
    const suggestion = suggestProductCategory(repair);
    if (!suggestion) {
      skipped.push(repair);
      continue;
    }
    suggestions.push({
      _id: repair._id,
      product: repair.product,
      from: repair.type,
      to: suggestion.type,
      score: suggestion.score,
    });
  }

  const byType = {};
  suggestions.forEach((row) => {
    byType[row.to] = byType[row.to] || [];
    byType[row.to].push(row);
  });

  Object.keys(byType)
    .sort((a, b) => byType[b].length - byType[a].length)
    .forEach((type) => {
      console.log(`${byType[type].length}x -> ${type}`);
      byType[type]
        .sort((a, b) => b.score - a.score)
        .forEach((row) => {
          console.log(`    ${JSON.stringify(row.product || "")}  (score ${row.score})`);
        });
      console.log("");
    });

  console.log(`Suggested: ${suggestions.length}`);
  console.log(`Left as Misc: ${skipped.length}`);

  if (skipped.length > 0 && skipped.length <= 80) {
    console.log("\nUnmatched products:");
    skipped
      .map((repair) => repair.product || "")
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
      .forEach((product) => console.log(`  ${JSON.stringify(product)}`));
  } else if (skipped.length > 80) {
    console.log(`\n(${skipped.length} unmatched products omitted from listing)`);
  }

  if (APPLY && suggestions.length > 0) {
    let modified = 0;
    for (const row of suggestions) {
      const result = await Repair.updateOne({ _id: row._id, type: row.from }, { $set: { type: row.to } });
      modified += result.modifiedCount;
    }
    console.log(`\nUpdated ${modified} document(s).`);
  } else if (!APPLY && suggestions.length > 0) {
    console.log("\nRe-run with --apply to write the suggestions above.");
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
