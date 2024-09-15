import { CrimeDataGraph, GetExpandedHomicideCollectionSchema, validExpandedHomicideVariables } from "@/lib/schemas/CDE";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast"
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import { useEffect } from "react";
import "highlight.js/styles/atom-one-dark.css";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input";
import { GetExpandedHomicideCollection } from "@/actions/CDE";
import { useArrestDataStore, useGraphDataStore, useQueryUIStore } from "@/data/stores";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface NationalArrestsProps {
    startTransition: (callback: () => void) => void;
    isPending: boolean;
    setData: (data: CrimeDataGraph[]) => void;
}
export default function GetNationalExpandedHomicideForm(props: NationalArrestsProps) {
    const queryUiYears = useQueryUIStore((state) => state.years);
    const setQueryUiYears = useQueryUIStore((state) => state.setYears);
    const arrestData = useArrestDataStore((state) => state.allArrestData)
    const setArrestData = useArrestDataStore((state) => state.setAllArrestData)
    const graphTypeWhenSet = useGraphDataStore((state) => state.graphTypeWhenSet)
    const setGraphTypeWhenSet = useGraphDataStore((state) => state.setGraphTypeWhenSet)
    const setPieChartData = useGraphDataStore((state) => state.setPieChartData)
    const setGraphParameterData = useGraphDataStore((state) => state.setGraphParameterData);
    const graphParameterData = useGraphDataStore((state) => state.graphParameterData);
    const setPieChartTitle = useGraphDataStore((state) => state.setPieChartGraphTitle);
    useEffect(() => {
        hljs.registerLanguage('json', json);
    }, []);
    const form = useForm<z.infer<typeof GetExpandedHomicideCollectionSchema>>({
        resolver: zodResolver(GetExpandedHomicideCollectionSchema),
        defaultValues: {
            year: queryUiYears.from || undefined,
            category: "offender",
        }
    });
    async function onSubmit(formData: z.infer<typeof GetExpandedHomicideCollectionSchema>, event: React.BaseSyntheticEvent | undefined) {
        if (event === undefined) {
            return;
        }
        setQueryUiYears(formData.year, queryUiYears.to);
        if (graphTypeWhenSet != "arrestsCategories") {
            props.setData([]);
        }
        setGraphTypeWhenSet("arrestsCategories");
        event.preventDefault();
        //@ts-expect-error - submitter is not a valid property on BaseSyntheticEvent because it is any type, but it will be on a form event
        const submitterAction = event.nativeEvent.submitter.getAttribute("value");
        const description = hljs.highlight(JSON.stringify(formData, null, 2), { language: 'json' }).value;
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md p-4">
                    <code dangerouslySetInnerHTML={{ __html: description }} />
                </pre>
            ),
        })
        props.startTransition(async () => {
            if (submitterAction === "create-graph") {
                let currentArrestData = arrestData;
                currentArrestData = await GetExpandedHomicideCollection(formData);
                setArrestData(currentArrestData);
                setPieChartData(currentArrestData[0].data);
                setPieChartTitle(`total homicide ${formData.category}s ${formData.variable}`, `${formData.year}`);
                const pieItems = ["pie", "donut", "radialBar", "barMixed", "radar"];
                if (!pieItems.includes(graphParameterData.graphType)) {
                    setGraphParameterData({
                        ...graphParameterData,
                        graphType: "barMixed",
                    });
                }
            }
        })
    }
    return (
        <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <fieldset className="grid gap-6 rounded-lg border p-4" >
                        <legend className="-ml-1 px-1 text-sm font-medium">
                            Query Parameters
                        </legend>
                        <div className="grid gap-3">
                            <FormField
                                name="category"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Person Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-1/2">
                                                <SelectValue placeholder="Select a type of person" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="offender">Offender</SelectItem>
                                                </SelectGroup>
                                                <SelectGroup>
                                                    <SelectItem value="victim">Victim</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField
                                name="variable"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Data to search</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-1/2">
                                                <SelectValue placeholder="Select the data to retrieve" />
                                            </SelectTrigger>
                                            <SelectContent>
                                               {validExpandedHomicideVariables[form.getValues().category].map((variable, index) => {
                                                    return <SelectGroup key={index}>
                                                         <SelectItem value={variable}>{variable}</SelectItem>
                                                    </SelectGroup>
                                               })}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            This is the variable that all national homicide data will be retrieved for.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <div className="flex flex-row w-full gap-x-4">
                                <FormField
                                    name="year"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel htmlFor="fromIn">Year</FormLabel>
                                            <FormControl>
                                                <Input id="fromIn" {...field} type="number" disabled={props.isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>
                        </div>
                        <div className="flex flex-row w-full">
                            {false && arrestData.length > 0 && graphTypeWhenSet == "arrestsCategories" && <Button type="submit" name="action" value="add-graph" disabled={props.isPending} className="w-[10rem] mr-4">
                                {props.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {!props.isPending && <> Add to graph</>}
                            </Button>}
                            <Button type="submit" name="action" value="create-graph" disabled={props.isPending} className="w-full">
                                {props.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {!props.isPending && arrestData.length === 0 && <> Create new Graph</>}
                                {!props.isPending && arrestData.length > 0 && <> Create new Graph</>}
                            </Button>
                        </div>
                    </fieldset>
                </form>
            </Form>
        </motion.div>
    )
}