import dynamic from "next/dynamic";
import { CALCULATORS } from "@/lib/calculators";
import { notFound } from "next/navigation";
import { getPostData, getSortedPostsData } from "@/lib/markdown";

// Lazy load calculators
const AgeCalculator = dynamic(() => import("@/components/calculators/AgeCalculator"));
const BmiTdeeCalculator = dynamic(() => import("@/components/calculators/BmiTdeeCalculator"));
const GpaPercentageCalculator = dynamic(() => import("@/components/calculators/GpaPercentageCalculator"));
const LoanEmiCalculator = dynamic(() => import("@/components/calculators/LoanEmiCalculator"));
const PregnancyCalculator = dynamic(() => import("@/components/calculators/PregnancyCalculator"));
const RentVsBuyCalculator = dynamic(() => import("@/components/calculators/RentVsBuyCalculator"));
const SalaryTaxCalculator = dynamic(() => import("@/components/calculators/SalaryTaxCalculator"));
const SipCompoundCalculator = dynamic(() => import("@/components/calculators/SipCompoundCalculator"));
const UnitCurrencyConverter = dynamic(() => import("@/components/calculators/UnitCurrencyConverter"));
const WaterSleepCalculator = dynamic(() => import("@/components/calculators/WaterSleepCalculator"));

// Batch 1 Expansion
const GstVatCalculator = dynamic(() => import("@/components/calculators/GstVatCalculator"));
const InflationCalculator = dynamic(() => import("@/components/calculators/InflationCalculator"));
const BodyFatCalculator = dynamic(() => import("@/components/calculators/BodyFatCalculator"));
const ProfitMarginCalculator = dynamic(() => import("@/components/calculators/ProfitMarginCalculator"));
const WordCounterCalculator = dynamic(() => import("@/components/calculators/WordCounterCalculator"));

// Batch 2 Expansion
const FdRdCalculator = dynamic(() => import("@/components/calculators/FdRdCalculator"));
const CryptoProfitCalculator = dynamic(() => import("@/components/calculators/CryptoProfitCalculator"));
const IdealWeightCalculator = dynamic(() => import("@/components/calculators/IdealWeightCalculator"));
const MacroCalculator = dynamic(() => import("@/components/calculators/MacroCalculator"));
const HourlySalaryCalculator = dynamic(() => import("@/components/calculators/HourlySalaryCalculator"));

// Batch 3 Expansion
const BreakEvenCalculator = dynamic(() => import("@/components/calculators/BreakEvenCalculator"));
const ScientificCalculator = dynamic(() => import("@/components/calculators/ScientificCalculator"));
const DatePlusMinusCalculator = dynamic(() => import("@/components/calculators/DatePlusMinusCalculator"));
const WorkingDaysCalculator = dynamic(() => import("@/components/calculators/WorkingDaysCalculator"));
const FastingCalculator = dynamic(() => import("@/components/calculators/FastingCalculator"));

// Batch 4 Expansion
const CarLoanLeaseCalculator = dynamic(() => import("@/components/calculators/CarLoanLeaseCalculator"));
const BacCalculator = dynamic(() => import("@/components/calculators/BacCalculator"));
const SmokingCostCalculator = dynamic(() => import("@/components/calculators/SmokingCostCalculator"));
const RetirementFireCalculator = dynamic(() => import("@/components/calculators/RetirementFireCalculator"));
const PercentageCalculator = dynamic(() => import("@/components/calculators/PercentageCalculator"));

const componentMap: Record<string, any> = {
  "age-calculator-date-of-birth": AgeCalculator,
  "bmi-tdee-calculator": BmiTdeeCalculator,
  "gpa-to-percentage-calculator": GpaPercentageCalculator,
  "loan-emi-calculator": LoanEmiCalculator,
  "pregnancy-ovulation-calculator": PregnancyCalculator,
  "rent-vs-buy-calculator": RentVsBuyCalculator,
  "income-tax-calculator": SalaryTaxCalculator,
  "sip-investment-calculator": SipCompoundCalculator,
  "unit-converter-currency-calculator": UnitCurrencyConverter,
  "water-intake-sleep-calculator": WaterSleepCalculator,
  // Batch 1
  "gst-vat-tax-calculator": GstVatCalculator,
  "inflation-calculator": InflationCalculator,
  "body-fat-percentage-calculator": BodyFatCalculator,
  "profit-margin-calculator": ProfitMarginCalculator,
  "word-character-counter-tool": WordCounterCalculator,
  // Batch 2
  "fixed-deposit-calculator": FdRdCalculator,
  "crypto-investment-profit-calculator": CryptoProfitCalculator,
  "ideal-weight-calculator": IdealWeightCalculator,
  "macro-nutrient-calculator": MacroCalculator,
  "hourly-to-salary-calculator": HourlySalaryCalculator,
  // Batch 3
  "break-even-point-calculator": BreakEvenCalculator,
  "scientific-calculator-online": ScientificCalculator,
  "date-plus-minus-calculator": DatePlusMinusCalculator,
  "business-working-days-calculator": WorkingDaysCalculator,
  "intermittent-fasting-calculator": FastingCalculator,
  // Batch 4
  "car-loan-vs-lease-calculator": CarLoanLeaseCalculator,
  "blood-alcohol-content-calculator": BacCalculator,
  "smoking-cost-calculator": SmokingCostCalculator,
  "retirement-fire-calculator": RetirementFireCalculator,
  "percentage-increase-calculator": PercentageCalculator,
};

export async function generateStaticParams() {
  return CALCULATORS.map((calc) => ({
    slug: calc.slug,
  }));
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const Calculator = componentMap[slug];
  const meta = CALCULATORS.find(c => c.slug === slug);
  if (!Calculator || !meta) {
    console.error(`ERROR: Metadata not found for slug: "${slug}"`);
    notFound();
    return null; 
  }

  let guideHtml = "";
  let guideFaqs: { q: string; a: string }[] | undefined;

  try {
    const guide = await getPostData("guides", slug);
    guideHtml = guide.contentHtml;
    guideFaqs = guide.faqs;
  } catch (e) {
    // console.error(`Failed to load guide for ${slug}:`, e);
  }

  const allPosts = await getSortedPostsData("blog");
  const relatedArticles = allPosts
    .filter(p => p && p.category && meta.category && p.category === meta.category)
    .slice(0, 2);

  return <Calculator guideHtml={guideHtml} faqs={guideFaqs} relatedArticles={relatedArticles} />;
}
