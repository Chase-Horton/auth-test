
import { GetAgencyByStateSchema, MarkerData } from "@/lib/schemas/CDE";
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
import { GetAgenciesByStateCode } from "@/actions/CDE";

const STATES = [
  {
    value: "KS",
    label: "Kansas",
  },
  {
    value: "WA",
    label: "Washington",
  },
  {
    value: "FL",
    label: "Florida",
  },
  {
    value: "CA",
    label: "California",
  },
  {
    value: "NY",
    label: "New York",
  },
]
interface AgencyFormProps {
  startTransition: (callback: () => void) => void;
  isPending:boolean;
  setData : (data: MarkerData[]) => void;
}
export default function GetAgenciesForm(props: AgencyFormProps) {
  useEffect(() => {
    hljs.registerLanguage('json', json);
  }, []);
  const form = useForm<z.infer<typeof GetAgencyByStateSchema>>({
    resolver: zodResolver(GetAgencyByStateSchema),
    defaultValues: {
      stateCode: ""
    },
  });
  async function onSubmit(data: z.infer<typeof GetAgencyByStateSchema>) {
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
      const agencies = await GetAgenciesByStateCode(data);
      const markers:MarkerData[] = [];
      agencies.forEach((agency) => {
        console.log(agency.agency_name, agency.ori);
        console.log(agency.latitude, agency.longitude);
        if(agency.latitude != null && agency.longitude != null) {
          markers.push({
            latitude: parseFloat(agency.latitude),
            longitude: parseFloat(agency.longitude),
            description: `${agency.agency_name} - ${agency.ori}`
          });
        }
      });
      props.setData(markers);
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset className="grid gap-6 rounded-lg border p-4" >
          <legend className="-ml-1 px-1 text-sm font-medium">
            Parameters
          </legend>
          <div className="grid gap-3">
            <FormField
              name="stateCode"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>State</FormLabel>
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
                            ? STATES.find(
                              (STATES) => STATES.value === field.value
                            )?.label
                            : "Select a state"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandList>
                          <CommandEmpty>No states found.</CommandEmpty>
                          <CommandGroup>
                            {STATES.map((STATES) => (
                              <CommandItem
                                value={STATES.label}
                                key={STATES.value}
                                onSelect={() => {
                                  form.setValue("stateCode", STATES.value)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    STATES.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {STATES.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the state that all agencies will be retrieved for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
          </div>
          <Button type="submit" disabled={props.isPending}>
            {props.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!props.isPending && <>Submit</>}
          </Button>
        </fieldset>
      </form>
    </Form>
  )
}