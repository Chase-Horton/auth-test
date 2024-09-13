import { GetNationalArrestsByCategoryCodeSchema, ValidNationalArrestByCategoryCategories } from "@/lib/schemas/CDE";
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
import { GetNationalArrestsByOffenseCategory } from "@/actions/CDE";
import { useArrestDataStore, useGraphDataStore } from "@/data/stores";
const CRIMES = ValidNationalArrestByCategoryCategories.map((crime) => {
    return {
        label: crime,
        value: crime,
    }
})
interface NationalArrestsProps {
    startTransition: (callback: () => void) => void;
    isPending: boolean;
}
export default function GetNationalArrestsByCategoryForm(props: NationalArrestsProps) {
    const arrestData = useArrestDataStore((state) => state.allArrestData)
    const arrestDataFrom = useArrestDataStore((state) => state.from)
    const arrestDataTo = useArrestDataStore((state) => state.to)
    const setArrestData = useArrestDataStore((state) => state.setAllArrestData)
    const setArrestDataFrom = useArrestDataStore((state) => state.setFrom)
    const setArrestDataTo = useArrestDataStore((state) => state.setTo)
    const graphTypeWhenSet = useGraphDataStore((state) => state.graphTypeWhenSet)
    const setGraphTypeWhenSet = useGraphDataStore((state) => state.setGraphTypeWhenSet)
    const setPieChartData = useGraphDataStore((state) => state.setPieChartData)
    const setGraphParameterData = useGraphDataStore((state) => state.setGraphParameterData);
    const graphParameterData = useGraphDataStore((state) => state.graphParameterData);
    const setPieChartTitle = useGraphDataStore((state) => state.setPieChartGraphTitle);
    useEffect(() => {
        hljs.registerLanguage('json', json);
    }, []);
    const form = useForm<z.infer<typeof GetNationalArrestsByCategoryCodeSchema>>({
        resolver: zodResolver(GetNationalArrestsByCategoryCodeSchema),
    });
    async function onSubmit(formData: z.infer<typeof GetNationalArrestsByCategoryCodeSchema>, event: React.BaseSyntheticEvent | undefined) {
        setGraphTypeWhenSet("arrestsCategories");
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
            if (submitterAction === "create-graph") {
                let currentArrestData = arrestData;
                let currentArrestDataFrom = arrestDataFrom;
                let currentArrestDataTo = arrestDataTo;
                formData.end = formData.year;
                currentArrestData = await GetNationalArrestsByOffenseCategory(formData);
                setArrestDataFrom(formData.year);
                setArrestDataTo(formData.end);
                setArrestData(currentArrestData);
                currentArrestDataFrom = formData.year;
                currentArrestDataTo = formData.end;
                setPieChartData(currentArrestData[0].data);
                setPieChartTitle(`Total Arrests for ${formData.category}`, `${formData.year}`);
                let pieItems = ["pie", "donut", "radialBar", "barMixed", "radar"];
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
                                        <FormLabel>Category</FormLabel>
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
                                                            : "Select an offense category"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[400px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search categories..." />
                                                    <CommandList>
                                                        <CommandEmpty>No categories found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {CRIMES.map((CRIMES) => (
                                                                <CommandItem
                                                                    value={CRIMES.label}
                                                                    key={CRIMES.value}
                                                                    onSelect={() => {
                                                                        //todo
                                                                        //@ts-expect-error - value string could be anything but we expect a string enum
                                                                        form.setValue("category", CRIMES.value)
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
                                            This is the offense category that all national arrests will be retrieved for.
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