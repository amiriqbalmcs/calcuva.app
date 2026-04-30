export const PAKISTAN_INFLATION_DATA = [
  { year: 2010, rate: 12.9 },
  { year: 2011, rate: 11.9 },
  { year: 2012, rate: 9.7 },
  { year: 2013, rate: 7.7 },
  { year: 2014, rate: 7.2 },
  { year: 2015, rate: 2.9 },
  { year: 2016, rate: 3.8 },
  { year: 2017, rate: 4.1 },
  { year: 2018, rate: 5.1 },
  { year: 2019, rate: 10.6 },
  { year: 2020, rate: 9.7 },
  { year: 2021, rate: 9.5 },
  { year: 2022, rate: 19.9 },
  { year: 2023, rate: 30.8 },
  { year: 2024, rate: 12.6 },
  { year: 2025, rate: 3.2 },
];

export const UNIVERSITY_SCALES: Record<string, { label: string, formula: (gpa: number) => number }> = {
  hec: {
    label: "HEC Standard (4.0)",
    formula: (gpa) => (gpa / 4.0) * 100,
  },
  nust: {
    label: "NUST (4.0 Scale)",
    formula: (gpa) => {
      if (gpa >= 3.5) return 85 + (gpa - 3.5) * 10;
      if (gpa >= 3.0) return 75 + (gpa - 3.0) * 20;
      return (gpa / 4.0) * 100;
    },
  },
  fast: {
    label: "FAST-NUCES",
    formula: (gpa) => (gpa / 4.0) * 100,
  },
  lums: {
    label: "LUMS",
    formula: (gpa) => (gpa / 4.0) * 100,
  },
};

export const BOARD_MARK_SCHEMES: Record<string, { label: string, total: number }> = {
  punjab: { label: "Punjab Boards (BISE)", total: 1100 },
  sindh: { label: "Sindh Boards (BIEK/BSEK)", total: 1100 },
  federal: { label: "Federal Board (FBISE)", total: 1100 },
  kpk: { label: "KPK Boards", total: 1100 },
};
