import { z } from "zod";
export type cdeAgenciesResponse = {
    ori:string,
    agency_name:string,
    agency_id:number,
    state_name:string,
    state_abbr:string,
    division_name:string,
    region_name:string,
    region_desc:string,
    country_name:string,
    agency_type_name:string,
    nibrs:boolean,
    nibrs_start_date:string
    latitude:string,
    longitude:string
}
const validStateCodes = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];
export const validCrimeCodesNational = [
    "aggravated-assault",
    "violent-crime",
    "robbery",
    "arson",
    "human-trafficing",
    "rape-legacy",
    "homicide",
    "burglary",
    "motor-vehicle-theft",
    "larceny",
    "rape",
    "property-crime"
]
export const tempDisplayCrimeCodes = [
  "aggravated-assault",
  "violent-crime",
  "robbery",
  "arson",
  "rape-legacy",
  "homicide",
  "burglary",
  "motor-vehicle-theft",
  "larceny",
  "rape",
  "property-crime"
]
export const GetAgencyByStateSchema = z.object({
    stateCode: z.string().refine(value => validStateCodes.includes(value), {
      message: `Invalid state code`,
    }),
  });
//dont care about issue or ctx but need to fit the type
//eslint-disable-next-line
const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  return {message:"Invalid year"};
}
export const GetNationalCrimeByCrimeSchema = z.object({
    crime: z.string().refine(value => validCrimeCodesNational.includes(value), {
      message: `Invalid crime code`,
    }),
    from: z.coerce.number({errorMap:customErrorMap}).int().min(1979, "Year must be greater than 1978").max(2022, "Year must be before 2023"),
    to: z.coerce.number({errorMap:customErrorMap}).int().min(1979, "Year must be greater than 1978").max(2022, "Year must be before 2023")
}).refine(data => data.from < data.to, {
    message: "End year must be greater than start year.",
    path: ["to"]
});
export const GetNationalCrimeByStateSchema = z.object({
  crime: z.string().refine(value => validCrimeCodesNational.includes(value), {
    message: `Invalid crime code`,
  }),
  stateCode: z.string().refine(value => validStateCodes.includes(value), {
    message: `Invalid state code`,
  }),
  from: z.coerce.number({errorMap:customErrorMap}).int().min(1979, "Year must be greater than 1978").max(2022, "Year must be before 2023"),
  to: z.coerce.number({errorMap:customErrorMap}).int().min(1979, "Year must be greater than 1978").max(2022, "Year must be before 2023")
}).refine(data => data.from < data.to, {
  message: "End year must be greater than start year.",
  path: ["to"]
});
export type MarkerData = {
    latitude:number;
    longitude:number;
    description:string;
}
export type CrimeDataNode = {
    year:number;
    value:number;
}
export type CrimeDataGraph = {
    crime:string;
    data:CrimeDataNode[];
}
export const validArrestOffenseCodes =  [
  "Aggravated Assault",
  "All Other Offenses (Except Traffic)",
  "Arson",
  "Burglary",
  "Curfew and Loitering Law Violations",
  "Disorderly Conduct",
  "Driving Under the Influence",
  "Drug Abuse Violations - Grand Total",
  "Drunkenness",
  "Embezzlement",
  "Forgery and Counterfeiting",
  "Fraud",
  "Gambling - Total",
  "Human Trafficking - Commercial Sex Acts",
  "Human Trafficking - Involuntary Servitude",
  "Larceny - Theft",
  "Liquor Laws",
  "Manslaughter by Negligence",
  "Motor Vehicle Theft",
  "Murder and Nonnegligent Manslaughter",
  "Offenses Against the Family and Children",
  "Prostitution and Commercialized Vice",
  "Rape",
  "Robbery",
  "Sex Offenses (Except Rape, and Prostitution and Commercialized Vice)",
  "Simple Assault",
  "Stolen Property: Buying, Receiving, Possessing",
  "Suspicion",
  "Vagrancy",
  "Vandalism",
  "Weapons: Carrying, Possessing, Etc."
]
export const GetNationalArrestsByCrimeSchema = z.object({
  offense: z.string().refine(value => validArrestOffenseCodes.includes(value), {
    message: `Invalid crime code`,
  }),
  from: z.coerce.number({errorMap:customErrorMap}).int().min(1979, "Year must be greater than 1978").max(2022, "Year must be before 2023"),
  to: z.coerce.number({errorMap:customErrorMap}).int().min(1979, "Year must be greater than 1978").max(2022, "Year must be before 2023")
}).refine(data => data.from < data.to, {
  message: "End year must be greater than start year.",
  path: ["to"]
});
export const ValidNationalArrestByCategoryCategories = [
  "Violent Crime",
  "Property Crime",
  "Society",
  "Drug Sales",
  "Gambling",
  "Prostitution",
]
export const NationalArrestByCategoryMapToOffenses = {
  "Violent Crime": [
      "Aggravated Assault",
      "Sex Offenses (Except Rape, and Prostitution and Commercialized Vice)",
      "Manslaughter by Negligence",
      "Murder and Nonnegligent Manslaughter",
      "Rape",
      "Robbery",
      "Simple Assault",
  ],
  "Property Crime": [
      "Motor Vehicle Theft",
      "Arson",
      "Burglary",
      "Embezzlement",
      "Forgery and Counterfeiting",
      "Fraud",
      "Larceny - Theft",
      "Vandalism",
      "Stolen Property: Buying, Receiving, Possessing"
  ],
  "Society":  [
      "Drunkenness",
      "All Other Offenses (Except Traffic)",
      "Curfew and Loitering Law Violations",
      "Disorderly Conduct",
      "Driving Under the Influence",
      "Liquor Laws",
      "Offenses Against the Family and Children",
      "Suspicion",
      "Vagrancy",
      "Weapons: Carrying, Possessing, Etc.",
      "Drug Abuse Violations - Grand Total",
      "Gambling - Total",
      "Prostitution and Commercialized Vice"
  ],
  "Drug Sales": [
      "Marijuana",
      "Opium or Cocaine or Their Derivatives",
      "Other - Dangerous Nonnarcotic Drugs",
      "Synthetic Narcotics",
      "Drug Sale/Manufacturing - Subtotal"
  ],
  "Gambling":[
      "Gambling - All Other Gambling",
      "Gambling - Bookmaking (Horse and Sport Book)",
      "Gambling - Numbers and Lottery",
      "Gambling - Total"
  ],
  "Prostitution":[
      "Prostitution and Commercialized Vice",
  ],
}
const ArrestCategorySchema = z.enum(["Violent Crime", "Property Crime", "Society", "Drug Sales", "Gambling", "Prostitution"])
export type ArrestCategory = z.infer<typeof ArrestCategorySchema>
export const GetNationalArrestsByCategoryCodeSchema = z.object({
  year: z.coerce.number({errorMap:customErrorMap}).int().min(1979, "Year must be greater than 1978").max(2022, "Year must be before 2023"),
  end: z.number().int().min(1979, "Year must be greater than 1978").max(2022, "Year must be before 2023").optional(),
  category: ArrestCategorySchema,
})