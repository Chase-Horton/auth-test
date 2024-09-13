"use server"
import { z } from "zod"
import { cdeAgenciesResponse, CrimeDataNode, GetAgencyByStateSchema, GetNationalArrestsByCrimeSchema, GetNationalCrimeByCrimeSchema, validArrestOffenseCodes } from "@/lib/schemas/CDE"
import { ArrestData, ArrestDataYear } from "@/data/stores";

export async function GetAgenciesByStateCode(values: z.infer<typeof GetAgencyByStateSchema>): Promise<cdeAgenciesResponse[]> {
    const stateCode = values.stateCode;
    const queryURL = `https://api.usa.gov/crime/fbi/cde/agency/byStateAbbr/${stateCode}?API_KEY=${process.env.CDE_API_KEY}`
    const response = await fetch(queryURL);
    const data = await response.json();
    return data;
}
export async function GetNationalCrimesByCrimeCode(values: z.infer<typeof GetNationalCrimeByCrimeSchema>) {
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
type NationalArrestNode = {
    data_year: number;
    [key: string]: number;
}
export async function GetNationalArrestsByOffenseCode(values: z.infer<typeof GetNationalArrestsByCrimeSchema>): Promise<CrimeDataNode[]> {
    const crimeCode = values.offense;
    const from = values.from;
    const to = values.to;
    const queryURL = `https://api.usa.gov/crime/fbi/cde/arrest/national/all?from=${from}&to=${to}&API_KEY=${process.env.CDE_API_KEY}`
    const response = await fetch(queryURL);
    const result = await response.json();
    const data = result["data"]
    if (data === undefined) {
        return [];
    }
    const returnData: CrimeDataNode[] = [];
    data.forEach((element: NationalArrestNode) => {
        returnData.push({
            year: element.data_year,
            value: element[crimeCode]
        })
    });
    return returnData;
}
export async function GetNationalArrestsByOffenseAll(values: z.infer<typeof GetNationalArrestsByCrimeSchema>): Promise<ArrestDataYear[]> {
    const from = values.from;
    const to = values.to;
    const queryURL = `https://api.usa.gov/crime/fbi/cde/arrest/national/all?from=${from}&to=${to}&API_KEY=${process.env.CDE_API_KEY}`
    const response = await fetch(queryURL);
    const result = await response.json();
    const data = result["data"]
    if (data === undefined) {
        return [];
    }
    const returnData: ArrestDataYear[] = [];
    data.forEach((element: NationalArrestNode) => {
        let offenseData: ArrestData[] = [];
        validArrestOffenseCodes.forEach((offense) => {
            offenseData.push({
                offense: offense,
                arrests: element[offense]
            })
        })
        returnData.push({
            year: element.data_year,
            data: offenseData
        })
    });
    return returnData;
}