"use client"

import { Bar, BarChart, XAxis, Line, LineChart, AreaChart, Area } from "recharts"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CrimeDataGraph } from "@/lib/schemas/CDE"
interface ChartDataItem {
    year: number;
    [key: string]: number
}
const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"]
function BarChartComponent(props:GraphComponentProps) {
    const {chartData, chartConfig, chartLabels} = props;
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
                <ChartTooltip content={<ChartTooltipContent labelKey="year" hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} />
                {chartLabels.map((label, index) => (
                <Bar
                    key={index}
                    dataKey={label}
                    fill={chartConfig[label].color}
                    radius={4}
                />
                ))}
            </BarChart>
        </ChartContainer>
    )
}
function LineChartComponent(props:GraphComponentProps) {
    const {chartData, chartConfig, chartLabels} = props;
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <LineChart data={chartData}>

                <XAxis
                    dataKey="year"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.toString()}
                />
                <ChartTooltip content={<ChartTooltipContent labelKey="year" hideLabel indicator="dot" />} />
                <ChartLegend content={<ChartLegendContent />} />
                {chartLabels.map((label, index) => (
                <Line
                    key={index}
                    dataKey={label}
                    stroke={chartConfig[label].color}
                    dot={false}
                />
                ))}
            </LineChart>
        </ChartContainer>
    )
}
interface Average{
    [key: string]: number
}
function AreaChartComponent(props:GraphComponentProps) {
    const {chartData, chartConfig, chartLabels} = props;
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <AreaChart data={chartData}>

                <XAxis
                    dataKey="year"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.toString()}
                />
                <ChartTooltip content={<ChartTooltipContent labelKey="year" hideLabel indicator="dot"/>} />
                <ChartLegend content={<ChartLegendContent />} />
                {chartLabels.map((label, index) => (
                <Area
                    key={index}
                    dataKey={label}
                    stroke={chartConfig[label].color}
                    type="natural"
                    fill={chartConfig[label].color}
                    fillOpacity={0.4}
                    stackId="1"
                />
                ))}
            </AreaChart>
        </ChartContainer>
    )
}
interface GraphComponentProps {
    chartData: ChartDataItem[];
    chartConfig: ChartConfig;
    chartLabels: string[];
}
interface GraphPanelProps {
    graphData: CrimeDataGraph[];
    graphType: string;
}
export default function GraphPanel(props:GraphPanelProps) {
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
    const chartData:ChartDataItem[] = [];
    //for each year, append the data of each crime to the chartData array
    if(chartValues.length === 0) return null;
    for (let i = 0; i < chartValues[0].length; i++) {
        const data:ChartDataItem = {year: chartValues[0][i].year};
        for (let j = 0; j < chartLabels.length; j++) {
            data[chartLabels[j]] = chartValues[j][i].value;
        }
        chartData.push(data);
    }
    const averages:Average = {};
    chartLabels.forEach((label) => {
        averages[label] = chartData.reduce((acc, data) => acc + data[label], 0) / chartData.length;
    })
    //sort the labels by the average value
    chartLabels.sort((a, b) => averages[b] - averages[a]);
    return (
        <div className="w-full h-full rounded-lg flex justify-center items-center">
            {props.graphType === "bar" && <BarChartComponent chartData={chartData} chartConfig={chartConfig} chartLabels={chartLabels} /> }
            {props.graphType === "line" && <LineChartComponent chartData={chartData} chartConfig={chartConfig} chartLabels={chartLabels} /> }
            {props.graphType === "area" && <AreaChartComponent chartData={chartData} chartConfig={chartConfig} chartLabels={chartLabels} /> }
        </div>
    )
}