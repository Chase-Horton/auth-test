import { CrimeDataGraph, CrimeDataNode, GetNationalArrestsByCrimeSchema, validArrestOffenseCodes } from "@/lib/schemas/CDE";
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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input";
import { GetNationalArrestsByOffenseAll } from "@/actions/CDE";
import { useArrestDataStore, useGraphDataStore, useQueryUIStore } from "@/data/stores";
const CRIMES = validArrestOffenseCodes.map((crime) => {
    return {
        label: crime,
        value: crime
    }
})
interface NationalArrestsProps {
    startTransition: (callback: () => void) => void;
    isPending: boolean;
    setData: (data: CrimeDataGraph[]) => void;
    data: CrimeDataGraph[];
}
export default function GetNationalArrestsForm(props: NationalArrestsProps) {
    const queryUiYears = useQueryUIStore((state) => state.years);
    const setQueryUiYears = useQueryUIStore((state) => state.setYears);
    const arrestData = useArrestDataStore((state) => state.allArrestData)
    const arrestDataFrom = useArrestDataStore((state) => state.from)
    const arrestDataTo = useArrestDataStore((state) => state.to)
    const setArrestData = useArrestDataStore((state) => state.setAllArrestData)
    const setArrestDataFrom = useArrestDataStore((state) => state.setFrom)
    const setArrestDataTo = useArrestDataStore((state) => state.setTo)
    const graphTypeWhenSet = useGraphDataStore((state) => state.graphTypeWhenSet)
    const setGraphTypeWhenSet = useGraphDataStore((state) => state.setGraphTypeWhenSet)
    const graphType = useGraphDataStore((state) => state.graphParameterData.graphType)
    const setGraphParameterData = useGraphDataStore((state) => state.setGraphParameterData);
    const validGraphTypes = ["bar", "barStack", "line", "area"];
    const graphParameterData = useGraphDataStore((state) => state.graphParameterData);
    const setTitleObj = useGraphDataStore((state) => state.setPieChartGraphTitle);
    const resetPie = useGraphDataStore((state) => state.resetChart);
    useEffect(() => {
        hljs.registerLanguage('json', json);
    }, []);
    const form = useForm<z.infer<typeof GetNationalArrestsByCrimeSchema>>({
        resolver: zodResolver(GetNationalArrestsByCrimeSchema),
        defaultValues: {
            offense: "",
            from: queryUiYears.from || undefined,
            to: queryUiYears.to || undefined,
        },
    });
    async function onSubmit(formData: z.infer<typeof GetNationalArrestsByCrimeSchema>, event: React.BaseSyntheticEvent | undefined) {
        setQueryUiYears(formData.from, formData.to);
        if (graphTypeWhenSet !== "arrests") {
            resetPie();
        }
        setGraphTypeWhenSet("arrests");
        if (event === undefined) {
            return;
        }
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
            let currentArrestData = arrestData;
            const crimes: CrimeDataNode[] = [];
            let currentArrestDataFrom = arrestDataFrom;
            let currentArrestDataTo = arrestDataTo;
            let newData = [...props.data];
            if (currentArrestData.length === 0 || currentArrestDataFrom > formData.from || currentArrestDataTo < formData.to) {
                const arrestDataYears = await GetNationalArrestsByOffenseAll(formData);
                setArrestData(arrestDataYears);
                currentArrestData = arrestDataYears;
                setArrestDataFrom(formData.from);
                setArrestDataTo(formData.to);
                currentArrestDataFrom = formData.from;
                currentArrestDataTo = formData.to;
            }
            if (submitterAction === "add-graph") {
                //map the current arrest data to new dataobject
                const nodes: CrimeDataGraph[] = [];
                for (let x = 0; x < props.data.length; x++) {
                    const node:CrimeDataNode[] = [];
                    for (let i = 0; i < currentArrestData.length; i++) {
                        const crime = currentArrestData[i].data.find((crime) => crime.offense === props.data[x].crime);
                        if (crime) {
                            node.push({ year: currentArrestData[i].year, value: crime.arrests });
                        }
                    }
                    nodes.push({ crime: props.data[x].crime, data: node });
                }
                newData = nodes;
            }

            for (let i = 0; i < currentArrestData.length; i++) {
                if (currentArrestData[i].year >= formData.from && currentArrestData[i].year <= formData.to) {
                    const crime = currentArrestData[i].data.find((crime) => crime.offense === formData.offense);
                    if (crime) {
                        crimes.push({ year: currentArrestData[i].year, value: crime.arrests });
                    }
                }
            }
            if (submitterAction === "add-graph") {
                const crimeIndex = newData.findIndex((crime) => crime.crime === formData.offense);
                if (crimeIndex === -1) {
                    setTitleObj("total arrests", `${formData.from} - ${formData.to}`);
                    props.setData([...newData, { crime: formData.offense, data: crimes }]);
                } else {
                    const newDataLst = [...newData];
                    newData[crimeIndex].data = crimes;
                    setTitleObj("total arrests", `${formData.from} - ${formData.to}`);
                    props.setData(newDataLst);
                    if (!validGraphTypes.includes(graphType)){
                        setGraphParameterData({
                            ...graphParameterData,
                            graphType: "bar"
                        });
                    }
                }
                return;
            }
            const crimeGraphs: CrimeDataGraph[] = [
                {
                    crime: formData.offense,
                    data: crimes
                }
            ];
            setTitleObj("total arrests", `${formData.from} - ${formData.to}`);
            props.setData(crimeGraphs);
            if (!validGraphTypes.includes(graphType)){
                setGraphParameterData({
                    ...graphParameterData,
                    graphType: "bar"
                });
            }
        });
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
                                name="offense"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Offense</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild disabled={props.isPending}>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? CRIMES.find(
                                                                (CRIMES) => CRIMES.value === field.value
                                                            )?.label
                                                            : "Select an offense"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[400px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search crimes..." />
                                                    <CommandList>
                                                        <CommandEmpty>No offenses found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {CRIMES.map((CRIMES) => (
                                                                <CommandItem
                                                                    value={CRIMES.label}
                                                                    key={CRIMES.value}
                                                                    onSelect={() => {
                                                                        form.setValue("offense", CRIMES.value)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            CRIMES.value === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {CRIMES.label}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            This is the offense that all national arrests will be retrieved for.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <div className="flex flex-row w-full gap-x-4">
                                <FormField
                                    name="from"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel htmlFor="fromIn">From</FormLabel>
                                            <FormControl>
                                                <Input id="fromIn" {...field} type="number" disabled={props.isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                <FormField
                                    name="to"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel htmlFor="toIn">To</FormLabel>
                                            <FormControl>
                                                <Input id="toIn" type="number" {...field} disabled={props.isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>
                        </div>
                        <div className="flex flex-row w-full">
                            {arrestData.length > 0 && graphTypeWhenSet == "arrests" && <Button type="submit" name="action" value="add-graph" disabled={props.isPending} className="w-[10rem] mr-4">
                                {props.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {!props.isPending && <> Add to graph</>}
                            </Button>}
                            <Button type="submit" name="action" value="create-graph" disabled={props.isPending} className="w-full">
                                {props.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {!props.isPending && arrestData.length === 0 && <> Submit</>}
                                {!props.isPending && arrestData.length > 0 && <> Create new Graph</>}
                            </Button>
                        </div>
                    </fieldset>
                </form>
            </Form>
        </motion.div>
    )
}