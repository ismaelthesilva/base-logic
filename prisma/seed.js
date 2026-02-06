/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function readCSV(filePath) {
  const csvContent = fs.readFileSync(filePath, "utf8");
  const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
  if (parsed.errors?.length) {
    const message = parsed.errors.map((e) => e.message).join("; ");
    throw new Error(`CSV parse error for ${filePath}: ${message}`);
  }
  return parsed.data;
}

function toNumber(value) {
  if (value === undefined || value === null) return null;
  const str = String(value).trim();
  if (!str) return null;
  const num = Number(str.replace(",", "."));
  return Number.isFinite(num) ? num : null;
}

function mapCountry(country) {
  const c = String(country || "").toLowerCase();
  if (c === "usa" || c === "us" || c === "united states") return "USA";
  if (c === "brazil" || c === "brasil" || c === "br") return "BRAZIL";
  return null;
}

async function upsertAssetFromRow({ row, forcedType, forcedCountry }) {
  const symbol = String(row.symbol || "").trim();
  if (!symbol) return;

  const country = forcedCountry || mapCountry(row.country);
  if (!country) return;

  const name = String(row.name || symbol).trim();
  const description = row.description ? String(row.description).trim() : null;

  const expenseRatio = toNumber(row.expense_ratio);
  const dividendYield = toNumber(row.dividend_yield);
  const currentPrice = toNumber(row.current_price);

  const riskLevel = row.risk_level ? String(row.risk_level).trim() : null;

  const asset = await prisma.asset.upsert({
    where: { symbol_country: { symbol, country } },
    create: {
      symbol,
      country,
      type: forcedType,
      name,
      description,
      riskLevel,
      expenseRatio,
      dividendYield,
      currentPrice,
    },
    update: {
      type: forcedType,
      name,
      description,
      riskLevel,
      expenseRatio,
      dividendYield,
      currentPrice,
    },
  });

  const years = [2019, 2020, 2021, 2022, 2023];

  for (const year of years) {
    await prisma.assetPrice.upsert({
      where: { assetId_year: { assetId: asset.id, year } },
      create: {
        assetId: asset.id,
        year,
        price: toNumber(row[`year_${year}`]),
      },
      update: {
        price: toNumber(row[`year_${year}`]),
      },
    });

    await prisma.fundamentals.upsert({
      where: { assetId_year: { assetId: asset.id, year } },
      create: {
        assetId: asset.id,
        year,
        receitaLiquida: toNumber(row[`receita_liquida_${year}`]),
        lucroLiquido: toNumber(row[`lucro_liquido_${year}`]),
        roe: toNumber(row[`roe_${year}`]),
        margemLiquida: toNumber(row[`margem_liquida_${year}`]),
        dividaLiquida: toNumber(row[`divida_liquida_${year}`]),
        ebitda: toNumber(row[`ebitda_${year}`]),
        dividendPercentage: toNumber(row.dividend_percentage),
      },
      update: {
        receitaLiquida: toNumber(row[`receita_liquida_${year}`]),
        lucroLiquido: toNumber(row[`lucro_liquido_${year}`]),
        roe: toNumber(row[`roe_${year}`]),
        margemLiquida: toNumber(row[`margem_liquida_${year}`]),
        dividaLiquida: toNumber(row[`divida_liquida_${year}`]),
        ebitda: toNumber(row[`ebitda_${year}`]),
        dividendPercentage: toNumber(row.dividend_percentage),
      },
    });
  }
}

async function main() {
  const dataDir = path.join(process.cwd(), "public", "data");

  const sources = [
    { file: "usa_stocks.csv", type: "STOCK", country: "USA" },
    { file: "usa_etfs.csv", type: "ETF", country: "USA" },
    { file: "usa_reits.csv", type: "REIT", country: "USA" },
    { file: "brazil_acoes.csv", type: "STOCK", country: "BRAZIL" },
    { file: "brazil_etfs.csv", type: "ETF", country: "BRAZIL" },
    { file: "brazil_fiis.csv", type: "REIT", country: "BRAZIL" },
  ];

  console.log("Seeding investments from CSV...");

  for (const src of sources) {
    const csvPath = path.join(dataDir, src.file);
    if (!fs.existsSync(csvPath)) {
      console.warn(`Skipping missing file: ${csvPath}`);
      continue;
    }

    const rows = readCSV(csvPath);
    console.log(`- ${src.file}: ${rows.length} rows`);

    for (const row of rows) {
      await upsertAssetFromRow({
        row,
        forcedType: src.type,
        forcedCountry: src.country,
      });
    }
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
