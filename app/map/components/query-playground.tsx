"use client"
import {
  Share,
  MapIcon,
  LineChartIcon,
  PieChartIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"

import { CrimeDataGraph, MarkerData } from "@/lib/schemas/CDE"
import { useRef, useState, useTransition } from "react"
import ReactMapBoxMap from "@/components/myui/map-box-react"
import GraphPanel from "./graphs/graph-panel"
import GraphPickerPie from "./graphs/graph-picker-pie"
import QueryParametersPanel from "./query-parameters-component"
import GraphPicker from "./graphs/graph-picker"
import { toPng } from "html-to-image"
export default function QueryDashboard() {
  const printRef = useRef(null);

  const htmlToImageConvert = () => {
    if (!printRef.current) return;
    toPng(printRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "chart-export.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [queryState, setQueryState] = useState<string>("")
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState<MarkerData[]>([])
  const [graphData, setGraphData] = useState<CrimeDataGraph[]>([])
  const handleSelect = (value:string) => {
    setQueryState(value)
  }
  return (
    <TooltipProvider>
      <div className="grid h-screen w-full">
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
            <h1 className="text-xl font-semibold">FBI Crime Data API Explorer</h1>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto gap-1.5 text-sm"
              onClick={htmlToImageConvert}
            >
              <Share className="size-3.5" />
              Export
            </Button>
          </header>
          <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
            <div
              className="relative flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0"
            >
              <div className="grid w-full items-start gap-6">
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Settings
                  </legend>
                  <div className="grid gap-3">
                    <Label htmlFor="model">Query</Label>
                    <Select disabled={isPending} onValueChange={handleSelect}>
                      <SelectTrigger
                        id="model"
                        className="items-start [&_[data-description]]:hidden"
                      >
                        <SelectValue placeholder="Select a query" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="selectAgency">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <MapIcon className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                GET{" "}
                                <span className="font-medium text-foreground">
                                  agency
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                Get police agencies by state.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="selectNationalArrests">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <LineChartIcon className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                GET{" "}
                                <span className="font-medium text-foreground">
                                  total arrests
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                  Get national yearly arrests by offense name for a year range.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="selectNationalCrime">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <LineChartIcon className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                GET{" "}
                                <span className="font-medium text-foreground">
                                  total estimates
                                </span>
                              </p>
                              <p className="text-xs" data-description>     
                                  Get national yearly estimates by crime name for a year range.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="selectNationalCrimeByState">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <LineChartIcon className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                GET{" "}
                                <span className="font-medium text-foreground">
                                  total estimates by state
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                  State-specific yearly estimates by crime and time range.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="selectNationalExpandedHomicide">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <PieChartIcon className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                              GET{" "}
                                <span className="font-medium text-foreground">
                                  homicide data
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                  Expanded national homicide data from SRS and NIBRS reports for a specific year.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="selectNationalArrestCategories">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <PieChartIcon className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                GET{" "}
                                <span className="font-medium text-foreground">
                                  total arrests by category
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                  National arrests by category for a specific year.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </fieldset>
                <QueryParametersPanel queryState={queryState} startTransition={startTransition} isPending={isPending} setMarkerData={setData} setGraphData={setGraphData} graphData={graphData}/>
                {queryState != "selectAgency" && queryState != "selectNationalArrestCategories" && queryState != "selectNationalExpandedHomicide" && queryState != "" && <GraphPicker />}
                {(queryState == "selectNationalArrestCategories" || queryState == "selectNationalExpandedHomicide") && <GraphPickerPie />}
              </div>
            </div>
            <div ref={printRef} className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-0 lg:col-span-2">
              <Badge variant="outline" className="absolute right-3 top-3 z-10 bg-secondary">
                {queryState ==="selectNationalCrime" || queryState === "selectNationalCrimeByState" ? "victims per 100k" : "output"}
              </Badge>
              {queryState == "selectAgency" &&<ReactMapBoxMap markerData={data} />}
              {queryState != "selectAgency" && <GraphPanel graphData={graphData} />}
            </div>
          </main>
        </div>
      </div>
      <div
              className="relative hidden flex-col items-start gap-8 md:hidden px-4" x-chunk="dashboard-03-chunk-0"
            >
              <div className="grid w-full items-start gap-6">
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Settings
                  </legend>
                  <div className="grid gap-3">
                    <Label htmlFor="model">Query</Label>
                    <Select disabled={isPending} onValueChange={handleSelect}>
                      <SelectTrigger
                        id="model"
                        className="items-start [&_[data-description]]:hidden"
                      >
                        <SelectValue placeholder="Select a query" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="selectAgency">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <MapIcon className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                GET{" "}
                                <span className="font-medium text-foreground">
                                  agency
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                Get police agencies by state.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="selectNationalArrests">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <LineChartIcon className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                GET{" "}
                                <span className="font-medium text-foreground">
                                  total arrests
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                  Get national yearly arrests by offense name for a year range.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="selectNationalCrime">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <LineChartIcon className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                GET{" "}
                                <span className="font-medium text-foreground">
                                  total estimates
                                </span>
                              </p>
                              <p className="text-xs" data-description>     
                                  Get national yearly estimates by crime name for a year range.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="selectNationalCrimeByState">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <LineChartIcon className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                GET{" "}
                                <span className="font-medium text-foreground">
                                  total estimates by state
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                  State-specific yearly estimates by crime and time range.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="selectNationalExpandedHomicide">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <PieChartIcon className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                              GET{" "}
                                <span className="font-medium text-foreground">
                                  homicide data
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                  Expanded national homicide data from SRS and NIBRS reports for a specific year.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="selectNationalArrestCategories">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <PieChartIcon className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                GET{" "}
                                <span className="font-medium text-foreground">
                                  total arrests by category
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                  National arrests by category for a specific year.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </fieldset>
                <QueryParametersPanel queryState={queryState} startTransition={startTransition} isPending={isPending} setMarkerData={setData} setGraphData={setGraphData} graphData={graphData}/>
                {queryState != "selectAgency" && queryState != "selectNationalArrestCategories" && queryState != "selectNationalExpandedHomicide" && queryState != "" && <GraphPicker />}
                {(queryState == "selectNationalArrestCategories" || queryState == "selectNationalExpandedHomicide") && <GraphPickerPie />}
              </div>
            </div>
    </TooltipProvider>
  )
}