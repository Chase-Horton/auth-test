"use server"
import { z } from "zod"
import { ArrestCategory, cdeAgenciesResponse, GetAgencyByStateSchema, GetExpandedHomicideCollectionSchema, GetNationalArrestsByCategoryCodeSchema, GetNationalArrestsByCrimeSchema, GetNationalCrimeByCrimeSchema, GetNationalCrimeByStateSchema, NationalArrestByCategoryMapToOffenses, validArrestOffenseCodes, validExpandedHomicideCollectionCategories } from "@/lib/schemas/CDE"
import { PieTypeData, PieTypeDataYear } from "@/data/stores";

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
export async function GetNationalCrimesByCrimeCodeAndState(values: z.infer<typeof GetNationalCrimeByStateSchema>) {
    const { stateCode, crime, from, to } = values;
    const queryURL = `https://api.usa.gov/crime/fbi/cde/estimate/state/${stateCode}/${crime}?from=${from}&to=${to}&API_KEY=${process.env.CDE_API_KEY}`
    const response = await fetch(queryURL);
    const result = await response.json();
    const data = result["results"]
    if (data === undefined) {
        return [];
    }
    let key = Object.keys(data)[0].includes("United States") ? Object.keys(data)[1] : Object.keys(data)[0];
    return data[key];
}
type NationalArrestNode = {
    data_year: number;
    [key: string]: number;
}
export async function GetNationalArrestsByOffenseAll(values: z.infer<typeof GetNationalArrestsByCrimeSchema>): Promise<PieTypeDataYear[]> {
    const from = values.from;
    const to = values.to;
    const queryURL = `https://api.usa.gov/crime/fbi/cde/arrest/national/all?from=${from}&to=${to}&API_KEY=${process.env.CDE_API_KEY}`
    const response = await fetch(queryURL);
    const result = await response.json();
    const data = result["data"]
    if (data === undefined) {
        return [];
    }
    const returnData: PieTypeDataYear[] = [];
    data.forEach((element: NationalArrestNode) => {
        let offenseData: PieTypeData[] = [];
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
export async function GetNationalArrestsByOffenseCategory(values: z.infer<typeof GetNationalArrestsByCategoryCodeSchema>): Promise<PieTypeDataYear[]> {
    const from = values.year;
    const to = values.end;
    const category:ArrestCategory = values.category;
    const queryURL = `https://api.usa.gov/crime/fbi/cde/arrest/national/${category.toLocaleLowerCase().split(" ").join("_")}?from=${from}&to=${to}&API_KEY=${process.env.CDE_API_KEY}`
    const response = await fetch(queryURL);
    const result = await response.json();
    const data = result["data"]
    if (data === undefined) {
        return [];
    }
    const returnData: PieTypeDataYear[] = [];
    data.forEach((element: NationalArrestNode) => {
        let offenseData: PieTypeData[] = [];
        NationalArrestByCategoryMapToOffenses[category].forEach((offense) => {
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
export async function GetExpandedHomicideCollection(values: z.infer<typeof GetExpandedHomicideCollectionSchema>): Promise<PieTypeDataYear[]> {
    const from = values.year;
    const category:validExpandedHomicideCollectionCategories = values.category;
    const queryURL = `https://api.usa.gov/crime/fbi/cde/shr/national/${category}/${values.variable}?from=${from}&to=${from}&API_KEY=${process.env.CDE_API_KEY}`
    const response = await fetch(queryURL);
    const result = await response.json();
    const keys = result["keys"]
    if (keys.includes("Multiple")) {
        keys.splice(keys.indexOf("Multiple"), 1)
    }
    let data = result["data"]
    if (data === undefined) {
        return [];
    }
    data = data[0];
    const returnData: PieTypeDataYear[] = [];
    let offenseData: PieTypeData[] = [];
    keys.forEach((key: string) => {
        if (data[key] != 0) {
            offenseData.push({
                offense: key,
                arrests: data[key]
            })
        }
    });
    returnData.push({
        year: from,
        data: offenseData
    })
    return returnData;
}