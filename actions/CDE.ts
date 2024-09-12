"use server"
import { z } from "zod"
import { cdeAgenciesResponse, GetAgencyByStateSchema } from "@/lib/schemas/CDE"

export async function GetAgenciesByStateCode(values: z.infer<typeof GetAgencyByStateSchema>): Promise<cdeAgenciesResponse[]>  {
    const stateCode = values.stateCode;
    const queryURL = `https://api.usa.gov/crime/fbi/cde/agency/byStateAbbr/${stateCode}?API_KEY=${process.env.CDE_API_KEY}`
    const response = await fetch(queryURL);
    const data = await response.json();
    return data;
}