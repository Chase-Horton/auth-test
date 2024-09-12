"use client"

import { Bar, BarChart, XAxis } from "recharts"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CrimeDataGraph } from "@/lib/schemas/CDE"
interface ChartDataItem {
    year: number;
    [key: string]: number
}
const COLORS = ["#2563eb", "#60a5fa"]
function ChartComponent(props:GraphPanelProps) {
    const graphData = props.graphData;
    const chartLabels = graphData.map((data) => data.crime);
    const chartValues = graphData.map((data) => data.data);
    const chartConfig: ChartConfig = {};
    for(let i = 0; i < chartLabels.length; i++){
        chartConfig[chartLabels[i]] = {
            label: chartLabels[i].split("-").join(" "),
            color: COLORS[i % COLORS.length]
        }
    }
    const chartData = [];
    //for each year, append the data of each crime to the chartData array
    if(chartValues.length === 0) return null;
    for (let i = 0; i < chartValues[0].length; i++) {
        const data:ChartDataItem = {year: chartValues[0][i].year};
        for (let j = 0; j < chartLabels.length; j++) {
            data[chartLabels[j]] = chartValues[j][i].value;
        }
        chartData.push(data);
    }
    console.log(chartData);
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart data={chartData}>

                <XAxis
                    dataKey="year"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.toString()}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {chartLabels.map((label, index) => (
                <Bar
                    key={index}
                    dataKey={label}
                    fill={chartConfig[label].color} // Use color from chartConfig
                    radius={4}
                />
                ))}
            </BarChart>
        </ChartContainer>
    )
}
interface GraphPanelProps {
    graphData: CrimeDataGraph[];
}
export default function GraphPanel(props:GraphPanelProps) {
    return (
        <div className="w-full h-full rounded-lg flex justify-center items-center">
            <ChartComponent graphData={props.graphData} />
        </div>
    )
}