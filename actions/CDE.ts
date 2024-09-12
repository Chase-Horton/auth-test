"use server"
import { z } from "zod"
import { cdeAgenciesResponse, GetAgencyByStateSchema, GetNationalCrimeByCrimeSchema } from "@/lib/schemas/CDE"

export async function GetAgenciesByStateCode(values: z.infer<typeof GetAgencyByStateSchema>): Promise<cdeAgenciesResponse[]>  {
    const stateCode = values.stateCode;
    const queryURL = `https://api.usa.gov/crime/fbi/cde/agency/byStateAbbr/${stateCode}?API_KEY=${process.env.CDE_API_KEY}`
    const response = await fetch(queryURL);
    const data = await response.json();
    return data;
}
export async function GetNationalCrimesByCrimeCode(values: z.infer<typeof GetNationalCrimeByCrimeSchema>){
    const crimeCode = values.crime;
    const from = values.from;
    const to = values.to;
    const queryURL = `https://api.usa.gov/crime/fbi/cde/estimate/national/${crimeCode}?from=${from}&to=${to}&API_KEY=${process.env.CDE_API_KEY}`
    const response = await fetch(queryURL);
    const result = await response.json();
    const data = result["results"]
    if (data === undefined) {
        return [];
    }
    const key = Object.keys(data)[0];
    return data[key];
}