export type CategoryKey = "finance" | "health" | "education" | "utility" | "business" | "sustainability" | "benchmarks";

export interface CalcMeta {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: string;
  category: CategoryKey;
  keywords: string[];
  relatedSlugs?: string[];
  hideCurrencySwitcher?: boolean;
  howTo?: {
    steps: { title: string; text: string }[];
    proTip?: string;
  };
}

export const CATEGORIES: Record<CategoryKey, { label: string; code: string; description: string }> = {
  finance: { label: "Finance", code: "FI", description: "Loans, taxes, savings and investment planning." },
  health: { label: "Health", code: "HL", description: "Body composition, nutrition and wellness tracking." },
  education: { label: "Education", code: "ED", description: "Academic performance and grade calculation." },
  utility: { label: "Utility", code: "UT", description: "Everyday converters and date calculators." },
  business: { label: "Business", code: "BS", description: "Profitability, margins, and startup metrics." },
  sustainability: { label: "Sustainability", code: "SS", description: "Environmental impact and green energy tools." },
  benchmarks: { label: "Benchmarks", code: "BM", description: "Cognitive tests, typing speed, and human performance." },
};

export const CALCULATORS: CalcMeta[] = [
  // Phase 3 - Batch 1 Expansion
  {
    slug: "compound-interest-calculator",
    title: "Compound Interest Calculator",
    short: "Calculate how your money grows over time with compounding.",
    description: "Determine the future value of your savings or investments by projecting compound interest daily, monthly, or yearly.",
    icon: "PiggyBank", category: "finance",
    keywords: ["compound interest calculator", "compound interest formula", "savings calculator", "investment growth calculator"],
    relatedSlugs: ["sip-compound-calculator", "savings-goal-calculator"],
    howTo: {
      steps: [
        { title: "Initial Funds", text: "Enter your starting balance and any monthly contribution you plan to make." },
        { title: "Growth Rate", text: "Input your expected annual interest rate and set the time horizon in years." },
        { title: "Compound Power", text: "Choose how often interest is added (Monthly/Annually) to see the cumulative growth." }
      ],
      proTip: "Small monthly additions often make a bigger impact than a large initial deposit over long periods."
    }
  },
  {
    slug: "tip-calculator",
    title: "Tip Calculator & Bill Splitter",
    short: "Quickly calculate gratuity and split the bill among friends.",
    description: "Find the exact tip amount, total bill, and split per person instantly. Perfect for dining out or service gratuities.",
    icon: "Coins", category: "finance",
    keywords: ["tip", "gratuity", "bill split", "restaurant tip", "split bill"],
    relatedSlugs: ["discount-calculator", "gst-vat-tax-calculator", "percentage-increase-calculator"],
    howTo: {
      steps: [
        { title: "Bill Amount", text: "Enter the total amount of your restaurant bill before tip." },
        { title: "Tip Percentage", text: "Choose a tip rate or enter a custom percentage for service." },
        { title: "Split Bill", text: "Optionally enter the number of people to see the share per person." }
      ],
      proTip: "Standard tipping is 15-20%, but it varies significantly by country and service quality."
    }
  },
  {
    slug: "discount-calculator",
    title: "Discount & Sale Price Calculator",
    short: "Find the final price after a discount or coupon is applied.",
    description: "Calculate what a product will actually cost after percent-off deals, cash back, or retail sales are factored in.",
    icon: "Percent", category: "utility",
    keywords: ["discount", "sale price", "coupon", "percent off", "markdown"],
    relatedSlugs: ["tip-calculator", "profit-margin-calculator", "percentage-increase-calculator"],
    howTo: {
      steps: [
        { title: "Original Price", text: "Enter the initial retail price before any discounts are applied." },
        { title: "Discount Rate", text: "Input the percentage off or a flat discount amount you received." },
        { title: "Final Cost", text: "View your total savings and the final price you will pay at checkout." }
      ],
      proTip: "Apply the primary percentage first, then any flat-amount coupons for the most accurate calculation."
    }
  },
  // Phase 3 - Batch 2 Expansion
  {
    slug: "calorie-deficit-calculator",
    title: "Calorie Deficit Calculator",
    short: "Calculate the exact calories needed to reach your target weight.",
    description: "Determine your daily calorie deficit based on your BMR, activity level, and weight loss timeline. A scientific approach to fat loss.",
    icon: "Flame", category: "health",
    keywords: ["calorie deficit", "weight loss calculator", "tdee calculator", "bmr", "fat loss", "how many calories to lose weight"],
    relatedSlugs: ["bmi-tdee-calculator", "macro-nutrient-calculator", "water-intake-sleep-calculator"],
    howTo: {
      steps: [
        { title: "Basics", text: "Enter your age, sex, weight, and height to determine your current metabolism." },
        { title: "Target Goal", text: "Choose your desired weight loss rate (e.g., 0.5kg/week) and activity level." },
        { title: "Calorie Plan", text: "Get your personalized daily calorie target and estimated date to reach your goal." }
      ],
      proTip: "A deficit of 500 calories per day usually leads to a safe and sustainable weight loss of about 0.5kg (1lb) per week."
    }
  },
  {
    slug: "mortgage-calculator",
    title: "Mortgage Calculator",
    short: "Plan your monthly mortgage payments with amortization.",
    description: "Calculate full mortgage terms, monthly interest, and principal payoff schedule for your new home loan.",
    icon: "Home", category: "finance",
    keywords: ["loan emi calculator", "mortgage emi", "car loan emi", "personal loan calculator"],
    relatedSlugs: ["loan-eligibility-calculator", "debt-payoff-calculator"],
    howTo: {
      steps: [
        { title: "Loan Principal", text: "Enter the total amount you intend to borrow from the bank or lender." },
        { title: "Interest & Tenure", text: "Input the annual interest rate and the duration of the loan in years." },
        { title: "Payment Breakdown", text: "Review your monthly EMI and the total interest payable over the full term." }
      ],
      proTip: "Choosing a shorter tenure significantly reduces your total interest cost, even if monthly EMIs are higher."
    }
  },
  {
    slug: "love-calculator",
    title: "Love Calculator",
    short: "Calculate the love compatibility percentage between two names.",
    description: "A fun, viral tool to test the compatibility between you and your crush. Enter two names and find out the match percentage!",
    icon: "Heart", category: "utility",
    keywords: ["love-calculator", "compatibility test", "lover match", "name matching"],
    relatedSlugs: ["age-calculator", "percentage-increase-calculator"],
    howTo: {
      steps: [
        { title: "Enter Names", text: "Type in your name and the name of your partner or crush." },
        { title: "Calculate", text: "Run the algorithm to find your name-resonance match percentage." },
        { title: "Check Resonance", text: "Review your compatibility level and share the fun results." }
      ],
      proTip: "Love is more than numbers! Use this for entertainment, but follow your intuition for real connection."
    }
  },
  {
    slug: "loan-emi-calculator",
    title: "Worldwide Loan & EMI Calculator",
    short: "Plan monthly EMI, total interest and amortization for any loan worldwide.",
    description: "Multi-currency debt forecaster for home, car, or personal loans. Includes full amortization schedules and interest savings analysis.",
    icon: "Banknote", category: "finance",
    keywords: ["emi calculator", "loan math", "amortization schedule", "mortgage forecaster", "debt strategy"],
    relatedSlugs: ["rent-vs-buy-calculator", "car-loan-vs-lease-calculator", "sip-investment-calculator"],
    howTo: {
      steps: [
        { title: "Loan Principal", text: "Enter the total amount you intend to borrow from the bank or lender." },
        { title: "Interest & Tenure", text: "Input the annual interest rate and the duration of the loan in years." },
        { title: "Payment Breakdown", text: "Review your monthly EMI and the total interest payable over the full term." }
      ],
      proTip: "Choosing a shorter tenure significantly reduces your total interest cost, even if monthly EMIs are higher."
    }
  },
  {
    slug: "income-tax-calculator",
    title: "Global Salary & Net Pay Calculator",
    short: "Estimate take-home pay and income tax across any jurisdiction.",
    description: "Universal income forecaster to see your net salary across tax brackets with deductions and standard allowances.",
    icon: "Receipt", category: "finance",
    keywords: ["salary calculator", "net pay", "income tax calculator", "take home pay", "tax brackets"],
    relatedSlugs: ["hourly-to-salary-calculator", "retirement-fire-calculator", "gst-vat-tax-calculator"],
    howTo: {
      steps: [
        { title: "Gross Salary", text: "Enter your annual or monthly base salary before any taxes or deductions." },
        { title: "Deductions", text: "Input your standard deductions, insurance, or other tax-saving investments." },
        { title: "Net Take-Home", text: "View your estimated tax liability and the final monthly salary in your pocket." }
      ],
      proTip: "Understanding your tax bracket helps you choose the right investment instruments to maximize tax savings."
    }
  },
  {
    slug: "sip-investment-calculator",
    title: "Monthly Investment (SIP) Calculator",
    short: "Project investment growth with monthly plans and compounding.",
    description: "Visualise how a recurring investment plan compounds over years with adjustable rate, tenure and step-up options.",
    icon: "TrendingUp", category: "finance",
    keywords: ["sip", "compound", "interest", "mutual fund", "investment", "recurring"],
    howTo: {
      steps: [
        { title: "Monthly SIP", text: "Enter the fixed amount you plan to invest regularly every month." },
        { title: "Return Rate", text: "Input the expected annual return rate (CAGR) based on your chosen funds." },
        { title: "Wealth Horizon", text: "Set the number of years you'll stay invested to see the total maturity value." }
      ],
      proTip: "Starting just 5 years earlier can nearly double your final maturity amount thanks to compounding cycles."
    }
  },
  {
    slug: "rent-vs-buy-calculator",
    title: "Rent vs Buy Calculator",
    short: "Compare the long-term cost of renting versus buying a home.",
    description: "Weigh down payment, EMI, rent inflation and home appreciation to see which option costs less over your time horizon.",
    icon: "ArrowLeftRight", category: "finance",
    keywords: ["rent", "buy", "mortgage", "real estate", "housing"],
    howTo: {
      steps: [
        { title: "Current Rent", text: "Enter your monthly rent and expected annual rent inflation rate." },
        { title: "Buy Price", text: "Input the property value, down payment, and mortgage interest rate." },
        { title: "Time Horizon", text: "Set how many years you plan to stay to see which option costs less." }
      ],
      proTip: "If you plan to stay for less than 5-7 years, renting is often more financially sound than buying."
    }
  },
  {
    slug: "gst-vat-tax-calculator",
    title: "GST, VAT & Sales Tax Calculator",
    short: "Calculate tax-inclusive and exclusive prices with custom rates.",
    description: "Quickly find the net price, tax amount, and total price for any product or service across standard and custom tax rates.",
    icon: "ReceiptSwissFranc", category: "finance",
    keywords: ["gst", "vat", "tax", "sales tax", "billing", "invoice"],
    howTo: {
      steps: [
        { title: "Base Amount", text: "Enter the net price or the gross total including tax." },
        { title: "Tax Rate", text: "Input the statutory GST/VAT rate applicable to your region or product." },
        { title: "Extract/Add", text: "Toggle between adding tax to a net price or extracting it from a total." }
      ],
      proTip: "Verify if your vendor's quote is tax-inclusive to avoid unexpected overhead on large invoices."
    }
  },
  {
    slug: "inflation-calculator",
    title: "Inflation Calculator",
    short: "See how purchasing power changes over time with inflation.",
    description: "Calculate the real value of money across years based on average inflation rates and see the cumulative price increase.",
    icon: "TrendingDown", category: "finance",
    keywords: ["inflation", "purchasing power", "money", "cpi", "value"],
    howTo: {
      steps: [
        { title: "Start Year", text: "Select the starting year and the amount of money you want to evaluate." },
        { title: "End Year", text: "Choose the target year to see how inflation has impacted the value." },
        { title: "Real Value", text: "View the equivalent purchasing power and total percentage increase." }
      ],
      proTip: "Historical inflation data helps you understand why your savings need to grow to keep their value."
    }
  },
  {
    slug: "fixed-deposit-calculator",
    title: "Savings Plan (FD) Calculator",
    short: "Calculate maturity amount and interest earned on savings.",
    description: "Plan your savings by calculating the interest and total maturity value for fixed deposits or time-based savings with various compounding options.",
    icon: "Lock", category: "finance",
    keywords: ["fd", "savings", "interest", "fixed deposit", "investment", "time deposit"],
    howTo: {
      steps: [
        { title: "Principal", text: "Enter the initial amount you want to lock into your savings plan." },
        { title: "Interest Rate", text: "Input the annual interest rate offered by your bank or financial institution." },
        { title: "Compounding", text: "Choose how often interest is compounded (Monthly/Quarterly/Yearly)." }
      ],
      proTip: "Reinvesting your interest payouts (cumulative FD) maximizes the power of compounding over time."
    }
  },
  {
    slug: "car-loan-vs-lease-calculator",
    title: "Car Loan vs Lease Calculator",
    short: "Compare the total cost of financing versus leasing a vehicle.",
    description: "Evaluate the monthly payments, total interest, and long-term equity of buying a car with a loan versus the lower payments and lack of ownership in a lease.",
    icon: "Car", category: "finance",
    keywords: ["car-loan", "lease", "vehicle finance", "auto loan"],
    howTo: {
      steps: [
        { title: "Vehicle Cost", text: "Enter the total purchase price of the car including taxes." },
        { title: "Loan Terms", text: "Input the down payment, interest rate, and loan duration in months." },
        { title: "Lease Details", text: "Enter the monthly lease payment and the residual value of the car." }
      ],
      proTip: "Leasing offers lower monthly payments, but buying builds equity and is cheaper over the long term."
    }
  },
  {
    slug: "retirement-fire-calculator",
    title: "Retirement & FIRE Calculator",
    short: "Calculate your number and timeline for financial independence.",
    description: "Project your retirement corpus and the age you can retire based on your current savings, expenses, and investment returns.",
    icon: "Flame", category: "finance",
    keywords: ["retirement", "fire", "early retirement", "pension", "savings"],
    howTo: {
      steps: [
        { title: "Current Status", text: "Enter your current age, planned retirement age, and existing savings balance." },
        { title: "Future Expenses", text: "Estimate your monthly post-retirement spending and expected inflation rate." },
        { title: "Corpus Goal", text: "View the total wealth required to sustain your lifestyle indefinitely without a salary." }
      ],
      proTip: "The '4% Rule' suggests that if you can live on 4% of your total savings per year, you are financially independent."
    }
  },
  {
    slug: "bmi-tdee-calculator",
    title: "Global BMI & TDEE Calculator",
    short: "Body Mass Index, BMR and Total Daily Energy Expenditure.",
    description: "A comprehensive health forecaster providing your BMI category, Basal Metabolic Rate and TDEE based on activity level.",
    icon: "ActivitySquare", category: "health",
    keywords: ["bmi", "tdee", "bmr", "calories", "health", "metabolism"],
    relatedSlugs: ["body-fat-percentage-calculator", "ideal-weight-calculator", "pregnancy-ovulation-calculator"],
    howTo: {
      steps: [
        { title: "Body Stats", text: "Enter your current weight, height, age, and sex for baseline calculations." },
        { title: "Activity Level", text: "Select how often you exercise to calculate your Total Daily Energy Expenditure (TDEE)." },
        { title: "Health Metrics", text: "Review your BMI category and the exact calories needed to maintain or change your weight." }
      ],
      proTip: "BMI is a good general indicator, but TDEE is the real key to managing your weight through nutrition."
    }
  },
  {
    slug: "body-fat-percentage-calculator",
    title: "Body Fat Percentage Calculator",
    short: "Estimate body fat percentage using Navy or BMI methods.",
    description: "Determine your body composition and fat-to-lean mass ratio using standardized photographic and anthropometric measurements.",
    icon: "Weight", category: "health",
    keywords: ["body fat", "composition", "fitness", "lean mass"],
    howTo: {
      steps: [
        { title: "Method Select", text: "Choose between the Navy Method (measurements) or BMI-based estimation." },
        { title: "Key Measurements", text: "Input your waist, neck, and hip (for women) measurements as accurately as possible." },
        { title: "Fat Analysis", text: "See your estimated body fat percentage and lean body mass breakdown." }
      ],
      proTip: "Measure yourself in the morning before eating or drinking for the most consistent body fat readings."
    }
  },
  {
    slug: "ideal-weight-calculator",
    title: "Ideal Weight Calculator",
    short: "Calculate your healthy weight range based on various formulas.",
    description: "Find your ideal body weight based on height, age, and sex using Robinson, Miller, Devine, and Hamwi formulas.",
    icon: "Weight", category: "health",
    keywords: ["ideal weight", "health", "fitness", "weight loss"],
    howTo: {
      steps: [
        { title: "Physique Info", text: "Enter your height and sex to begin the comparison against medical standards." },
        { title: "Formula Selection", text: "View results from Devine, Robinson, Miller, and Hamwi formulas side-by-side." },
        { title: "Target Range", text: "Find your healthy 'Green Zone' weight range based on the World Health Organization (WHO) standards." }
      ],
      proTip: "Ideal weight is a range, not a single number. Focus on staying within the healthy BMI zone of 18.5 to 25."
    }
  },
  {
    slug: "macro-nutrient-calculator",
    title: "Macro Calculator",
    short: "Calculate daily protein, carb and fat targets for your goals.",
    description: "Discover your optimal macronutrient split based on your TDEE and fitness goals (weight loss, maintenance, or muscle gain).",
    icon: "Utensils", category: "health",
    keywords: ["macros", "nutrition", "protein", "carbs", "diet"],
    howTo: {
      steps: [
        { title: "Calorie Base", text: "Enter your daily calorie target or use our built-in TDEE estimator." },
        { title: "Goal Split", text: "Choose your macro split (e.g., High Protein for muscle, Keto for low carb, or Balanced)." },
        { title: "Gram Targets", text: "Get the exact grams of protein, fats, and carbs you should eat every day." }
      ],
      proTip: "Prioritize your protein goal first, then fill the remaining calories with healthy fats and complex carbohydrates."
    }
  },
  {
    slug: "intermittent-fasting-calculator",
    title: "Intermittent Fasting Calculator",
    short: "Plan your fasting and eating windows for weight loss.",
    description: "Calculate your 16:8, 18:6, or 20:4 fasting schedules and track your progress toward your health and weight loss targets.",
    icon: "Timer", category: "health",
    keywords: ["fasting", "intermittent fasting", "weight loss", "diet"],
    howTo: {
      steps: [
        { title: "Fasting Style", text: "Select your preferred protocol like 16:8 (standard) or 20:4 (OMAD)." },
        { title: "Start Time", text: "Input your last meal time to set the countdown for your current fasting window." },
        { title: "Schedule View", text: "See exactly when your next eating window opens and how much time remains." }
      ],
      proTip: "Drinking black coffee or tea during your fasting window can help suppress hunger without breaking the fast."
    }
  },
  {
    slug: "blood-alcohol-content-calculator",
    title: "Blood Alcohol Content (BAC) Calculator",
    short: "Estimate your blood alcohol level after consuming drinks.",
    description: "Calculate your estimated BAC based on your weight, sex, the number of drinks consumed, and the time elapsed since ingestion.",
    icon: "Beer", category: "health",
    keywords: ["bac", "alcohol", "drinking", "safety", "sobriety"],
    howTo: {
      steps: [
        { title: "Drinking History", text: "Enter the number of drinks, the type of alcohol, and your body weight." },
        { title: "Time Elapsed", text: "Set how many hours have passed since your first drink to account for metabolism." },
        { title: "Sobriety Target", text: "View your estimated BAC and the approximate time until you return to 0.00%." }
      ],
      proTip: "BAC estimates are for educational use only. Never drive if you have consumed alcohol, regardless of the calculated score."
    }
  },
  {
    slug: "smoking-cost-calculator",
    title: "Smoking Cost Calculator",
    short: "Calculate the financial and health cost of smoking.",
    description: "See how much money you spend on cigarettes over time and estimate the life-expectancy impact of your smoking habits.",
    icon: "Cigarette", category: "health",
    keywords: ["smoking", "cost", "health", "quit smoking", "savings"],
    howTo: {
      steps: [
        { title: "Smoking Habits", text: "Enter how many cigarettes you smoke per day and the cost per pack." },
        { title: "Time Horizon", text: "View the cumulative financial drain over a month, year, and decade." },
        { title: "Health Impact", text: "See how many days of life are potentially lost and the benefits of quitting today." }
      ],
      proTip: "Quitting for just one year can save enough money to pay for a high-end vacation or a significant debt payment."
    }
  },
  {
    slug: "pregnancy-ovulation-calculator",
    title: "Pregnancy & Ovulation Calculator",
    short: "Estimate due date, gestational week and fertile window.",
    description: "Calculate your estimated due date from last menstrual period and project the ovulation window for cycle planning.",
    icon: "Baby", category: "health",
    keywords: ["pregnancy", "due date", "ovulation", "fertile", "lmp"],
    howTo: {
      steps: [
        { title: "Last Period", text: "Enter the first day of your last menstrual period (LMP) and your average cycle length." },
        { title: "Key Windows", text: "Find your most fertile days and the predicted date of ovulation." },
        { title: "Due Date", text: "Get your estimated due date (EDD) and track your current gestational week." }
      ],
      proTip: "Most conceptions happen within a 5-day window ending on the day of ovulation. Tracking basal temperature can help increase accuracy."
    }
  },
  {
    slug: "water-intake-sleep-calculator",
    title: "Water Intake & Sleep Calculator",
    short: "Daily hydration target and ideal bedtime windows.",
    description: "Recommended water intake based on weight and activity, plus optimal bed/wake times aligned with 90-minute sleep cycles.",
    icon: "Droplet", category: "health",
    keywords: ["water", "hydration", "sleep", "bedtime", "cycle"],
    howTo: {
      steps: [
        { title: "Hydration Base", text: "Input your weight and daily activity level to find your optimal water target." },
        { title: "Wake Up Time", text: "Set your desired wake-up time to calculate 90-minute sleep cycles." },
        { title: "Daily Targets", text: "Review when to sleep and how much water to drink for peak energy levels." }
      ],
      proTip: "Wake up at the end of a sleep cycle (e.g., after 7.5 or 9 hours) to avoid the 'groggy' feeling of sleep inertia."
    }
  },
  {
    slug: "profit-margin-calculator",
    title: "Profit Margin Calculator",
    short: "Calculate markup, margin and revenue for retail products.",
    description: "Find your gross profit margin and markup percentages to set the right selling price for your business products.",
    icon: "TrendingUp", category: "business",
    keywords: ["profit", "margin", "markup", "retail", "business"],
    howTo: {
      steps: [
        { title: "Item Cost", text: "Enter the total cost to produce or acquire one unit of your product." },
        { title: "Selling Price", text: "Input the price at which you intend to sell the item to customers." },
        { title: "Analyze Margin", text: "Review your gross profit margin and markup to ensure profitability." }
      ],
      proTip: "A healthy margin allows for marketing and operations; aim for sustainable growth over low-price volume."
    }
  },
  {
    slug: "break-even-point-calculator",
    title: "Break-Even Point Calculator",
    short: "Find the unit sales needed to cover your total costs.",
    description: "Calculate the exact number of units you need to sell to reach zero profit/loss based on fixed and variable costs.",
    icon: "Target", category: "business",
    keywords: ["break even", "startup", "accounting", "profit", "sales"],
    howTo: {
      steps: [
        { title: "Fixed Costs", text: "Enter your total overhead costs like rent, salaries, and insurance." },
        { title: "Unit Costs", text: "Input the variable cost to produce one unit and its planned selling price." },
        { title: "Sales Goal", text: "See exactly how many units you must sell to reach zero profit/loss." }
      ],
      proTip: "Lowering variable costs per unit is often more effective than raising prices to reach break-even faster."
    }
  },
  {
    slug: "crypto-investment-profit-calculator",
    title: "Crypto Profit Calculator",
    short: "Calculate potential gains or losses for your crypto trades.",
    description: "Estimate your cryptocurrency investment returns by entering buy price, sell price, and investment amount, including fees.",
    icon: "Coins", category: "business",
    keywords: ["crypto", "profit", "bitcoin", "investment", "trading"],
    howTo: {
      steps: [
        { title: "Investment Details", text: "Enter your initial investment amount and the purchase price of the cryptocurrency." },
        { title: "Sell Price", text: "Input the price at which you plan to sell or have already sold your assets." },
        { title: "Profit/Loss", text: "Review your total return, percentage gain, and the impact of trading fees on your net profit." }
      ],
      proTip: "Always factor in exchange withdrawal and trading fees, as they can significantly eat into small profit margins."
    }
  },
  {
    slug: "hourly-to-salary-calculator",
    title: "Hourly to Salary Converter",
    short: "Convert hourly wage to daily, weekly and annual salary.",
    description: "Instantly convert your hourly rate into annual, monthly, and weekly salary equivalents based on your working hours.",
    icon: "Banknote", category: "business",
    keywords: ["salary", "wage", "hourly", "compensation"],
    howTo: {
      steps: [
        { title: "Hourly Rate", text: "Enter your base hourly wage and the average number of hours you work per week." },
        { title: "Work Schedule", text: "Input any overtime hours or unpaid weeks per year to refine the annual estimate." },
        { title: "Income View", text: "See your equivalent daily, weekly, monthly, and annual salary breakdown instantly." }
      ],
      proTip: "If you work irregular hours, use your average weekly hours from the last three months for a more realistic annual projection."
    }
  },
  {
    slug: "age-calculator",
    title: "Exact Age & Time Interval Calculator",
    short: "Calculate your exact age in years, months, days, and seconds.",
    description: "Precision chronological tool to find your exact age and life milestones. Accounts for leap years and different month lengths with down-to-the-second accuracy.",
    icon: "Clock", category: "utility",
    keywords: ["age calculator", "date of birth calculator", "chronological age", "how old am i", "age in days", "age calculator by date of birth", "birthday calculator", "exact age"],
    howTo: {
      steps: [
        { title: "Date of Birth", text: "Select your month, day, and year of birth from the date picker." },
        { title: "Reference Date", text: "Choose today's date or a future date to see how old you will be then." },
        { title: "Age Breakdown", text: "View your exact age in years, months, days, and even the remaining time until your next birthday." }
      ],
      proTip: "Use the 'Next Birthday' section to see exactly which day of the week your upcoming celebration falls on."
    }
  },
  {
    slug: "credit-card-payoff-calculator",
    title: "Credit Card Payoff Calculator",
    short: "Plan how to clear your credit card debt efficiently.",
    description: "Plan your debt-free journey by calculating the time and interest needed to pay off your credit card balance.",
    icon: "CreditCard", category: "finance",
    keywords: ["credit card", "debt", "interest", "payoff", "credit card payoff"],
    howTo: {
      steps: [
        { title: "Card Balance", text: "Enter your current credit card balance and the annual interest rate (APR)." },
        { title: "Monthly Payment", text: "Input how much you plan to pay each month to see your debt-free timeline." },
        { title: "Interest Cost", text: "Review the total interest you will pay and how much time you save by increasing your payment." }
      ],
      proTip: "Paying even 10% more than the minimum payment can save you thousands in interest over the life of the debt."
    }
  },
  {
    slug: "date-plus-minus-calculator",
    title: "Date +/- Days Calculator",
    short: "Find a future or past date by adding/subtracting days.",
    description: "Calculate what date it will be after a certain number of days, weeks, or months, or see the gap between two specific dates.",
    icon: "CalendarPlus", category: "utility",
    keywords: ["date calculator", "add days", "subtract days", "deadline"],
    howTo: {
      steps: [
        { title: "Starting Date", text: "Pick the initial date you want to start your calculation from." },
        { title: "Add/Subtract", text: "Enter the number of years, months, and days you wish to add or remove." },
        { title: "Resulting Date", text: "Instantly view the final date and the day of the week it falls on." }
      ],
      proTip: "This tool is perfect for calculating project deadlines, medical follow-ups, or warranty expiration dates."
    }
  },
  {
    slug: "business-working-days-calculator",
    title: "Working Days Calculator",
    short: "Count business days between dates, excluding weekends.",
    description: "Calculate the number of business days (Mon-Fri) between any two dates, with options to exclude holiday counts.",
    icon: "CalendarCheck", category: "utility",
    keywords: ["business days", "working days", "deadline", "schedule"],
    howTo: {
      steps: [
        { title: "Date Range", text: "Select the start and end dates for the period you want to measure." },
        { title: "Exclude Days", text: "Choose which days of the week to count as working days (typically Mon-Fri)." },
        { title: "Working Total", text: "See the total number of business days, excluding weekends and optionally holidays." }
      ],
      proTip: "Use this to track lead times or project durations where weekends and public holidays do not count toward progress."
    }
  },
  {
    slug: "unit-converter",
    title: "Precision Unit Converter",
    short: "Convert length, weight, speed and volume units.",
    description: "Fast bidirectional conversion across the most common metric and imperial units with 8-digit precision.",
    icon: "Ruler", category: "utility",
    keywords: ["unit converter", "metric", "imperial", "conversion", "measurement"],
    howTo: {
      steps: [
        { title: "Category", text: "Select the type of unit you want to convert (Length, Weight, Speed, etc.)." },
        { title: "Input Value", text: "Enter the number in the source unit to see instant conversions across all other units." },
        { title: "Precision", text: "View high-precision results for both metric and imperial systems side-by-side." }
      ],
      proTip: "You can type in any box; the converter is bidirectional and updates all units simultaneously."
    }
  },
  {
    slug: "scientific-calculator-online",
    title: "Scientific Calculator",
    short: "Advanced math with trig, logs and power functions.",
    description: "A clean, high-precision web calculator for logarithms, trigonometry, roots and other complex mathematical operations.",
    icon: "Calculator", category: "utility",
    keywords: ["scientific calculator", "math", "trig", "log", "equations"],
    howTo: {
      steps: [
        { title: "Basic Math", text: "Use the number pad and operators for standard addition, subtraction, and multiplication." },
        { title: "Advanced Functions", text: "Access sine, cosine, logarithms, and square roots using the dedicated function keys." },
        { title: "Result Memory", text: "The calculator maintains a history of your operations for easy reference and multi-step math." }
      ],
      proTip: "Ensure your trig functions are set to the correct mode (Degrees or Radians) before performing complex engineering math."
    }
  },
  {
    slug: "percentage-increase-calculator",
    title: "Percentage Calculator",
    short: "Quickly solve percentage increase, decrease and differences.",
    description: "A versatile tool to find the percentage of a number, the percentage difference between two numbers, and percentage growth or decline.",
    icon: "Percent", category: "utility",
    keywords: ["percentage", "math", "increase", "decrease", "ratio"],
    howTo: {
      steps: [
        { title: "Select Mode", text: "Choose the type of percentage problem you need to solve (e.g., % of X, or X is what % of Y)." },
        { title: "Enter Numbers", text: "Input your values into the corresponding boxes to get an instant calculation." },
        { title: "View Result", text: "See the final percentage, the amount of change, and the step-by-step math breakdown." }
      ],
      proTip: "The 'Percentage Change' mode is ideal for tracking stock price movements or year-over-year growth metrics."
    }
  },
  {
    slug: "word-character-counter-tool",
    title: "Word & Character Counter",
    short: "Instant count for words, characters, sentences and reading time.",
    description: "A clean, private text analyzer that calculates word count, character count (with/without spaces), and estimated reading time.",
    icon: "FileType", category: "utility",
    keywords: ["word count", "character count", "writing", "editor", "seo"],
    howTo: {
      steps: [
        { title: "Paste Text", text: "Type or paste your content directly into the main text area." },
        { title: "Live Analytics", text: "Watch the word, character, and sentence counts update in real-time as you type." },
        { title: "Reading Time", text: "Review the estimated reading and speaking time to optimize your content for its audience." }
      ],
      proTip: "For SEO, aim for at least 1,000 words for long-form articles, ensuring your character count doesn't exceed social media limits."
    }
  },
  {
    slug: "gpa-to-percentage-calculator",
    title: "GPA & Percentage Calculator",
    short: "Compute weighted GPA, CGPA and percentage equivalents.",
    description: "Add courses with credit hours and grades to compute weighted GPA on the 4.0 scale, with percentage and CGPA conversions.",
    icon: "GraduationCap", category: "education",
    keywords: ["gpa", "cgpa", "percentage", "grade", "school"],
    howTo: {
      steps: [
        { title: "Add Courses", text: "Enter your course names, credit hours, and the grades earned (A, B, C, etc.)." },
        { title: "Calculate GPA", text: "The tool automatically weights your grades by credit hours to find your semester GPA." },
        { title: "Convert to %", text: "View your equivalent percentage score based on common 4.0 or 5.0 scale university standards." }
      ],
      proTip: "Consistent high performance in 3 or 4-credit courses has the biggest impact on your overall CGPA."
    }
  },
  {
    slug: "one-rep-max-calculator",
    title: "1RM (One Rep Max) Calculator",
    short: "Estimate your one-rep max for any lift.",
    description: "Calculate your estimated maximum weight for one repetition based on your performance in sub-maximal sets.",
    icon: "Dumbbell", category: "health",
    keywords: ["1rm", "one rep max", "gym", "lifting", "strength"],
    howTo: {
      steps: [
        { title: "Weight Lifted", text: "Enter the weight you used for a set and the number of repetitions performed." },
        { title: "Max Estimates", text: "View your estimated 1-Rep Max based on Epley, Brzycki, and Lander formulas." },
        { title: "Training Zones", text: "Review the percentage-based breakdown (e.g., 70%, 80%) for your future workouts." }
      ],
      proTip: "Using 3-5 reps for your calculation is generally more accurate than using 10+ reps for estimating 1-Rep Max."
    }
  },
  {
    slug: "freelance-rate-calculator",
    title: "Freelance Rate Calculator",
    short: "Determine your ideal hourly or project rate.",
    description: "Calculate what you should charge as a freelancer to cover your expenses, taxes, and desired profit.",
    icon: "BadgeDollarSign", category: "business",
    keywords: ["freelance", "hourly rate", "pricing", "business", "consulting"],
    howTo: {
      steps: [
        { title: "Living Expenses", text: "Enter your monthly personal and business overhead costs (rent, software, insurance)." },
        { title: "Billable Hours", text: "Input how many hours you actually plan to bill per week after admin and marketing." },
        { title: "Ideal Rate", text: "View the minimum hourly rate you need to charge to meet your savings and tax goals." }
      ],
      proTip: "Don't forget to factor in 'non-billable' time like client calls and proposal writing when setting your rate."
    }
  },
  {
    slug: "qr-code-generator",
    title: "QR Code Generator",
    short: "Generate custom QR codes for URLs and text.",
    description: "Create high-quality, downloadable QR codes for your website, contact info, or any custom text instantly.",
    icon: "QrCode", category: "utility",
    keywords: ["qr code", "generator", "marketing", "link", "barcode"],
    relatedSlugs: ["wifi-qr-code-generator", "vcard-qr-code-generator", "whatsapp-qr-code-generator"],
    howTo: {
      steps: [
        { title: "Input Content", text: "Enter the URL, text, or data you want to encode into the QR code." },
        { title: "Customize Design", text: "Choose a premium frame, adjust colors, and select a pattern to match your brand." },
        { title: "Export High-Res", text: "Click Download to save your customized QR code in high-fidelity PNG format." }
      ],
      proTip: "Use a high-contrast color scheme (e.g., black on white) to ensure the QR code remains scannable across all devices."
    }
  },
  {
    slug: "wifi-qr-code-generator",
    title: "WiFi QR Code Generator",
    short: "Generate a 'Scan to Join' QR code for your WiFi network.",
    description: "Instantly share your WiFi network with guests. Generate a secure QR code that automatically connects devices to your SSID without typing a password.",
    icon: "Wifi", category: "utility",
    keywords: ["wifi qr code", "share wifi qr", "scan to join wifi", "wifi password qr generator"],
    relatedSlugs: ["qr-code-generator", "password-generator"],
    howTo: {
      steps: [
        { title: "Network Details", text: "Enter your WiFi SSID (Name), Password, and select the encryption type (WPA/WEP)." },
        { title: "Visual Branding", text: "Customize the QR frame and dots to match your home or office aesthetic." },
        { title: "Print & Share", text: "Download the QR code and print it for guests to scan and join instantly." }
      ],
      proTip: "Make sure your WiFi name (SSID) is exactly as it appears in your router settings, including capital letters."
    }
  },
  {
    slug: "vcard-qr-code-generator",
    title: "vCard QR Code Generator",
    short: "Create a digital business card QR code for contact sharing.",
    description: "Generate a professional vCard QR code containing your name, phone, and email. One scan allows others to save your contact details directly to their phone.",
    icon: "Contact2", category: "business",
    keywords: ["vcard qr code", "digital business card qr", "contact share qr", "business card generator"],
    relatedSlugs: ["qr-code-generator", "freelance-rate-calculator"],
    hideCurrencySwitcher: true,
    howTo: {
      steps: [
        { title: "Contact Info", text: "Fill in your Name, Title, Phone, Email, and Website details." },
        { title: "Personal Brand", text: "Add your logo or a professional frame to make your digital card stand out." },
        { title: "Network Smart", text: "Download and share your QR code on phone screens or printed business cards." }
      ],
      proTip: "VCard QR codes can hold a lot of data. Keep it to essential contact info for the fastest scanning speed."
    },
  },
  {
    slug: "whatsapp-qr-code-generator",
    title: "WhatsApp QR Code Generator",
    short: "Generate a QR code for direct WhatsApp chat.",
    description: "Create a direct link to your WhatsApp chat. Generate a QR code that automatically opens WhatsApp with your number and a pre-filled message.",
    icon: "MessageSquare", category: "utility",
    keywords: ["whatsapp qr code", "direct whatsapp link qr", "whatsapp business qr", "chat qr generator"],
    relatedSlugs: ["qr-code-generator", "social-share-preview-tool"],
    howTo: {
      steps: [
        { title: "WhatsApp Number", text: "Enter your phone number including country code and an optional pre-filled message." },
        { title: "Style Preview", text: "Choose a WhatsApp-friendly theme or customize colors to match your chat brand." },
        { title: "Launch Chat", text: "Download and share your QR code to let customers chat with you in one scan." }
      ],
      proTip: "A friendly pre-filled message (like 'Hi, I have a question about...') helps start conversations more easily."
    }
  },
  {
    slug: "crypto-qr-code-generator",
    title: "Crypto Address QR Code Generator",
    short: "Generate QR codes for Bitcoin and Ethereum wallets.",
    description: "Share your cryptocurrency wallet addresses securely. Generate high-fidelity QR codes for BTC, ETH, and other digital assets for fast, error-free payments.",
    icon: "Coins", category: "finance",
    keywords: ["crypto qr code", "bitcoin address qr", "eth wallet qr", "cryptocurrency payment qr"],
    relatedSlugs: ["qr-code-generator", "crypto-investment-profit-calculator"],
    hideCurrencySwitcher: true,
    howTo: {
      steps: [
        { title: "Wallet Address", text: "Select your cryptocurrency and paste your public wallet address carefully." },
        { title: "Security Check", text: "Verify the address matches your wallet exactly before generating the code." },
        { title: "Recieve Funds", text: "Download your QR code and show it to senders for error-free transactions." }
      ],
      proTip: "Always use a High Error Correction (ECC) level for crypto QR codes to ensure safety during transactions."
    },
  },
  {
    slug: "running-pace-calculator",
    title: "Running Pace Calculator",
    short: "Calculate pace, time, or distance for your runs.",
    description: "Plan your training or race strategy by calculating your split times and average pace for any distance.",
    icon: "Timer", category: "health",
    keywords: ["running", "pace", "marathon", "fitness", "training"],
    howTo: {
      steps: [
        { title: "Two Values", text: "Enter any two values (Time, Distance, or Pace) to calculate the third." },
        { title: "Split Analysis", text: "Review your average speed and pace per kilometer or mile." },
        { title: "Race Predictor", text: "Project your finish times for common distances like 5K, 10K, Half, and Full Marathons." }
      ],
      proTip: "Consistency is key. Use these pace targets to ensure your easy runs stay easy and your speed work stays fast."
    }
  },
  {
    slug: "password-generator",
    title: "Password Generator",
    short: "Create secure, random passwords instantly.",
    description: "Generate cryptographically strong passwords with custom length and character requirements for maximum security.",
    icon: "Lock", category: "utility",
    keywords: ["password", "security", "random", "generator", "safe"],
    howTo: {
      steps: [
        { title: "Length & Complexity", text: "Choose your desired password length and toggle uppercase, numbers, and symbols." },
        { title: "Generate", text: "Click the generate button to create a unique, cryptographically secure password." },
        { title: "Copy & Use", text: "Instantly copy your new password to your clipboard for use in any application." }
      ],
      proTip: "A password length of 16 characters with mixed symbols is currently considered the industry standard for high security."
    }
  },
  {
    slug: "tax-bracket-calculator",
    title: "Tax Bracket Calculator",
    short: "See how your income is taxed across brackets.",
    description: "Visualize how progressive tax brackets apply to your income and find your effective tax rate.",
    icon: "Percent", category: "finance",
    keywords: ["tax", "brackets", "income tax", "effective tax rate", "finance"],
    howTo: {
      steps: [
        { title: "Income Amount", text: "Enter your total taxable income before any deductions or credits." },
        { title: "View Brackets", text: "See exactly how your income is divided across different marginal tax rates." },
        { title: "Effective Rate", text: "Review your 'Effective Tax Rate' which is the actual percentage of income you pay." }
      ],
      proTip: "Your marginal tax bracket only applies to the income within that range, not your entire salary."
    }
  },
  {
    slug: "pregnancy-week-calculator",
    title: "Pregnancy Week Calculator",
    short: "Track your pregnancy progress week by week.",
    description: "Calculate your current week of pregnancy, trimester, and key developmental milestones for your baby.",
    icon: "Baby", category: "health",
    keywords: ["pregnancy", "weeks", "trimester", "due date", "baby"],
    howTo: {
      steps: [
        { title: "LMP Date", text: "Enter the start date of your last period or your known due date." },
        { title: "Current Week", text: "Find out exactly which week and day of pregnancy you are in today." },
        { title: "Development", text: "Read about your baby's current size and major developmental milestones for this week." }
      ],
      proTip: "Pregnancy is calculated from the first day of your last period, meaning you are technically '2 weeks pregnant' when you conceive."
    }
  },
  {
    slug: "academic-grade-calculator",
    title: "Academic Grade & Final Exam Calculator",
    short: "Calculate the grade you need on your final exam to reach your target.",
    description: "Determine your current weighted average and calculate exactly what you need on your final exam to achieve your desired course grade.",
    icon: "GraduationCap", category: "education",
    keywords: ["grade calculator", "final grade", "weighted average", "exam score", "school grades", "academic performance"],
    howTo: {
      steps: [
        { title: "Current Grade", text: "Enter your current percentage or grade and its weight in the final score." },
        { title: "Exam Goal", text: "Input the target grade you want to achieve for the entire course." },
        { title: "Required Score", text: "The tool will tell you exactly what you need to score on your final exam to hit your goal." }
      ],
      proTip: "Enter your current assignments as they come in to keep a live track of what your final exam 'safety net' is."
    },
    relatedSlugs: ["gpa-to-percentage-calculator", "word-character-counter-tool"],
  },
  // Batch: Static Logic Tools (Pakistan)
  {
    slug: "hec-cgpa-converter",
    title: "HEC CGPA to Percentage Calculator",
    short: "Convert CGPA to percentage using HEC and university-specific scales.",
    description: "Official CGPA to percentage converter for Pakistani universities including NUST, FAST, LUMS, and UET based on HEC guidelines.",
    icon: "GraduationCap", category: "education",
    keywords: ["hec cgpa converter", "cgpa to percentage pakistan", "nust gpa calculator", "fast university gpa", "hec grading scale"],
    howTo: {
      steps: [
        { title: "Select University", text: "Choose your university or the standard HEC 4.0 scale from the dropdown menu." },
        { title: "Enter CGPA", text: "Input your current Cumulative Grade Point Average (CGPA) as per your transcript." },
        { title: "View Percentage", text: "Get your official HEC-equivalent percentage for job or scholarship applications." }
      ],
      proTip: "Universities like NUST and FAST have slightly different internal conversion tables; always select your specific institution."
    },
    relatedSlugs: ["academic-grade-calculator", "gpa-to-percentage-calculator"],
    hideCurrencySwitcher: true,
  },
  {
    slug: "board-percentage-calculator",
    title: "Matric & Inter Percentage Calculator",
    short: "Calculate percentage and grade for all Pakistani education boards.",
    description: "Result calculator for Matric and Intermediate students across Punjab, Sindh, KPK, and Federal boards with grade and division analysis.",
    icon: "FileText", category: "education",
    keywords: ["board result calculator", "matric percentage", "inter percentage calculator", "punjab board grading", "federal board marks"],
    howTo: {
      steps: [
        { title: "Enter Marks", text: "Input your obtained marks and the total marks for your Matric or Intermediate exam." },
        { title: "Grade Analysis", text: "Instantly see your percentage, GPA, and the division (1st, 2nd, 3rd) you achieved." },
        { title: "Board Standards", text: "The tool uses the standardized grading system applicable to all BISE boards in Pakistan." }
      ],
      proTip: "A percentage above 80% is usually required to secure a position in the top-tier merit lists for engineering or medical colleges."
    },
    hideCurrencySwitcher: true,
  },
  {
    slug: "pakistan-inflation-calculator",
    title: "Pakistan Inflation & Purchasing Power",
    short: "Calculate the real value of PKR over time using historical data.",
    description: "Compare the value of Pakistani Rupee (PKR) between any two years from 2010 to 2025 using historical CPI data.",
    icon: "TrendingUp", category: "finance",
    keywords: ["pakistan inflation calculator", "pkr purchasing power", "inflation rate pakistan history", "value of 1000 pkr"],
    howTo: {
      steps: [
        { title: "Starting Year", text: "Select a year from the past (e.g., 2015) and an amount in PKR." },
        { title: "Target Year", text: "Choose a later year or the current date to see how the value has changed." },
        { title: "Real Value", text: "Review the adjusted purchasing power and the cumulative inflation percentage for that period." }
      ],
      proTip: "Understanding inflation helps you see why keeping cash under a mattress loses value compared to gold or real estate."
    },
    hideCurrencySwitcher: true,
  },
  {
    slug: "loan-eligibility-calculator-pakistan",
    title: "Pakistan Loan Eligibility Calculator",
    short: "Check how much home or car loan you can get based on your salary.",
    description: "Calculate your maximum loan amount and monthly EMI eligibility using standard Pakistani bank DTI (Debt-to-Income) ratios.",
    icon: "BadgeCheck", category: "finance",
    keywords: ["loan eligibility pakistan", "home loan calculator pakistan", "car loan salary requirement", "bank loan eligibility"],
    howTo: {
      steps: [
        { title: "Monthly Income", text: "Enter your net take-home salary and any existing loan EMIs you are currently paying." },
        { title: "Loan Details", text: "Select the interest rate and the number of years you want to pay back the loan." },
        { title: "Check Limit", text: "The tool calculates your maximum loan amount based on the bank's 40-50% DTI limit." }
      ],
      proTip: "Banks in Pakistan generally prefer that your total debt payments do not exceed 40% of your net monthly income."
    },
    hideCurrencySwitcher: true,
  },
  // Batch: Static Logic Tools (Worldwide)
  {
    slug: "debt-payoff-calculator",
    title: "Debt Snowball vs Avalanche Calculator",
    short: "Compare the fastest way to pay off your debts and save interest.",
    description: "Strategic debt payoff tool to compare the Snowball method (lowest balance first) vs Avalanche method (highest interest first).",
    icon: "Target", category: "finance",
    keywords: ["debt snowball vs avalanche", "debt payoff calculator", "get out of debt tool", "credit card payoff strategy"],
    howTo: {
      steps: [
        { title: "List Debts", text: "Enter all your debts, including balances, interest rates, and minimum monthly payments." },
        { title: "Choose Strategy", text: "Toggle between 'Snowball' (lowest balance first) and 'Avalanche' (highest interest first)." },
        { title: "Payoff Plan", text: "See your debt-free date and the total interest saved under each specific strategy." }
      ],
      proTip: "The Avalanche method saves the most money, but the Snowball method provides faster psychological 'wins' that help you stay motivated."
    }
  },
  {
    slug: "sleep-debt-calculator",
    title: "Sleep Debt & Recovery Calculator",
    short: "Calculate your weekly sleep deficit and get a recovery plan.",
    description: "Track your sleep hours over the week to identify cumulative sleep debt and get a scientifically-backed recovery schedule.",
    icon: "Moon", category: "health",
    keywords: ["sleep debt calculator", "sleep deficit tool", "how to recover sleep", "circadian rhythm tracker"],
    howTo: {
      steps: [
        { title: "Sleep Goal", text: "Enter your target sleep hours per night (usually 7-9 hours for adults)." },
        { title: "Weekly Log", text: "Input the actual hours you slept for each day of the past week." },
        { title: "Recovery Plan", text: "See your total sleep debt and get advice on how to repay it safely over the next week." }
      ],
      proTip: "You can't recover all sleep debt on a single weekend. Try adding 1 extra hour per night for a full week instead."
    }
  },
  {
    slug: "blood-sugar-hba1c-converter",
    title: "Blood Sugar to HbA1c Converter",
    short: "Convert average blood glucose levels to HbA1c and assess risk.",
    description: "Clinical converter to estimate your HbA1c percentage from average daily blood sugar readings with a diabetes risk chart.",
    icon: "Droplets", category: "health",
    keywords: ["blood sugar to hba1c", "glucose converter", "diabetes risk assessment", "average blood sugar hba1c"],
    howTo: {
      steps: [
        { title: "Glucose Unit", text: "Choose between mg/dL (common in US/PK) and mmol/L (common in UK/Canada)." },
        { title: "Average Reading", text: "Enter your average blood sugar level from the last 90 days." },
        { title: "A1C Estimate", text: "View your estimated HbA1c percentage and where it falls on the risk scale." }
      ],
      proTip: "HbA1c reflects your average sugar levels over 2-3 months. It is the gold standard for tracking long-term glucose control."
    }
  },
  {
    slug: "net-worth-tracker",
    title: "Personal Net Worth Calculator",
    short: "Track your total assets and liabilities in one place.",
    description: "Comprehensive net worth calculator with categories for property, savings, investments, and debts for a clear financial snapshot.",
    icon: "Briefcase", category: "finance",
    keywords: ["net worth calculator", "track assets and liabilities", "personal balance sheet", "financial snapshot"],
    howTo: {
      steps: [
        { title: "List Assets", text: "Enter the value of everything you own, including cash, property, gold, and investments." },
        { title: "List Liabilities", text: "Input all your outstanding debts, such as loans, credit card balances, and mortgages." },
        { title: "Net Position", text: "View your total net worth and see a percentage breakdown of your asset allocation." }
      ],
      proTip: "Update your net worth every quarter to track your long-term wealth growth and financial health trends."
    }
  },
  {
    slug: "personal-carbon-footprint-calculator",
    title: "Personal Carbon Footprint Calculator",
    short: "Estimate your annual carbon emissions and environmental impact.",
    description: "Calculate your CO2 emissions from flights, driving, home energy, and diet with reduction tips and impact breakdown.",
    icon: "Leaf", category: "utility",
    keywords: ["carbon footprint calculator", "co2 emissions tool", "environmental impact calculator", "reduce carbon footprint"],
    howTo: {
      steps: [
        { title: "Transport Habits", text: "Enter your annual mileage for driving and frequency of short vs long-haul flights." },
        { title: "Home Energy", text: "Input your average monthly electricity and gas usage to calculate utility-based emissions." },
        { title: "Lifestyle Choices", text: "Select your primary diet type and waste habits to see their impact on your footprint." }
      ],
      proTip: "Reducing just one long-haul flight per year can lower your individual carbon footprint by up to 2 tons of CO2."
    }
  },
  {
    slug: "solar-roi-simulator-pakistan",
    title: "Solar ROI & Net-Metering Simulator",
    short: "Simulate your solar savings and calculate payback period for your home.",
    description: "Advanced energy simulation for 2026. Calculate monthly savings, export credits, and system ROI based on current Pakistani electricity tariffs and net-metering policies.",
    icon: "Sun", category: "finance",
    keywords: ["solar roi calculator pakistan", "net metering simulator", "solar payback period", "electricity bill savings solar", "solar inverter sizing"],
    howTo: {
      steps: [
        { title: "Bill History", text: "Enter your average monthly electricity bill and current peak/off-peak unit rates." },
        { title: "System Size", text: "Select your planned solar system capacity (e.g., 5kW, 10kW) and the total installation cost." },
        { title: "ROI Timeline", text: "Review your estimated monthly savings and the years required to recover your initial investment." }
      ],
      proTip: "Factor in a 10% annual increase in electricity tariffs to get a more realistic (and often faster) payback period."
    },
    hideCurrencySwitcher: true,
  },
  {
    slug: "freelance-fee-optimizer",
    title: "Freelance Fee & Arbitrage Optimizer",
    short: "Compare platform fees and withdrawal paths to maximize your earnings.",
    description: "Are you losing money to hidden bank fees? Use our optimizer to compare Upwork, Fiverr, and Direct Client fees against Wise, Payoneer, and Bank Wire withdrawal paths.",
    icon: "Coins", category: "finance",
    keywords: ["freelance fee calculator", "upwork vs fiverr fees", "payoneer withdrawal fee pakistan", "wise vs payoneer", "bank exchange rate calculator"],
    howTo: {
      steps: [
        { title: "Platform Choice", text: "Select the freelance platform you use (Upwork, Fiverr, etc.) and enter your contract value." },
        { title: "Withdrawal Path", text: "Choose between Wise, Payoneer, or direct bank wire to compare landing amounts." },
        { title: "Net PKR", text: "See exactly how many Rupees (PKR) will reach your local bank account after all deductions." }
      ],
      proTip: "For large amounts, direct bank wires often have better fixed-fee structures compared to percentage-based wallet withdrawals."
    },
    hideCurrencySwitcher: true,
  },
  {
    slug: "salary-income-tax-calculator-2026",
    title: "Pakistan Salary Tax Calculator 2026",
    short: "Calculate your monthly and yearly take-home salary after official FBR tax deductions.",
    description: "The most accurate tax calculator for the 2025-26 and 2024-25 fiscal years. Compare yearly tax slabs, calculate monthly deductions, and see your real take-home pay based on latest FBR budget rules.",
    icon: "Wallet", category: "finance",
    keywords: ["pakistan income tax calculator 2026", "fbr tax slabs 2025-26", "calculate monthly salary tax", "yearly income tax pakistan", "fbr budget 2026 tax rates"],
    howTo: {
      steps: [
        { title: "Gross Salary", text: "Enter your monthly or annual base salary as per your official contract." },
        { title: "Tax Year", text: "Select the specific fiscal year (e.g., 2025-26) to apply the correct FBR tax slabs." },
        { title: "Take-Home Pay", text: "Review your monthly tax deduction and the final net salary that will be credited to your account." }
      ],
      proTip: "If you are a salaried individual, ensure your employer is applying the correct 'Filer' slabs to minimize over-deduction."
    },
    hideCurrencySwitcher: true,
  },
  {
    slug: "electricity-bill-predictor-pakistan",
    title: "Electricity Bill Predictor 2026",
    short: "Predict your electricity bill with 2026 NEPRA slabs and taxes.",
    description: "Predict your monthly electricity bill based on the latest 2026 NEPRA/DISCO slabs. Accounts for GST, FPA, and protected consumer status.",
    icon: "Zap", category: "finance",
    keywords: ["pakistan electricity bill calculator 2026", "nepra tariff slabs", "lesco bill predictor", "k-electric 2026 rates", "electricity duty calculator"],
    howTo: {
      steps: [
        { title: "Units Consumed", text: "Enter the number of units (kWh) you expect to use this month." },
        { title: "Connection Type", text: "Select your DISCO (LESCO, KE, etc.) and whether you are a protected or un-protected consumer." },
        { title: "Total Estimate", text: "View the full bill breakdown including GST, FPA, and various government taxes." }
      ],
      proTip: "Staying below 200 units for six consecutive months qualifies you as a 'Protected' consumer with much lower rates."
    }
  },
  {
    slug: "solar-system-requirement-calculator",
    title: "Solar System Size (kW) Requirement Calculator 2026",
    short: "Calculate the solar kW capacity you need based on appliances.",
    description: "Determine the ideal solar system size for your home. Input your appliance load and usage hours to calculate required PV capacity, inverter size, and 2026 configuration.",
    icon: "Sun", category: "utility",
    keywords: ["solar sizing calculator", "how many solar panels for 1.5 ton ac", "calculate solar kw requirement", "solar load calculator pakistan", "solar panel capacity for home"],
    howTo: {
      steps: [
        { title: "Appliance Load", text: "List the appliances you want to run (ACs, Fans, Fridge) and their daily usage hours." },
        { title: "Night Backup", text: "Specify if you need battery backup for nighttime or just daytime grid-tie savings." },
        { title: "Recommended kW", text: "Get the total solar PV capacity (kW) required to cover your specific energy needs." }
      ],
      proTip: "Always size your solar system 20% higher than your current needs to account for future appliance additions."
    },
    relatedSlugs: ["solar-roi-simulator-pakistan", "electricity-bill-predictor-pakistan", "solar-battery-backup-calculator"],
  },
  {
    slug: "solar-battery-backup-calculator",
    title: "Solar Battery Backup & Runtime Calculator (kWh)",
    short: "Calculate how long your batteries will last under different loads.",
    description: "Estimate your solar battery backup time in hours. Supports 5kWh, 10kWh Lithium (LFP) modules and Tubular batteries with Depth of Discharge (DoD) analysis.",
    icon: "Battery", category: "utility",
    keywords: ["solar battery backup calculator", "5kwh lithium battery runtime", "10kwh solar battery backup hours", "lithium vs tubular battery backup", "solar storage sizing calculator"],
    howTo: {
      steps: [
        { title: "Battery Type", text: "Select your battery chemistry (Lithium LFP or Lead Acid/Tubular) and voltage." },
        { title: "Continuous Load", text: "Enter the total wattage (W) of appliances you plan to run during a power outage." },
        { title: "Runtime Result", text: "See exactly how many hours your batteries will last before hitting the safety discharge limit." }
      ],
      proTip: "For Lithium (LFP) batteries, you can safely use up to 90% of the capacity, whereas Tubular batteries should only be used up to 50%."
    },
    relatedSlugs: ["solar-system-requirement-calculator", "solar-roi-simulator-pakistan"],
  },
  {
    slug: "solar-panel-to-kw-calculator",
    title: "Solar Panel to kW Converter",
    short: "Convert number of panels and wattage to total system kW capacity.",
    description: "Instantly calculate your total solar system capacity in kW. Enter the number of panels and their wattage (e.g., 550W, 580W) to see your total peak capacity, area required, and generation potential.",
    icon: "Grid3X3", category: "utility",
    keywords: ["solar panel to kw converter", "how many kw is 10 solar panels", "calculate solar peak capacity", "solar panel wattage converter", "solar system capacity tool"],
    howTo: {
      steps: [
        { title: "Panel Wattage", text: "Enter the wattage of a single solar panel (e.g., 550W or 580W)." },
        { title: "Quantity", text: "Input the total number of panels you plan to install on your roof." },
        { title: "Total Capacity", text: "Instantly see the total system size in kilowatts (kWp) and the required roof area." }
      ],
      proTip: "Check the 'Peak Power' rating on your panel's datasheet to ensure you enter the correct wattage for accurate sizing."
    },
    relatedSlugs: ["solar-system-requirement-calculator", "solar-roi-simulator-pakistan"],
  },
  {
    slug: "social-share-preview-tool",
    title: "Social Share Preview & Meta Tag Generator",
    short: "Preview how your website looks on social media and generate meta tags.",
    description: "The ultimate debugger for your website's social media presence. Preview your Open Graph (OG) tags for Facebook, X (Twitter), LinkedIn, and WhatsApp. Generate perfectly optimized meta tags for Next.js, React, and HTML instantly.",
    icon: "Share", category: "utility",
    keywords: ["social share preview", "og tag debugger", "meta tag generator", "facebook link preview", "whatsapp link preview", "twitter card validator", "linkedin post preview"],
    howTo: {
      steps: [
        { title: "Enter Details", text: "Input your website's Page Title, Description, and the URL of your preview image." },
        { title: "Live Preview", text: "Review how your link will appear on Facebook, X (Twitter), and WhatsApp in real-time." },
        { title: "Copy Tags", text: "Export the generated Meta Tags directly into your Next.js, React, or HTML codebase." }
      ],
      proTip: "Ensure your preview image is 1200x630 pixels for the best display quality across all social platforms."
    },
    relatedSlugs: ["qr-code-generator", "word-character-counter-tool"],
  },
  {
    slug: "university-merit-aggregate-calculator",
    title: "University Merit (Aggregate) Calculator",
    short: "Calculate your aggregate merit for NUST, UET, FAST, and GIKI.",
    description: "Calculate your university admission merit score based on Matric, Inter, and Entry Test scores. Supports custom weights for all major universities like NUST (NET), UET (ECAT), FAST, and GIKI.",
    icon: "GraduationCap", category: "education",
    keywords: ["merit calculator", "aggregate calculator", "university admission merit", "nust merit calculator", "uet aggregate calculator", "fast university merit", "how to calculate merit", "aggregate calculator pakistan", "admission aggregate"],
    howTo: {
      steps: [
        { title: "Select University", text: "Choose the target university (NUST, UET, FAST, etc.) to apply their specific merit weights." },
        { title: "Enter Academics", text: "Input your marks for Matric/O-Levels, Inter/A-Levels, and your Entry Test score." },
        { title: "Aggregate Score", text: "View your final merit percentage and compare it against last year's closing merit for your desired field." }
      ],
      proTip: "Entry tests (like NET or ECAT) often carry 50-75% weightage; focus heavily on these for the biggest impact on your aggregate."
    },
    relatedSlugs: ["hec-cgpa-converter", "board-percentage-calculator", "academic-grade-calculator"],
    hideCurrencySwitcher: true,
  },
  {
    slug: "pakistan-mobile-pta-tax-calculator",
    title: "Pakistan Mobile (PTA) Tax Calculator 2026",
    short: "Calculate the official PTA tax for mobile phones using 2026 FBR rates.",
    description: "Get the most accurate estimate of PTA/DIRBS taxes for iPhone, Samsung, and other smartphones. Updated with the April 2026 FBR Valuation Ruling No. 2070 for Passport and CNIC registration.",
    icon: "Smartphone", category: "finance",
    keywords: ["pta tax calculator 2026", "mobile tax pakistan", "iphone 17 pta tax", "fbr valuation ruling 2070", "pta tax on passport vs cnic", "dirbs tax calculator"],
    howTo: {
      steps: [
        { title: "Phone Model", text: "Enter your phone's brand and model or its approximate USD value as per FBR rulings." },
        { title: "Registration Type", text: "Select if you are registering via Passport (international traveler) or CNIC." },
        { title: "Tax Estimate", text: "Review the estimated PTA tax based on the latest 2026 DIRBS valuation guidelines." }
      ],
      proTip: "Registering within 60 days of international travel via Passport often results in a significantly lower tax compared to CNIC registration."
    },
    relatedSlugs: ["salary-income-tax-calculator-2026", "electricity-bill-predictor-pakistan"],
    hideCurrencySwitcher: true,
  },
  {
    slug: "ai-api-token-cost-calculator",
    title: "AI API Token Cost Estimator",
    short: "Estimate API costs for GPT-4o, Claude, and Gemini per million tokens.",
    description: "Calculate your LLM expenses with precision. Compare pricing for OpenAI, Anthropic, and Google APIs. Includes support for Batch API discounts and Prompt Caching for 2026.",
    icon: "Zap", category: "business",
    keywords: ["ai api pricing 2026", "gpt-4o cost calculator", "claude 3.5 sonnet price", "token cost estimator", "llm cost comparison", "openai batch api discount"],
    howTo: {
      steps: [
        { title: "Select Model", text: "Choose the AI model you are using (e.g., GPT-4o, Claude 3.5, or Gemini 1.5 Pro)." },
        { title: "Token Usage", text: "Enter the number of input (prompt) and output (completion) tokens per request." },
        { title: "Total Cost", text: "View the cost per 1M tokens and the total expense for your specific workload volume." }
      ],
      proTip: "Use Batch APIs for non-latency-sensitive tasks to save up to 50% on token costs across major providers."
    },
    relatedSlugs: ["profit-margin-calculator", "hourly-to-salary-calculator"],
    hideCurrencySwitcher: true,
  },
  {
    slug: "pakistan-car-registration-fee-calculator",
    title: "Pakistan Car Registration Fee Calculator 2026",
    short: "Calculate registration fees and withholding tax for Punjab, Sindh, and Islamabad.",
    description: "Get the latest estimates for new car registration in Pakistan. Includes provincial fees, Filer vs Non-Filer withholding tax (WHT) slabs, and luxury taxes for 2026.",
    icon: "Car", category: "finance",
    keywords: ["car registration fee pakistan 2026", "punjab car registration calculator", "sindh excise registration rates", "islamabad car registration tax", "filer vs non-filer car tax", "advance income tax on cars"],
    howTo: {
      steps: [
        { title: "Engine Capacity", text: "Enter the car's engine displacement in CC (e.g., 1000cc, 1300cc) and its invoice price." },
        { title: "Filer Status", text: "Select your FBR tax filer status to apply the correct withholding tax (WHT) percentage." },
        { title: "Total Payable", text: "View the breakdown of registration fees, number plate costs, and luxury taxes." }
      ],
      proTip: "Being an Active Taxpayer (Filer) can save you hundreds of thousands in withholding tax on higher-CC luxury vehicles."
    },
    relatedSlugs: ["salary-income-tax-calculator-2026", "loan-eligibility-calculator-pakistan"],
    hideCurrencySwitcher: true,
  },
  {
    slug: "zakat-calculator-pakistan-2026",
    title: "Zakat Calculator Pakistan 2026",
    short: "Calculate your Zakat accurately with latest Nisab, gold, and silver rates for 2026.",
    description: "Use our comprehensive Zakat calculator to determine your obligations. Covers gold, silver, cash, investments, and business assets based on 2026 Nisab values.",
    icon: "Coins", category: "finance",
    keywords: ["zakat calculator pakistan 2026", "nisab for zakat 2026 pakistan", "gold price for zakat", "zakat on property and investments", "islamic wealth tax calculator"],
    howTo: {
      steps: [
        { title: "Cash & Gold", text: "Enter your total cash in hand, bank balance, and the weight of gold/silver you own." },
        { title: "Investments", text: "Input the current value of stocks, business assets, and rental properties (if applicable)." },
        { title: "Liabilities", text: "Subtract any immediate debts or bills to find your total Zakatable wealth." }
      ],
      proTip: "Zakat is only mandatory if your wealth exceeds the Nisab (equivalent to 52.5 tolas of silver) for a full lunar year."
    },
    relatedSlugs: ["salary-income-tax-calculator-2026", "loan-emi-calculator"],
    hideCurrencySwitcher: true,
  },
  {
    slug: "solar-net-billing-calculator-pakistan",
    title: "Solar Net Billing (Buyback) Calculator 2026",
    short: "Calculate your savings under the 2026 Net Billing system.",
    description: "Don't get confused by the new solar rules. Calculate your actual bill reduction using differentiated rates for exported and self-consumed solar units in Pakistan.",
    icon: "Sun", category: "finance",
    keywords: ["solar net billing calculator", "solar buyback rate pakistan", "solar savings calculator 2026", "net billing vs net metering", "lesco solar rates", "k-electric solar credit"],
    howTo: {
      steps: [
        { title: "Exported Units", text: "Enter the number of solar units (kWh) you exported to the grid this month." },
        { title: "Consumed Units", text: "Input the units you consumed from the grid during off-peak hours (night/cloudy days)." },
        { title: "Net Bill", text: "Review your credit based on differentiated export/import rates under the 2026 rules." }
      ],
      proTip: "Under Net Billing, export rates are lower than import rates. Focus on maximizing daytime consumption to increase ROI."
    },
    relatedSlugs: ["solar-roi-simulator-pakistan", "electricity-bill-predictor-pakistan"],
    hideCurrencySwitcher: true,
  },
  {
    slug: "freelance-tax-residency-optimizer",
    title: "Freelance Tax & Residency Optimizer 2026",
    short: "Optimize your remote income tax and withdrawal arbitrage.",
    description: "Compare Filer vs Non-Filer tax, SECP registration, and US LLC benefits. Find the best withdrawal path (Wise vs Payoneer) to maximize your PKR earnings in 2026.",
    icon: "Coins", category: "business",
    keywords: ["freelance tax pakistan 2026", "filer vs non filer tax", "remote work tax optimization", "wise vs payoneer fees 2026", "secp vs sole proprietor tax"],
    howTo: {
      steps: [
        { title: "Income Source", text: "Select your primary income source (Export of Services, Local, or Arbitrage)." },
        { title: "Tax Status", text: "Input your Filer/Non-Filer status and whether you are registered with PSEB/SECP." },
        { title: "Tax Optimization", text: "View the most tax-efficient withdrawal and registration path for your specific income level." }
      ],
      proTip: "Registering with PSEB can often qualify you for a reduced 0.25% - 1% tax rate on foreign service exports."
    },
    relatedSlugs: ["freelance-rate-calculator", "freelance-fee-optimizer"],
    hideCurrencySwitcher: true,
  },
  {
    slug: "ai-agent-efficiency-roi-calculator",
    title: "AI Agent Efficiency & ROI Calculator",
    short: "Measure the dollar value of AI productivity gains.",
    description: "Calculate how much your AI agents (Claude 4.7, GPT-5.4) are actually saving your business by comparing labor costs saved vs API token expenses.",
    icon: "Zap", category: "business",
    keywords: ["ai roi calculator", "ai agent productivity estimator", "llm cost savings", "claude 4.7 vs gpt-5.4 roi", "ai efficiency calculator for business"],
    howTo: {
      steps: [
        { title: "Labor Costs", text: "Enter the hourly salary of the employee whose tasks are being partially automated by AI." },
        { title: "Efficiency Gain", text: "Input the percentage of time saved per task (e.g., AI completes a report 50% faster)." },
        { title: "Net ROI", text: "Subtract AI token costs from labor savings to see the true dollar value added to your business." }
      ],
      proTip: "AI ROI is highest in high-volume, repetitive data processing or first-draft writing tasks."
    },
    relatedSlugs: ["ai-api-token-cost-calculator", "profit-margin-calculator"],
    hideCurrencySwitcher: true,
  },
  {
    slug: "urban-cooling-tree-multiplier",
    title: "Urban Cooling & Tree Multiplier 2026",
    short: "Calculate how trees can lower your home's temperature.",
    description: "Determine the exact number of indigenous trees needed to reduce heat-island effects around your property and save on AC cooling costs.",
    icon: "Trees", category: "sustainability",
    keywords: ["urban cooling tree calculator", "best trees for cooling lahore", "amaltas vs neem cooling impact", "natural house cooling pakistan", "tree plantation impact calculator"],
    howTo: {
      steps: [
        { title: "Plot Size", text: "Enter your home's plot size in Marla to calculate the required canopy cover." },
        { title: "Existing Trees", text: "Input the number of mature trees you currently have on your property." },
        { title: "Cooling Target", text: "Get the recommended count of indigenous species (Neem, Amaltas) to drop ambient temperature by up to 5°C." }
      ],
      proTip: "Planting trees on the West side of your house provides the maximum cooling benefit by blocking the harsh sunset heat."
    },
    relatedSlugs: ["solar-net-billing-calculator-pakistan", "electricity-bill-predictor-pakistan"],
    hideCurrencySwitcher: true,
  },
  {
    slug: "ai-water-footprint-calculator",
    title: "AI Water Footprint Calculator",
    short: "Measure the water cost of your digital AI habits.",
    description: "Every AI prompt has a water cost for data center cooling. Calculate your personal AI water footprint and learn how to use tech sustainably.",
    icon: "Droplets", category: "sustainability",
    keywords: ["ai water consumption calculator", "water footprint of gpt-5", "claude 4.7 water cost per prompt", "sustainable ai usage", "digital water footprint tool"],
    howTo: {
      steps: [
        { title: "Prompt Volume", text: "Enter how many AI prompts (GPT-4o, Claude) you send on average per day." },
        { title: "Energy Source", text: "Select if you are using AI during peak or off-peak hours (relevant for data center cooling load)." },
        { title: "Water Impact", text: "View the estimated milliliters (ml) of water used to cool data centers for your habits." }
      ],
      proTip: "Using smaller, optimized models for simple tasks can reduce your digital water footprint by over 60%."
    },
    relatedSlugs: ["ai-agent-efficiency-roi-calculator", "ai-api-token-cost-calculator"],
    hideCurrencySwitcher: true,
  },
  {
    slug: "plastic-to-oxygen-impact-map",
    title: "Plastic-to-Oxygen Impact Map",
    short: "Convert plastic savings into oxygen & ocean protection.",
    description: "See the real-world impact of your zero-waste journey. Translates saved plastic bottles and bags into oxygen produced by equivalent trees.",
    icon: "Globe", category: "sustainability",
    keywords: ["plastic saving impact calculator", "zero waste oxygen equivalency", "ocean protection calculator", "plastic vs trees impact", "sustainability progress tracker"],
    howTo: {
      steps: [
        { title: "Plastic Saved", text: "Enter the number of plastic bottles or bags you have avoided using this month." },
        { title: "Ocean Impact", text: "See how your choice prevents microplastics from entering the marine ecosystem." },
        { title: "Oxygen Equivalency", text: "View the 'Oxygen Score' which translates your plastic savings into the oxygen output of mature trees." }
      ],
      proTip: "Every 100 plastic bottles saved is equivalent to the oxygen production of one young tree over its first year."
    },
    relatedSlugs: ["urban-cooling-tree-multiplier", "dietary-land-use-restoration"],
    hideCurrencySwitcher: true,
  },
  {
    slug: "ev-grid-cleanliness-auditor",
    title: "EV Grid Cleanliness Auditor 2026",
    short: "Is your EV actually clean? Check your local grid source.",
    description: "Calculate the 'True Green' score of your electric vehicle by factoring in your local energy grid's dependence on coal vs renewables in 2026.",
    icon: "Zap", category: "sustainability",
    keywords: ["ev carbon footprint pakistan", "grid cleanliness auditor", "electric car vs petrol 2026", "ev emissions calculator", "sustainable ev charging times"],
    howTo: {
      steps: [
        { title: "Vehicle Efficiency", text: "Enter your EV's efficiency in Wh/km or select a common model like the MG4 or Tesla Model 3." },
        { title: "Energy Grid", text: "Select your region (e.g., Pakistan) to account for the coal-to-renewable ratio in the 2026 grid." },
        { title: "Net Cleanliness", text: "View your 'True Green' score comparing your EV emissions against a high-efficiency petrol car." }
      ],
      proTip: "Charging your EV during the day if you have solar panels makes your driving nearly 100% carbon-neutral."
    },
    relatedSlugs: ["solar-net-billing-calculator-pakistan", "car-performance-speed-test"],
    hideCurrencySwitcher: true,
  },
  {
    slug: "dietary-land-use-restoration",
    title: "Dietary Land Use & Restoration Tool",
    short: "Calculate the forest area saved by your diet choices.",
    description: "Measure how much land and forest can be restored by small shifts in your weekly diet. Translates meat reduction into square meters of biodiversity.",
    icon: "Leaf", category: "sustainability",
    keywords: ["dietary land use calculator", "forest restoration diet tool", "meat vs plant land footprint", "sustainable eating impact", "biodiversity support calculator"],
    howTo: {
      steps: [
        { title: "Diet Type", text: "Select your current diet (Omnivore, Flexitarian, Vegetarian, or Vegan)." },
        { title: "Shift Plan", text: "Input how many meat-based meals you plan to replace with plant-based alternatives per week." },
        { title: "Land Restoration", text: "See exactly how many square meters (sqm) of forest and biodiversity space you help restore." }
      ],
      proTip: "A flexitarian diet (reducing meat by 50%) can restore enough land to support dozens of native plant species per year."
    },
    relatedSlugs: ["urban-cooling-tree-multiplier", "plastic-to-oxygen-impact-map"],
    hideCurrencySwitcher: true,
  },
  {
    slug: "microplastic-ocean-protection",
    title: "Microplastic & Ocean Protection Tool",
    short: "Measure microplastics saved by better laundry habits.",
    description: "Predict how many microplastic particles you prevent from entering the ocean by optimizing your laundry temperature and frequency.",
    icon: "Waves", category: "sustainability",
    keywords: ["microplastic calculator", "laundry water protection", "prevent ocean pollution tool", "sustainable washing machine habits", "microplastic fiber savings"],
    howTo: {
      steps: [
        { title: "Laundry Frequency", text: "Enter how many loads of laundry you run per week and the typical temperature used." },
        { title: "Fabric Mix", text: "Specify the percentage of synthetic vs natural fibers in your typical wash." },
        { title: "Particle Savings", text: "View the estimated number of microplastic fibers you prevent from entering the water cycle." }
      ],
      proTip: "Washing at 30°C and using a front-loading machine can reduce microplastic shedding by up to 70% compared to hot top-load cycles."
    },
    relatedSlugs: ["dietary-land-use-restoration", "ai-water-footprint-calculator"],
    hideCurrencySwitcher: true,
  },
  {
    slug: "gps-speedometer-online",
    title: "GPS Speedometer Online",
    short: "A clean, high-precision GPS speedometer for any type of travel.",
    description: "Measure your real-time speed with our high-precision GPS speedometer. Perfect for cars, trains, buses, or walking. Features include max speed tracking, trip distance, and HUD mode.",
    icon: "Navigation", category: "utility",
    keywords: ["gps speedometer online", "live speed tracker", "accurate speedometer", "mobile gps speedo", "web speedometer"],
    relatedSlugs: ["car-performance-speed-test", "unit-converter"],
    howTo: {
      steps: [
        { title: "Enable GPS", text: "Grant location permissions to allow the tool to track your movement via satellite." },
        { title: "Start Motion", text: "Begin moving to see your real-time speed, max velocity, and total trip distance." },
        { title: "HUD Mode", text: "Optionally enable HUD mode to project your speed onto your car's windshield at night." }
      ],
      proTip: "Ensure you are outdoors with a clear view of the sky for the most accurate GPS telemetry and speed tracking."
    }
  },
  {
    slug: "car-performance-speed-test",
    title: "Car GPS Speedometer & Performance Tracker",
    short: "Real-time car speed, 0-60 timer, and trip analytics for your vehicle.",
    description: "Turn your phone into a high-precision GPS speedometer. Track live speed, measure 0-60 performance, log trip distance, and use HUD (Head-Up Display) mode for windshield projection.",
    icon: "Car", category: "utility",
    keywords: ["gps speedometer", "live car speed", "0-60 timer", "hud speedometer", "trip tracker", "performance box"],
    relatedSlugs: ["car-loan-vs-lease-calculator", "unit-converter"],
    howTo: {
      steps: [
        { title: "Mount Phone", text: "Secure your device in a dashboard mount to keep your eyes on the road while driving." },
        { title: "Start Driving", text: "The tool automatically detects motion and begins tracking your speed and performance." },
        { title: "Auto Detection", text: "Use the 0-60 timer to measure your vehicle's acceleration performance from a standstill." }
      ],
      proTip: "Never handle your phone while driving. Use a mount and let the auto-start feature handle the tracking for you."
    }
  },
  {
    slug: "train-speed-test-live",
    title: "Live Train Speed Test (GPS)",
    short: "Track the real-time speed of your train trip using GPS.",
    description: "Curious how fast your train is going? Use our live GPS train speedometer to track real-time rail speed, max velocity, and total trip distance directly from your seat.",
    icon: "Train", category: "utility",
    keywords: ["train speed test", "live rail speed", "how fast is my train", "railway speedometer", "gps train tracker"],
    relatedSlugs: ["car-performance-speed-test", "flight-speed-tracker-gps"],
    howTo: {
      steps: [
        { title: "Active GPS", text: "Ensure GPS is enabled on your device to track the train's movement accurately." },
        { title: "Trip Mode", text: "Start the tracker when the train begins moving to log your entire rail journey." },
        { title: "Velocity Log", text: "Monitor real-time velocity and see the maximum speed reached during the trip." }
      ],
      proTip: "Sit near a window for better satellite reception when tracking speed inside a high-speed train carriage."
    }
  },
  {
    slug: "flight-speed-tracker-gps",
    title: "Live Flight Speed & Altitude Tracker",
    short: "Track airplane speed and altitude in real-time via GPS.",
    description: "Monitor your flight's speed and altitude in real-time. Our GPS-based flight tracker works from your window seat, providing live ground speed and height data without needing Wi-Fi.",
    icon: "Plane", category: "utility",
    keywords: ["flight speed tracker", "airplane speed live", "gps altitude tracker", "flight telemetry", "how fast is my plane"],
    relatedSlugs: ["train-speed-test-live", "car-performance-speed-test"],
    howTo: {
      steps: [
        { title: "GPS Enabled", text: "Enable GPS before takeoff. Note that GPS works even in airplane mode on most devices." },
        { title: "Ground Speed", text: "Track your actual ground speed and altitude relative to sea level in real-time." },
        { title: "Altitude Log", text: "Monitor changes in flight height as the plane ascends and descends during the trip." }
      ],
      proTip: "Sit by a window for the best satellite lock. It may take a minute to acquire coordinates while moving fast."
    }
  },
  {
    slug: "roller-coaster-speed-tracker",
    title: "Roller Coaster Speed & G-Force Tracker",
    short: "Measure max speed and G-force on any roller coaster ride.",
    description: "Track the thrill of your next roller coaster! Measure peak speeds, record G-force data using your phone's sensors, and log the maximum drop velocity in real-time.",
    icon: "Zap", category: "utility",
    keywords: ["roller coaster speed", "coaster speedometer", "track g-force online", "theme park speed test", "drop speed tracker"],
    relatedSlugs: ["high-speed-elevator-test", "car-performance-speed-test"],
    howTo: {
      steps: [
        { title: "Secure Device", text: "Ensure your phone is in a secure pocket or strap before the ride begins." },
        { title: "Start Track", text: "Activate the tracker just before the first drop to capture the peak excitement." },
        { title: "Peak Velocity", text: "Review your maximum speed and G-force intensity after the ride is complete." }
      ],
      proTip: "Coasters have high G-forces; keep your device secure to prevent it from being dislodged during the ride."
    }
  },
  {
    slug: "high-speed-elevator-test",
    title: "Elevator Speed Test (Feet per Minute)",
    short: "Measure the vertical speed of any skyscraper elevator.",
    description: "Test the vertical velocity of high-speed elevators in skyscrapers. Get real-time data in feet per minute (fpm) or meters per second, perfect for checking world-class lift performance.",
    icon: "ArrowUpCircle", category: "utility",
    keywords: ["elevator speed test", "skyscraper lift speed", "fpm calculator", "elevator velocity tracker", "how fast is this lift"],
    relatedSlugs: ["roller-coaster-speed-tracker", "flight-speed-tracker-gps"],
    howTo: {
      steps: [
        { title: "Vertical Mode", text: "Select the vertical tracking mode to measure elevator ascent and descent." },
        { title: "Floor Level", text: "Enter the starting floor to track the elevator's speed between levels." },
        { title: "Max Speed", text: "View real-time vertical velocity in feet per minute or meters per second." }
      ],
      proTip: "GPS often fails in elevator shafts; this tool primarily uses accelerometer data for vertical velocity."
    }
  },
  {
    slug: "cycling-speedometer-online",
    title: "Online Cycling Speedometer (GPS)",
    short: "Professional-grade bike speedometer for your cycling trips.",
    description: "Turn your smartphone into a professional cycling computer. Track live bike speed, average pace, max velocity, and total distance with our high-precision GPS bike speedometer.",
    icon: "Bike", category: "utility",
    keywords: ["cycling speedometer", "online bike tracker", "live bicycle speed", "cycling pace calculator", "gps bike computer"],
    relatedSlugs: ["running-speedometer-test", "car-performance-speed-test"],
    howTo: {
      steps: [
        { title: "Bike Mount", text: "Use a handlebar mount to keep your phone visible and oriented during your ride." },
        { title: "Start Ride", text: "Activate the speedometer to track your live cycling speed and total distance." },
        { title: "Average Speed", text: "Monitor your average pace and maximum velocity throughout your training session." }
      ],
      proTip: "Using a dedicated bike mount ensures consistent GPS orientation for accurate speed and distance tracking."
    }
  },
  {
    slug: "boat-speed-tracker-knots",
    title: "GPS Boat Speed Tracker (Knots)",
    short: "Measure marine speed in knots and nautical miles via GPS.",
    description: "Navigate with precision using our marine GPS speedometer. Track boat speed in knots, calculate nautical miles, and monitor your heading and coordinates live on the water.",
    icon: "Anchor", category: "utility",
    keywords: ["boat speed tracker", "knots speedometer", "marine gps tracker", "how fast is my boat", "nautical miles calculator"],
    relatedSlugs: ["car-performance-speed-test", "cycling-speedometer-online"],
    howTo: {
      steps: [
        { title: "Marine GPS", text: "Enable GPS for marine tracking. Nautical measurements require high-precision coordinates." },
        { title: "Knots/MPH", text: "Toggle between knots and MPH to see your speed in your preferred nautical unit." },
        { title: "Current Drift", text: "Monitor your heading and track your drift velocity relative to the water surface." }
      ],
      proTip: "Tracking speed in knots is standard for marine navigation. 1 knot is approximately 1.15 miles per hour."
    }
  },
  {
    slug: "e-scooter-speedometer",
    title: "Electric Scooter Speedometer",
    short: "Track your e-scooter's real-time speed and trip stats.",
    description: "Monitor your electric scooter rides with our dedicated GPS speedometer. Perfect for Segway, Xiaomi, and custom e-scooters to track live speed and battery-saving trip data.",
    icon: "Zap", category: "utility",
    keywords: ["e-scooter speedometer", "electric scooter speed", "scooter tracker gps", "segway speed test", "xiaomi scooter speed"],
    relatedSlugs: ["cycling-speedometer-online", "car-performance-speed-test"],
    howTo: {
      steps: [
        { title: "Handlebar Mount", text: "Secure your device to the scooter handlebars for safe, hands-free speed tracking." },
        { title: "Speed Limit", text: "Monitor your live speed to ensure you stay within local e-scooter legal limits." },
        { title: "Trip Log", text: "Log your trip distance and battery efficiency to optimize your scooter commute." }
      ],
      proTip: "Keep an eye on local speed limits while using the real-time speedometer to ensure a safe urban ride."
    }
  },
  {
    slug: "ski-snowboard-speed-tracker",
    title: "Ski & Snowboard Speed Tracker",
    short: "Track your maximum downhill speed on the slopes.",
    description: "Measure your peak velocity on the ski slopes. Our GPS tracker records your maximum downhill speed, average pace, and total run distance for skiing and snowboarding.",
    icon: "Snowflake", category: "utility",
    keywords: ["ski speed tracker", "snowboard speedometer", "downhill speed test", "winter sports gps", "how fast am i skiing"],
    relatedSlugs: ["roller-coaster-speed-tracker", "running-speedometer-test"],
    howTo: {
      steps: [
        { title: "Cold-Safe Mode", text: "Activate the tracker before heading out. Keep your phone in an inner pocket." },
        { title: "Start Descent", text: "The tool will automatically track your speed as you begin your downhill run." },
        { title: "Max Slope Speed", text: "Review your maximum descent velocity and total vertical distance covered." }
      ],
      proTip: "Keep your phone in an inner pocket to preserve battery, as cold temperatures can cause GPS to fail."
    }
  },
  {
    slug: "running-speedometer-test",
    title: "Running Speedometer & Pace Test",
    short: "Track your running speed and sprinting pace live.",
    description: "Optimize your training with our live running speedometer. Track your current sprinting speed, average running pace, and total distance using high-precision mobile GPS.",
    icon: "Footprints", category: "utility",
    keywords: ["running speed test", "sprint speedometer", "live running pace", "how fast am i running", "jogging speed tracker"],
    relatedSlugs: ["cycling-speedometer-online", "car-performance-speed-test"],
    howTo: {
      steps: [
        { title: "Arm Band", text: "Wear your device in an arm band for the most consistent GPS tracking while running." },
        { title: "Pace Tracker", text: "Monitor your current pace in minutes per mile or kilometer in real-time." },
        { title: "Distance Goal", text: "Track your progress towards your distance goals with live telemetry updates." }
      ],
      proTip: "Focus on a steady cadence for better efficiency. Your pace is key to improving running performance."
    }
  },
  {
    slug: "horse-riding-speed-tracker",
    title: "Horse Riding Speed Tracker (GPS)",
    short: "Monitor your horse's trot, canter, and gallop speeds.",
    description: "Track your equestrian performance with our GPS horse speedometer. Measure speeds during trot, canter, and gallop, and log your total trail distance in real-time.",
    icon: "Dna", category: "utility",
    keywords: ["horse riding speed", "equestrian tracker", "gallop speed test", "canter speedometer", "gps horse tracker"],
    relatedSlugs: ["running-speedometer-test", "boat-speed-tracker-knots"],
    howTo: {
      steps: [
        { title: "Saddle Mount", text: "Secure your device to the saddle or rider's arm to track the horse's movement." },
        { title: "Gait Tracking", text: "Monitor the horse's speed during trot, canter, and gallop for training logs." },
        { title: "Gallop Speed", text: "Record maximum gallop speeds to analyze the horse's peak athletic performance." }
      ],
      proTip: "Tracking your horse's gait helps in training consistency. Ensure the device is secure to avoid spooking."
    }
  },
  {
    slug: "human-reaction-time-test",
    title: "Human Reaction Time Test",
    short: "Measure your brain's processing speed with this interactive reaction test.",
    description: "Measure your reaction speed with this simple test. Click the screen as fast as you can when it turns from red to green to see your score.",
    icon: "Zap", category: "benchmarks",
    keywords: ["reaction time test", "human benchmark", "click speed test", "reflex test", "brain speed"],
    relatedSlugs: ["sleep-debt-calculator", "water-intake-sleep-calculator"],
    howTo: {
      steps: [
        { title: "Wait for Blue", text: "Wait for the screen to turn blue. Do not click prematurely or you'll fail." },
        { title: "Click Fast", text: "Click the screen or press any key as quickly as possible once it turns blue." },
        { title: "Average Result", text: "Repeat the test 5 times to see your consistent average reaction speed." }
      ],
      proTip: "Use a wired mouse and a high-refresh monitor for the most accurate reaction time readings possible."
    }
  },
  {
    slug: "sequence-memory-test",
    title: "Sequence Memory (Pattern) Test",
    short: "Repeat the pattern as it gets longer. How far can you go?",
    description: "Test your memory by repeating a sequence of tiles that light up. Every time you get it right, the pattern adds one more step to make it harder.",
    icon: "Brain", category: "benchmarks",
    keywords: ["sequence memory test", "memory matrix", "brain training online", "short term memory test", "simon says game"],
    relatedSlugs: ["human-reaction-time-test", "visual-memory-test"],
    howTo: {
      steps: [
        { title: "Watch Sequence", text: "Pay close attention to the order in which the tiles light up on the grid." },
        { title: "Repeat Pattern", text: "Click the tiles in the exact same sequence to move to the next level." },
        { title: "Level Up", text: "Each successful round adds one more tile to the sequence, increasing difficulty." }
      ],
      proTip: "Try associating each tile with a number or direction in your mind to remember longer sequences."
    }
  },
  {
    slug: "aim-trainer",
    title: "Aim Trainer Test",
    short: "How quickly can you hit all the targets?",
    description: "Test your aim and speed with this interactive aim trainer. Click all 30 targets as fast as you can to see your average click time and accuracy score.",
    icon: "Target", category: "benchmarks",
    keywords: ["aim trainer", "fps aim test", "mouse accuracy test", "reaction speed test", "gaming reflexes"],
    relatedSlugs: ["human-reaction-time-test", "typing-speed-test"],
    howTo: {
      steps: [
        { title: "Target Pop", text: "Targets will appear randomly on the screen. Move your mouse to hover over them." },
        { title: "Click Fast", text: "Click each target as soon as it appears to test your click-speed and precision." },
        { title: "Accuracy Score", text: "Complete 30 targets to see your average click time and total accuracy percentage." }
      ],
      proTip: "Don't just go for speed; accuracy is key to improving your muscle memory for competitive gaming."
    }
  },
  {
    slug: "number-memory-test",
    title: "Number Memory Test",
    short: "Remember the longest number you can.",
    description: "Test your memory by remembering a sequence of numbers that gets longer every time you get it right. See if you can beat the average score of 7 digits.",
    icon: "Hash", category: "benchmarks",
    keywords: ["number memory test", "digit span test", "iq memory test", "brain training numbers", "short term memory"],
    relatedSlugs: ["verbal-memory-test", "sequence-memory-test"],
    howTo: {
      steps: [
        { title: "Memorize Number", text: "A sequence of digits will appear on the screen for a few seconds." },
        { title: "Type it Back", text: "Once the number disappears, type the exact sequence into the input box." },
        { title: "Difficulty Spike", text: "The sequence gets longer with each correct answer. See how far you can go." }
      ],
      proTip: "Chunking numbers into groups of 3 or 4 makes it much easier for your brain to hold them in memory."
    }
  },
  {
    slug: "verbal-memory-test",
    title: "Verbal Memory Test",
    short: "Keep as many words in short term memory as possible.",
    description: "Test your verbal memory by keeping track of words. You will be shown words one by one—you just have to say if you have seen the word before or if it is new.",
    icon: "BookOpen", category: "benchmarks",
    keywords: ["verbal memory test", "word recognition test", "language memory", "brain games online", "memory benchmark"],
    relatedSlugs: ["number-memory-test", "chimp-test"],
    howTo: {
      steps: [
        { title: "Read Word", text: "A word will be displayed on the screen. Focus on its spelling and sound." },
        { title: "New or Seen?", text: "Decide if you have seen this word before in the current test or if it's new." },
        { title: "Track Lives", text: "You have limited lives. Three wrong guesses will end the memory test session." }
      ],
      proTip: "Saying the word out loud can help create a stronger memory trace than just reading it silently."
    }
  },
  {
    slug: "chimp-test",
    title: "Chimpanzee Memory Test",
    short: "Are you smarter than a chimpanzee?",
    description: "Test your memory against a famous chimpanzee experiment. Numbers appear on a grid and hide behind squares—click them in the right order to win.",
    icon: "Grid3X3", category: "benchmarks",
    keywords: ["chimp test", "chimpanzee memory", "working memory test", "grid pattern memory", "iq test online"],
    relatedSlugs: ["visual-memory-test", "sequence-memory-test"],
    howTo: {
      steps: [
        { title: "Grid Reveal", text: "Numbers appear on a grid for a split second before hiding behind white squares." },
        { title: "Ascending Order", text: "Click the squares in ascending numerical order (1, 2, 3...) to clear the level." },
        { title: "Hidden Mode", text: "If you fail twice, the level ends. The test gets harder as you clear more squares." }
      ],
      proTip: "Try to scan the entire grid before clicking the first number to pre-load the sequence in your mind."
    }
  },
  {
    slug: "visual-memory-test",
    title: "Visual Memory Test",
    short: "Remember an increasingly large board of squares.",
    description: "Test your visual memory by remembering where the squares light up on the board. The grid gets bigger and more difficult as you move to higher levels.",
    icon: "LayoutGrid", category: "benchmarks",
    keywords: ["visual memory test", "spatial memory", "grid memory game", "brain training", "pattern recognition"],
    relatedSlugs: ["chimp-test", "sequence-memory-test"],
    howTo: {
      steps: [
        { title: "Board Flash", text: "A set of tiles will flash on the grid. Remember their exact positions." },
        { title: "Recall Tiles", text: "Click the tiles that were highlighted once the board goes blank." },
        { title: "Pattern Growth", text: "The grid grows larger and the number of tiles increases as you progress." }
      ],
      proTip: "Look for shapes or symmetries in the highlighted tiles rather than individual square locations."
    }
  },
  {
    slug: "typing-speed-test",
    title: "Typing Speed Test (WPM)",
    short: "How many words per minute can you type?",
    description: "Test your typing speed and accuracy with this easy WPM test. Type the text as fast as you can to see your typing speed and character accuracy score.",
    icon: "Keyboard", category: "benchmarks",
    keywords: ["typing speed test", "wpm test online", "typing accuracy", "keyboard speed test", "fast typing"],
    relatedSlugs: ["aim-trainer", "human-reaction-time-test"],
    howTo: {
      steps: [
        { title: "Start Typing", text: "Begin typing the displayed text. The timer starts with your first keystroke." },
        { title: "High Accuracy", text: "Focus on accuracy; mistakes will slow you down and lower your final score." },
        { title: "Check WPM", text: "Review your words per minute (WPM) and accuracy percentage after the test." }
      ],
      proTip: "Keep your eyes on the screen, not the keyboard. Speed comes naturally once you master touch typing."
    }
  },
];

export const calculatorBySlug = (slug: string) => CALCULATORS.find((c) => c.slug === slug);
