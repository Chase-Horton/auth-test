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
export const GetAgencyByStateSchema = z.object({
    stateCode: z.string().refine(value => validStateCodes.includes(value), {
      message: `Invalid state code`,
    }),
  });
export type MarkerData = {
    latitude:number;
    longitude:number;
    description:string;
}