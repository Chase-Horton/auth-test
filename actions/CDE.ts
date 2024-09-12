"use server"
import { z } from "zod"
import { GetAgencyByStateSchema } from "@/lib/schemas/CDE"

export const GetAgenciesByStateCode = async (values: z.infer<typeof GetAgencyByStateSchema>) => {
    const stateCode = values.stateCode;
}