
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

export const STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

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
            Query Parameters
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
                        <CommandInput placeholder="Search state..." />
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