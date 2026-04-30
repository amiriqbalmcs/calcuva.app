import dynamic from "next/dynamic";
import { CALCULATORS } from "@/lib/calculators";
import { notFound } from "next/navigation";
import { getPostData, getSortedPostsData } from "@/lib/markdown";
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CalculatorSkeleton } from "@/components/CalculatorSkeleton";
import { Suspense } from "react";
import { SITE_URL } from "@/lib/constants";

const BASE_URL = SITE_URL;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const calc = CALCULATORS.find(c => c.slug === slug);
  if (!calc) return {};

  const title = `${calc.title} — Free Online Tool | Calcuva`;
  const description = calc.description;
  const url = `${BASE_URL}/calculators/${calc.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Calcuva",
      type: "website",
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: calc.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

// Lazy load calculators with skeleton loading state
const loading = () => <CalculatorSkeleton />;
const AgeCalculator = dynamic(() => import("@/components/calculators/AgeCalculator"), { loading });
const BmiTdeeCalculator = dynamic(() => import("@/components/calculators/BmiTdeeCalculator"), { loading });
const GpaPercentageCalculator = dynamic(() => import("@/components/calculators/GpaPercentageCalculator"), { loading });
const RunningPaceCalculator = dynamic(() => import("@/components/calculators/RunningPaceCalculator"), { loading });
const LoanEmiCalculator = dynamic(() => import("@/components/calculators/LoanEmiCalculator"), { loading });
const PregnancyCalculator = dynamic(() => import("@/components/calculators/PregnancyCalculator"), { loading });
const RentVsBuyCalculator = dynamic(() => import("@/components/calculators/RentVsBuyCalculator"), { loading });
const SipCompoundCalculator = dynamic(() => import("@/components/calculators/SipCompoundCalculator"), { loading });
const UnitConverter = dynamic(() => import("@/components/calculators/UnitConverter"), { loading });
const WaterSleepCalculator = dynamic(() => import("@/components/calculators/WaterSleepCalculator"), { loading });

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

// Phase 3 Batch 1
const CompoundInterestCalculator = dynamic(() => import("@/components/calculators/CompoundInterestCalculator"), { loading });
const TipCalculator = dynamic(() => import("@/components/calculators/TipCalculator"), { loading });
const DiscountCalculator = dynamic(() => import("@/components/calculators/DiscountCalculator"), { loading });

const LoveCalculator = dynamic(() => import("@/components/calculators/LoveCalculator"), { loading });
const CreditCardPayoffCalculator = dynamic(() => import("@/components/calculators/CreditCardPayoffCalculator"), { loading });
const CalorieDeficitCalculator = dynamic(() => import("@/components/calculators/CalorieDeficitCalculator"), { loading });

// Phase 6
const OneRepMaxCalculator = dynamic(() => import("@/components/calculators/OneRepMaxCalculator"), { loading });
const FreelanceRateCalculator = dynamic(() => import("@/components/calculators/FreelanceRateCalculator"), { loading });
const QrCodeGenerator = dynamic(() => import("@/components/calculators/QrCodeGenerator"), { loading });
const PasswordGenerator = dynamic(() => import("@/components/calculators/PasswordGenerator"), { loading });
const TaxBracketCalculator = dynamic(() => import("@/components/calculators/TaxBracketCalculator"), { loading });
const PregnancyWeekCalculator = dynamic(() => import("@/components/calculators/PregnancyWeekCalculator"), { loading });
const AcademicGradeCalculator = dynamic(() => import("@/components/calculators/AcademicGradeCalculator"), { loading });
const HecCgpaCalculator = dynamic(() => import("@/components/calculators/HecCgpaCalculator"), { loading });
const BoardPercentageCalculator = dynamic(() => import("@/components/calculators/BoardPercentageCalculator"), { loading });
const PkInflationCalculator = dynamic(() => import("@/components/calculators/PkInflationCalculator"), { loading });
const LoanEligibilityCalculator = dynamic(() => import("@/components/calculators/LoanEligibilityCalculator"), { loading });
const DebtPayoffCalculator = dynamic(() => import("@/components/calculators/DebtPayoffCalculator"), { loading });
const SleepDebtCalculator = dynamic(() => import("@/components/calculators/SleepDebtCalculator"), { loading });
const BloodSugarConverter = dynamic(() => import("@/components/calculators/BloodSugarConverter"), { loading });
const NetWorthCalculator = dynamic(() => import("@/components/calculators/NetWorthCalculator"), { loading });
const CarbonFootprintCalculator = dynamic(() => import("@/components/calculators/CarbonFootprintCalculator"), { loading });
const SolarSimulator = dynamic(() => import("@/components/calculators/SolarSimulator"), { loading });
const FreelanceOptimizer = dynamic(() => import("@/components/calculators/FreelanceOptimizer"), { loading });
const SalaryTaxCalculator = dynamic(() => import("@/components/calculators/SalaryTaxCalculator"), { loading });
const ElectricityPredictor = dynamic(() => import("@/components/calculators/ElectricityPredictor"), { loading });

const componentMap: Record<string, any> = {
  "loan-emi-calculator": LoanEmiCalculator,
  "income-tax-calculator": SalaryTaxCalculator,
  "sip-investment-calculator": SipCompoundCalculator,
  "rent-vs-buy-calculator": RentVsBuyCalculator,
  "age-calculator": AgeCalculator,
  "bmi-tdee-calculator": BmiTdeeCalculator,
  "gpa-to-percentage-calculator": GpaPercentageCalculator,
  "pregnancy-ovulation-calculator": PregnancyCalculator,
  "unit-converter": UnitConverter,
  "water-intake-sleep-calculator": WaterSleepCalculator,
  // Phase 3 Batch 1
  "compound-interest-calculator": CompoundInterestCalculator,
  "tip-calculator": TipCalculator,
  "discount-calculator": DiscountCalculator,
  // Phase 3 Batch 2
  "calorie-deficit-calculator": CalorieDeficitCalculator,
  "mortgage-calculator": LoanEmiCalculator, // Alias to LoanEmiCalculator
  "love-calculator": LoveCalculator,
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
  "credit-card-payoff-calculator": CreditCardPayoffCalculator,
  "one-rep-max-calculator": OneRepMaxCalculator,
  "freelance-rate-calculator": FreelanceRateCalculator,
  "qr-code-generator": QrCodeGenerator,
  "running-pace-calculator": RunningPaceCalculator,
  "password-generator": PasswordGenerator,
  "tax-bracket-calculator": TaxBracketCalculator,
  "pregnancy-week-calculator": PregnancyWeekCalculator,
  "intermittent-fasting-calculator": FastingCalculator,
  "academic-grade-calculator": AcademicGradeCalculator,
  // Batch 4
  "car-loan-vs-lease-calculator": CarLoanLeaseCalculator,
  "blood-alcohol-content-calculator": BacCalculator,
  "smoking-cost-calculator": SmokingCostCalculator,
  "retirement-fire-calculator": RetirementFireCalculator,
  "percentage-increase-calculator": PercentageCalculator,
  // Static Batch
  "hec-cgpa-converter": HecCgpaCalculator,
  "board-percentage-calculator": BoardPercentageCalculator,
  "pakistan-inflation-calculator": PkInflationCalculator,
  "loan-eligibility-calculator-pakistan": LoanEligibilityCalculator,
  "debt-payoff-calculator": DebtPayoffCalculator,
  "sleep-debt-calculator": SleepDebtCalculator,
  "blood-sugar-hba1c-converter": BloodSugarConverter,
  "net-worth-tracker": NetWorthCalculator,
  "personal-carbon-footprint-calculator": CarbonFootprintCalculator,
  "solar-roi-simulator-pakistan": SolarSimulator,
  "freelance-fee-optimizer": FreelanceOptimizer,
  "salary-income-tax-calculator-2026": SalaryTaxCalculator,
  "electricity-bill-predictor-pakistan": ElectricityPredictor,
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

  return (
    <ErrorBoundary>
      <Suspense fallback={<CalculatorSkeleton />}>
        <Calculator calc={meta} guideHtml={guideHtml} faqs={guideFaqs} relatedArticles={relatedArticles} />
      </Suspense>
    </ErrorBoundary>
  );
}
