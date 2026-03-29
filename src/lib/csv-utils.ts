import Papa from "papaparse";

export interface InvestmentData {
  symbol: string;
  name: string;
  category:
    | "ETF"
    | "Stock"
    | "Bond"
    | "REIT"
    | "Ação"
    | "FII"
    | "BDR"
    | "Renda Fixa";
  description: string;
  year_2019: string;
  year_2020: string;
  year_2021: string;
  year_2022: string;
  year_2023: string;
  current_price: string;
  dividend_yield: string;
  expense_ratio?: string;
  risk_level: "Low" | "Medium" | "High";
  performance?: string;
  country: "USA" | "Brazil";
  // Financial Metrics (5-year data)
  receita_liquida_2019?: string;
  receita_liquida_2020?: string;
  receita_liquida_2021?: string;
  receita_liquida_2022?: string;
  receita_liquida_2023?: string;
  lucro_liquido_2019?: string;
  lucro_liquido_2020?: string;
  lucro_liquido_2021?: string;
  lucro_liquido_2022?: string;
  lucro_liquido_2023?: string;
  roe_2019?: string;
  roe_2020?: string;
  roe_2021?: string;
  roe_2022?: string;
  roe_2023?: string;
  margem_liquida_2019?: string;
  margem_liquida_2020?: string;
  margem_liquida_2021?: string;
  margem_liquida_2022?: string;
  margem_liquida_2023?: string;
  divida_liquida_2019?: string;
  divida_liquida_2020?: string;
  divida_liquida_2021?: string;
  divida_liquida_2022?: string;
  divida_liquida_2023?: string;
  ebitda_2019?: string;
  ebitda_2020?: string;
  ebitda_2021?: string;
  ebitda_2022?: string;
  ebitda_2023?: string;
  dividend_percentage?: string; // Annual dividend percentage if company pays
}

export async function parseCSVData(
  csvContent: string
): Promise<InvestmentData[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(results.errors);
        } else {
          resolve(results.data as InvestmentData[]);
        }
      },
      error: (error: any) => {
        reject(error);
      },
    });
  });
}

export async function loadInvestmentData(
  category: "etfs" | "stocks" | "bonds"
): Promise<InvestmentData[]> {
  try {
    const response = await fetch(`/data/${category}.csv`);
    const csvContent = await response.text();
    return await parseCSVData(csvContent);
  } catch (error) {
    console.error(`Error loading ${category} data:`, error);
    return [];
  }
}

export async function loadBrazilianStocks(): Promise<InvestmentData[]> {
  try {
    const response = await fetch("/data/brazil_acoes.csv");
    const csvContent = await response.text();
    return await parseCSVData(csvContent);
  } catch (error) {
    console.error("Error loading Brazilian stocks data:", error);
    return [];
  }
}

export async function loadUSAStocks(): Promise<InvestmentData[]> {
  try {
    const response = await fetch("/data/usa_stocks.csv");
    const csvContent = await response.text();
    return await parseCSVData(csvContent);
  } catch (error) {
    console.error("Error loading USA stocks data:", error);
    return [];
  }
}

export async function loadBrazilianFIIs(): Promise<InvestmentData[]> {
  try {
    const response = await fetch("/data/brazil_fiis.csv");
    const csvContent = await response.text();
    return await parseCSVData(csvContent);
  } catch (error) {
    console.error("Error loading Brazilian FIIs data:", error);
    return [];
  }
}

// Calculate financial performance metrics
export function calculateFinancialMetrics(data: InvestmentData[]): any[] {
  return data.map((investment) => {
    const revenue2019 = parseFloat(investment.receita_liquida_2019 || "0");
    const revenue2023 = parseFloat(investment.receita_liquida_2023 || "0");
    const revenueGrowth =
      revenue2019 > 0 ? ((revenue2023 - revenue2019) / revenue2019) * 100 : 0;

    return {
      ...investment,
      calculated_revenue_growth: revenueGrowth.toFixed(1),
      latest_roe: investment.roe_2023 || "N/A",
      latest_margin: investment.margem_liquida_2023 || "N/A",
      dividend_rate: investment.dividend_percentage || "0.00",
    };
  });
}

export async function loadCountryInvestmentData(
  country: "usa" | "brazil",
  category: string
): Promise<InvestmentData[]> {
  try {
    const response = await fetch(`/data/${country}_${category}.csv`);
    const csvContent = await response.text();
    return await parseCSVData(csvContent);
  } catch (error) {
    console.error(`Error loading ${country} ${category} data:`, error);
    return [];
  }
}

export function calculatePerformance(data: InvestmentData[]) {
  return data.map((investment) => {
    const current = parseFloat(investment.current_price);
    const yearAgo = parseFloat(investment.year_2023);
    const performance = ((current - yearAgo) / yearAgo) * 100;

    return {
      ...investment,
      performance: performance.toFixed(2),
    };
  });
}

export function calculateSinglePerformance(investment: InvestmentData): number {
  const current = parseFloat(investment.current_price);
  const yearAgo = parseFloat(investment.year_2023);
  return ((current - yearAgo) / yearAgo) * 100;
}
