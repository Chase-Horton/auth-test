import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import { Separator } from "@/components/ui/separator"
import { useState } from "react";
import { useGraphDataStore } from "@/data/stores";
export type GraphParameters = {
    showLegend: boolean;
    showXAxis: boolean;
    showYAxis: boolean;
}
export type GraphParamterData = {
    graphType: string;
    allGraphParameters: GraphParameters[]
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
export default function GraphPickerPie() {
    const [advanced, setAdvanced] = useState(false);
    const chartTypes = ["bar", "line", "area", "barStack", "pie", "radar", "barMixed", "donut", "radialBar"];
    const graphParameterData = useGraphDataStore((state) => state.graphParameterData);
    const setGraphParameterData = useGraphDataStore((state) => state.setGraphParameterData);
    const indexOfType = chartTypes.indexOf(graphParameterData.graphType);
    const paramData = graphParameterData.allGraphParameters[indexOfType];
    function onLegendChanged(checked: boolean | "indeterminate", paramValue: "showLegend" | "showXAxis" | "showYAxis") {
        if (checked === "indeterminate") return;
        setGraphParameterData({
            ...graphParameterData,
            allGraphParameters: graphParameterData.allGraphParameters.map((param, index) => {
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
                        <Select name="graphType" value={graphParameterData.graphType} onValueChange={(value) => setGraphParameterData({ ...graphParameterData, graphType: value })}>
                            <SelectTrigger className="w-1/2">
                                <SelectValue placeholder="Select a graph type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="barMixed">Bar</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectItem value="radialBar">Radial Bar</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectItem value="radar">Radar</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectItem value="pie">Pie</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectItem value="donut">Donut</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="flex flex-col justify-center items-end w-1/4 opacity-70 cursor-not-allowed">
                            <div className="flex space-x-2">
                                <Checkbox id="advanced" disabled={true} checked={advanced} onCheckedChange={(checked) => { if (checked !== "indeterminate") setAdvanced(checked) }} />
                                <label
                                    htmlFor="advanced"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Advanced Settings
                                </label>
                            </div>
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
                                    <Label htmlFor="showLegend">Show Labels</Label>
                                </motion.div>
                                <motion.div variants={item} className={`flex items-center space-x-2 ${indexOfType === 0 || indexOfType === 6 ? "cursor-not-allowed" : ""}`}>
                                    <Checkbox id="showXAxis" disabled={indexOfType === 0 || indexOfType === 6} checked={paramData.showXAxis} onCheckedChange={(checked) => onLegendChanged(checked, "showXAxis")} />
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