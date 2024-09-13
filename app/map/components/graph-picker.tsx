import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import { Separator } from "@/components/ui/separator"
import { useState } from "react";
export type GraphParameters = {
    showLegend: boolean;
    showXAxis: boolean;
    showYAxis: boolean;
}
export type GraphParamterData = {
    graphType: string;
    allGraphParameters: GraphParameters[]
}

interface GraphPickerProps {
    setGraphParameterData: (data: GraphParamterData) => void;
    graphParameterData: GraphParamterData;
}
const container = {
    hidden: { opacity: 1, scale: 0, height: 0, overflow: "hidden" },
    visible: {
        opacity: 1,
        scale: 1,
        height: "auto",
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.15
        }
    }
};
const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};
export default function GraphPicker(props: GraphPickerProps) {
    const [advanced, setAdvanced] = useState(false);
    const chartTypes = ["bar", "line", "area", "barStack"];
    const indexOfType = chartTypes.indexOf(props.graphParameterData.graphType);
    const paramData = props.graphParameterData.allGraphParameters[indexOfType];
    function onLegendChanged(checked: boolean | "indeterminate", paramValue: "showLegend" | "showXAxis" | "showYAxis") {
        if (checked === "indeterminate") return;
        props.setGraphParameterData({
            ...props.graphParameterData,
            allGraphParameters: props.graphParameterData.allGraphParameters.map((param, index) => {
                if (index === indexOfType) {
                    const obj = { ...param }
                    obj[paramValue] = checked;
                    return obj;
                }
                return param;
            })
        })
    }
    return (
        <div>
            <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                    Graph Parameters
                </legend>
                <div className="grid">
                    <Label htmlFor="graphType" className="mb-3">Type</Label>
                    <div className="flex flex-row justify-between mb-2">
                        <Select name="graphType" value={props.graphParameterData.graphType} onValueChange={(value) => props.setGraphParameterData({...props.graphParameterData, graphType:value})}>
                            <SelectTrigger className="w-1/2">
                                <SelectValue placeholder="Select a graph type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="bar">Bar</SelectItem>
                                    <SelectItem value="barStack">Stacked Bar</SelectItem>
                                    <SelectItem value="line">Line</SelectItem>
                                    <SelectItem value="area">Area</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2 w-1/4">
                            <Checkbox id="advanced" checked={advanced} onCheckedChange={(checked) => { if (checked !== "indeterminate") setAdvanced(checked) }} />
                            <label
                                htmlFor="advanced"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Advanced Settings
                            </label>
                        </div>
                    </div>
                    <AnimatePresence mode="wait">
                        {advanced && <motion.div
                            variants={container}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="overflow-hidden"
                        >
                            <motion.div variants={item}>
                                <Separator className="mt-4 mb-3" />
                            </motion.div>
                            <div className="flex flex-row gap-x-4">
                                <motion.div variants={item} className="flex items-center space-x-2">
                                    <Checkbox id="showLegend" checked={paramData.showLegend} onCheckedChange={(checked) => onLegendChanged(checked, "showLegend")} />
                                    <Label htmlFor="showLegend">Show Legend</Label>
                                </motion.div>
                                <motion.div variants={item} className={`flex items-center space-x-2 ${indexOfType === 0 ? "cursor-not-allowed": ""}`}>
                                    <Checkbox id="showXAxis" disabled={indexOfType == 0} checked={paramData.showXAxis} onCheckedChange={(checked) => onLegendChanged(checked, "showXAxis")} />
                                    <Label htmlFor="showXAxis">Show X Axis</Label>
                                </motion.div>
                                <motion.div variants={item} className="flex items-center space-x-2">
                                    <Checkbox id="showYAxis" checked={paramData.showYAxis} onCheckedChange={(checked) => onLegendChanged(checked, "showYAxis")} />
                                    <Label htmlFor="showYAxis">Show Y Axis</Label>
                                </motion.div>
                            </div>
                        </motion.div>}
                    </AnimatePresence>
                </div>
            </fieldset>
        </div>
    )
}