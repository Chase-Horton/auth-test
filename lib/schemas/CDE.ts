import { z } from "zod";
export type cdeAgenciesResponse = {
    ori:string,
    agency_name:string,
    agency_id:string,
    state_name:string,
    state_abbr:string,
    division_name:string,
    region_name:string,
    region_desc:string,
    country_name:string,
    agency_type_name:string,
    nibrs:boolean,
    nibrs_start_date:Date
    latitude:number,
    longitude:number
}
const validStateCodes = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];
export const GetAgencyByStateSchema = z.object({
    stateCode: z.string().refine(value => validStateCodes.includes(value), {
      message: `Invalid state code`,
    }),
  });