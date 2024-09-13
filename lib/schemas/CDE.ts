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