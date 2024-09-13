import { GetNationalCrimeByCrimeSchema, tempDisplayCrimeCodes, CrimeDataGraph, CrimeDataNode } from "@/lib/schemas/CDE";
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
import { GetNationalCrimesByCrimeCode } from "@/actions/CDE";

const CRIMES = tempDisplayCrimeCodes.map((crime) => {
    return {
        value: crime,
        label: crime.split("-").join(" ")
    }
});
interface NationalCrimeProps {
    startTransition: (callback: () => void) => void;
    isPending: boolean;
    setData: (data: CrimeDataGraph[]) => void;
    data: CrimeDataGraph[];
}
export default function GetNationalCrimeForm(props: NationalCrimeProps) {
    useEffect(() => {
        hljs.registerLanguage('json', json);
    }, []);
    const form = useForm<z.infer<typeof GetNationalCrimeByCrimeSchema>>({
        resolver: zodResolver(GetNationalCrimeByCrimeSchema),
        defaultValues: {
            crime: ""
        },
    });
    async function onSubmit(data: z.infer<typeof GetNationalCrimeByCrimeSchema>, event: React.BaseSyntheticEvent | undefined) {
        if(event === undefined){
            return;
        }
        event.preventDefault();
        //@ts-expect-error - submitter is not a valid property on BaseSyntheticEvent because it is any type, but it will be on a form event
        const submitterAction = event.nativeEvent.submitter.getAttribute("value");
        const description = hljs.highlight(JSON.stringify(data, null, 2), { language: 'json' }).value;
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md p-4">
                    <code dangerouslySetInnerHTML={{ __html: description }} />
                </pre>
            ),
        })
        props.startTransition(async () => {
            const crimes = await GetNationalCrimesByCrimeCode(data);

            const crimeDataNodes: CrimeDataNode[] = []
            Object.keys(crimes).forEach((key: string) => {
                crimeDataNodes.push({
                    year: Number(key),
                    value: crimes[key]
                });
            });
            if (submitterAction === "add-graph") {
                //check if the crime is already in the graph
                const crimeIndex = props.data.findIndex((crime) => crime.crime === data.crime);
                if (crimeIndex !== -1) {
                    const crimeGraphs = [...props.data];
                    crimeGraphs[crimeIndex].data = crimeDataNodes;
                    props.setData(crimeGraphs);
                    return;
                }
                const crimeGraphs: CrimeDataGraph[] = [
                    ...props.data,
                    {
                        crime: data.crime,
                        data: crimeDataNodes
                    }
                ];
                props.setData(crimeGraphs);
                return;
            }
            const crimeGraphs: CrimeDataGraph[] = [
                {
                    crime: data.crime,
                    data: crimeDataNodes
                }
            ];
            props.setData(crimeGraphs);
        });
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <fieldset className="grid gap-6 rounded-lg border p-4" >
                    <legend className="-ml-1 px-1 text-sm font-medium">
                        Query Parameters
                    </legend>
                    <div className="grid gap-3">
                        <FormField
                            name="crime"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Crime</FormLabel>
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
                                                        : "Select a crime"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search crimes..." />
                                                <CommandList>
                                                    <CommandEmpty>No states found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {CRIMES.map((CRIMES) => (
                                                            <CommandItem
                                                                value={CRIMES.label}
                                                                key={CRIMES.value}
                                                                onSelect={() => {
                                                                    form.setValue("crime", CRIMES.value)
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
                                        This is the crime that all national data will be retrieved for.
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
                        {props.data.length > 0 && <Button type="submit" name="action" value="add-graph" disabled={props.isPending} className="w-[10rem] mr-4">
                            {props.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {!props.isPending && <> Add to graph</>}
                        </Button>}
                        <Button type="submit" name="action" value="create-graph" disabled={props.isPending} className="w-full">
                            {props.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {!props.isPending && props.data.length === 0 && <> Submit</>}
                            {!props.isPending && props.data.length > 0 && <> Create new Graph</>}
                        </Button>
                    </div>
                </fieldset>
            </form>
        </Form>
    )
}