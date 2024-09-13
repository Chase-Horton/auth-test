import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GraphPickerProps {
    setGraphType: (graphType: string) => void;
    graphType: string;
}
export default function GraphPicker(props: GraphPickerProps) {
    return (
        <fieldset className="grid gap-6 rounded-lg border p-4" >
            <legend className="-ml-1 px-1 text-sm font-medium">
                Graph Parameters
            </legend>
            <div className="grid gap-3">
                <Label htmlFor="graphType">Type</Label>
                <Select name="graphType" value={props.graphType} onValueChange={(value) => props.setGraphType(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a graph type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="bar">Bar</SelectItem>
                            <SelectItem value="line">Line</SelectItem>
                            <SelectItem value="area">Area</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </fieldset>
    )
}