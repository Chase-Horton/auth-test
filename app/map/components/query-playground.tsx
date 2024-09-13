"use client"
import {
  Bird,
  Rabbit,
  Settings,
  Share,
  Turtle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"

import { CrimeDataGraph, MarkerData } from "@/lib/schemas/CDE"
import GetAgenciesForm from "./get-agencies-form"
import { useState, useTransition } from "react"
import ReactMapBoxMap from "@/components/myui/map-box-react"
import GetNationalCrimeForm from "./get-national-crime-form"
import GraphPanel from "./graph-panel"
import GraphPicker, { GraphParamterData } from "./graph-picker"
import GetNationalArrestsForm from "./get-national-arrests-form"

export default function QueryDashboard() {
  const [queryState, setQueryState] = useState<string>("")
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState<MarkerData[]>([])
  const [graphData, setGraphData] = useState<CrimeDataGraph[]>([])
  const [graphParameterData, setGraphParameterData] = useState<GraphParamterData>({graphType: "bar", allGraphParameters: [
    {showLegend: true, showXAxis: false, showYAxis: false},
    {showLegend: true, showXAxis: false, showYAxis: true},
    {showLegend: true, showXAxis: false, showYAxis: false},
    {showLegend: true, showXAxis: false, showYAxis: false},
  ]})
  return (
    <TooltipProvider>
      <div className="grid h-screen w-full">
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
            <h1 className="text-xl font-semibold">FBI Crime Data API Explorer</h1>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Settings className="size-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[80vh]">
                <DrawerHeader>
                  <DrawerTitle>Configuration</DrawerTitle>
                  <DrawerDescription>
                    Configure the settings for the model and messages.
                  </DrawerDescription>
                </DrawerHeader>
                <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                  <fieldset className="grid gap-6 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">
                      Settings
                    </legend>
                    <div className="grid gap-3">
                      <Label htmlFor="model">Model</Label>
                      <Select>
                        <SelectTrigger
                          id="model"
                          className="items-start [&_[data-description]]:hidden"
                        >
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="genesis">
                            <div className="flex items-start gap-3 text-muted-foreground">
                              <Rabbit className="size-5" />
                              <div className="grid gap-0.5">
                                <p>
                                  Neural{" "}
                                  <span className="font-medium text-foreground">
                                    Genesis
                                  </span>
                                </p>
                                <p className="text-xs" data-description>
                                  Our fastest model for general use cases.
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="explorer">
                            <div className="flex items-start gap-3 text-muted-foreground">
                              <Bird className="size-5" />
                              <div className="grid gap-0.5">
                                <p>
                                  Neural{" "}
                                  <span className="font-medium text-foreground">
                                    Explorer
                                  </span>
                                </p>
                                <p className="text-xs" data-description>
                                  Performance and speed for efficiency.
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="quantum">
                            <div className="flex items-start gap-3 text-muted-foreground">
                              <Turtle className="size-5" />
                              <div className="grid gap-0.5">
                                <p>
                                  Neural{" "}
                                  <span className="font-medium text-foreground">
                                    Quantum
                                  </span>
                                </p>
                                <p className="text-xs" data-description>
                                  The most powerful model for complex
                                  computations.
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="temperature">Temperature</Label>
                      <Input id="temperature" type="number" placeholder="0.4" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="top-p">Top P</Label>
                      <Input id="top-p" type="number" placeholder="0.7" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="top-k">Top K</Label>
                      <Input id="top-k" type="number" placeholder="0.0" />
                    </div>
                  </fieldset>
                  <fieldset className="grid gap-6 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">
                      Messages
                    </legend>
                    <div className="grid gap-3">
                      <Label htmlFor="role">Role</Label>
                      <Select defaultValue="system">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="assistant">Assistant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="content">Content</Label>
                      <Textarea id="content" placeholder="You are a..." />
                    </div>
                  </fieldset>
                </form>
              </DrawerContent>
            </Drawer>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto gap-1.5 text-sm"
            >
              <Share className="size-3.5" />
              Share
            </Button>
          </header>
          <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
            <div
              className="relative hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0"
            >
              <div className="grid w-full items-start gap-6">
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Settings
                  </legend>
                  <div className="grid gap-3">
                    <Label htmlFor="model">Query</Label>
                    <Select disabled={isPending} onValueChange={(value) => setQueryState(value)}>
                      <SelectTrigger
                        id="model"
                        className="items-start [&_[data-description]]:hidden"
                      >
                        <SelectValue placeholder="Select a query" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="selectAgency">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <Rabbit className="size-5" />
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
                        <SelectItem value="selectNationalCrime">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <Bird className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                GET{" "}
                                <span className="font-medium text-foreground">
                                  national estimates
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                  Get national estimate for crimes by crime name
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="selectNationalArrests">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <Bird className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                GET{" "}
                                <span className="font-medium text-foreground">
                                  national arrests
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                  Get national arrests by offense name
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </fieldset>
                {queryState == "selectAgency" && <GetAgenciesForm startTransition={startTransition} isPending={isPending} setData={setData}/> }
                {queryState == "selectNationalCrime" && <GetNationalCrimeForm startTransition={startTransition} isPending={isPending} setData={setGraphData} data={graphData}/> }
                {queryState == "selectNationalArrests" && <GetNationalArrestsForm startTransition={startTransition} isPending={isPending} setData={setGraphData} data={graphData}/> }
                {queryState != "selectAgency" && <GraphPicker setGraphParameterData={setGraphParameterData} graphParameterData={graphParameterData} />}
              </div>
            </div>
            <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-0 lg:col-span-2">
              <Badge variant="outline" className="absolute right-3 top-3 z-10 bg-secondary">
                {queryState != "selectNationalCrime" ? "Output" : "victims per 100k"}
              </Badge>
              {queryState == "selectAgency" &&<ReactMapBoxMap markerData={data} />}
              {queryState != "selectAgency" && <GraphPanel graphData={graphData} graphParameterData={graphParameterData}/>}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}