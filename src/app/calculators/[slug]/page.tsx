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

  const title = `${calc.title} — Free Online Tool`;
  const description = calc.description;
  const url = `${BASE_URL}/calculators/${calc.slug}`;
  const keywords = [...calc.slug.split('-'), calc.category, "calculator", "online tool"];

  return {
    title,
    description,
    keywords,
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
const SolarRequirementCalculator = dynamic(() => import("@/components/calculators/SolarRequirementCalculator"), { loading });
const SolarBatteryCalculator = dynamic(() => import("@/components/calculators/SolarBatteryCalculator"), { loading });
const SolarPanelToKwCalculator = dynamic(() => import("@/components/calculators/SolarPanelToKwCalculator"), { loading });
const SocialSharePreviewCalculator = dynamic(() => import("@/components/calculators/SocialSharePreviewCalculator"), { loading });
const UniversityMeritCalculator = dynamic(() => import("@/components/calculators/UniversityMeritCalculator"), { loading });
const PtaTaxCalculator = dynamic(() => import("@/components/calculators/PtaTaxCalculator"), { loading });
const AiTokenCalculator = dynamic(() => import("@/components/calculators/AiTokenCalculator"), { loading });
const CarRegistrationCalculator = dynamic(() => import("@/components/calculators/CarRegistrationCalculator"), { loading });
const ZakatCalculator = dynamic(() => import("@/components/calculators/ZakatCalculator"), { loading });
const SolarNetBilling = dynamic(() => import("@/components/calculators/SolarNetBilling"), { loading });
const FreelanceTaxOptimizer = dynamic(() => import("@/components/calculators/FreelanceTaxOptimizer"), { loading });
const AiEfficiencyRoi = dynamic(() => import("@/components/calculators/AiEfficiencyRoi"), { loading });
const UrbanCooling = dynamic(() => import("@/components/calculators/UrbanCooling"), { loading });
const AiWaterFootprint = dynamic(() => import("@/components/calculators/AiWaterFootprint"), { loading });
const PlasticImpactMap = dynamic(() => import("@/components/calculators/PlasticImpactMap"), { loading });
const EvGridAuditor = dynamic(() => import("@/components/calculators/EvGridAuditor"), { loading });
const DietaryLandUse = dynamic(() => import("@/components/calculators/DietaryLandUse"), { loading });
const MicroplasticProtection = dynamic(() => import("@/components/calculators/MicroplasticProtection"), { loading });
const CarPerformanceCalculator = dynamic(() => import("@/components/calculators/CarPerformanceCalculator"), { loading });
const GpsSpeedometer = dynamic(() => import("@/components/calculators/GpsSpeedometer"), { loading });
const TrainSpeedometer = dynamic(() => import("@/components/calculators/TrainSpeedometer"), { loading });
const FlightSpeedometer = dynamic(() => import("@/components/calculators/FlightSpeedometer"), { loading });
const BoatSpeedometer = dynamic(() => import("@/components/calculators/BoatSpeedometer"), { loading });
const ReactionTimeTest = dynamic(() => import("@/components/calculators/ReactionTimeTest"), { loading });
const RollerCoasterSpeedometer = dynamic(() => import("@/components/calculators/RollerCoasterSpeedometer"), { loading });
const ElevatorSpeedometer = dynamic(() => import("@/components/calculators/ElevatorSpeedometer"), { loading });
const CyclingSpeedometer = dynamic(() => import("@/components/calculators/CyclingSpeedometer"), { loading });
const EscooterSpeedometer = dynamic(() => import("@/components/calculators/EscooterSpeedometer"), { loading });
const SkiSpeedometer = dynamic(() => import("@/components/calculators/SkiSpeedometer"), { loading });
const RunningSpeedometer = dynamic(() => import("@/components/calculators/RunningSpeedometer"), { loading });
const HorseSpeedometer = dynamic(() => import("@/components/calculators/HorseSpeedometer"), { loading });
const SequenceMemoryTest = dynamic(() => import("@/components/calculators/SequenceMemoryTest"), { loading });
const AimTrainer = dynamic(() => import("@/components/calculators/AimTrainer"), { loading });
const NumberMemoryTest = dynamic(() => import("@/components/calculators/NumberMemoryTest"), { loading });
const VerbalMemoryTest = dynamic(() => import("@/components/calculators/VerbalMemoryTest"), { loading });
const ChimpTest = dynamic(() => import("@/components/calculators/ChimpTest"), { loading });
const VisualMemoryTest = dynamic(() => import("@/components/calculators/VisualMemoryTest"), { loading });
const TypingSpeedTest = dynamic(() => import("@/components/calculators/TypingSpeedTest"), { loading });
const MortgageCalculator = dynamic(() => import("@/components/calculators/MortgageCalculator"), { loading });

const WifiQrCodeGenerator = dynamic(() => import("@/components/calculators/WifiQrCodeGenerator"), { loading });
const VCardQrCodeGenerator = dynamic(() => import("@/components/calculators/VCardQrCodeGenerator"), { loading });
const WhatsappQrCodeGenerator = dynamic(() => import("@/components/calculators/WhatsappQrCodeGenerator"), { loading });
const CryptoQrCodeGenerator = dynamic(() => import("@/components/calculators/CryptoQrCodeGenerator"), { loading });

const componentMap: Record<string, any> = {
  "loan-emi-calculator": LoanEmiCalculator,
  "income-tax-calculator": TaxBracketCalculator,
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
  "mortgage-calculator": MortgageCalculator,
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
  "solar-system-requirement-calculator": SolarRequirementCalculator,
  "solar-battery-backup-calculator": SolarBatteryCalculator,
  "solar-panel-to-kw-calculator": SolarPanelToKwCalculator,
  "social-share-preview-tool": SocialSharePreviewCalculator,
  "university-merit-aggregate-calculator": UniversityMeritCalculator,
  "pakistan-mobile-pta-tax-calculator": PtaTaxCalculator,
  "ai-api-token-cost-calculator": AiTokenCalculator,
  "pakistan-car-registration-fee-calculator": CarRegistrationCalculator,
  "zakat-calculator-pakistan-2026": ZakatCalculator,
  "solar-net-billing-calculator-pakistan": SolarNetBilling,
  "freelance-tax-residency-optimizer": FreelanceTaxOptimizer,
  "ai-agent-efficiency-roi-calculator": AiEfficiencyRoi,
  "urban-cooling-tree-multiplier": UrbanCooling,
  "ai-water-footprint-calculator": AiWaterFootprint,
  "plastic-to-oxygen-impact-map": PlasticImpactMap,
  "ev-grid-cleanliness-auditor": EvGridAuditor,
  "dietary-land-use-restoration": DietaryLandUse,
  "microplastic-ocean-protection": MicroplasticProtection,
  "gps-speedometer-online": GpsSpeedometer,
  "car-performance-speed-test": CarPerformanceCalculator,
  "train-speed-test-live": TrainSpeedometer,
  "flight-speed-tracker-gps": FlightSpeedometer,
  "boat-speed-tracker-knots": BoatSpeedometer,
  "roller-coaster-speed-tracker": RollerCoasterSpeedometer,
  "high-speed-elevator-test": ElevatorSpeedometer,
  "cycling-speedometer-online": CyclingSpeedometer,
  "e-scooter-speedometer": EscooterSpeedometer,
  "ski-snowboard-speed-tracker": SkiSpeedometer,
  "running-speedometer-test": RunningSpeedometer,
  "horse-riding-speed-tracker": HorseSpeedometer,
  "sequence-memory-test": SequenceMemoryTest,
  "human-reaction-time-test": ReactionTimeTest,
  "aim-trainer": AimTrainer,
  "number-memory-test": NumberMemoryTest,
  "verbal-memory-test": VerbalMemoryTest,
  "chimp-test": ChimpTest,
  "visual-memory-test": VisualMemoryTest,
  "typing-speed-test": TypingSpeedTest,
  "wifi-qr-code-generator": WifiQrCodeGenerator,
  "vcard-qr-code-generator": VCardQrCodeGenerator,
  "whatsapp-qr-code-generator": WhatsappQrCodeGenerator,
  "crypto-qr-code-generator": CryptoQrCodeGenerator,
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
        <script
          id="calculator-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebApplication",
                  "name": meta.title,
                  "applicationCategory": meta.category === "finance" ? "FinanceApplication" : meta.category === "health" ? "HealthApplication" : "UtilitiesApplication",
                  "operatingSystem": "Any",
                  "description": meta.description,
                  "url": `${BASE_URL}/calculators/${meta.slug}`,
                  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
                },
                ...(guideFaqs ? [{
                  "@type": "FAQPage",
                  "mainEntity": guideFaqs.map(f => ({
                    "@type": "Question",
                    "name": f.q,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": f.a
                    }
                  }))
                }] : [])
              ]
            })
          }}
        />
        <Calculator calc={meta} guideHtml={guideHtml} faqs={guideFaqs} relatedArticles={relatedArticles} />
      </Suspense>
    </ErrorBoundary>
  );
}
