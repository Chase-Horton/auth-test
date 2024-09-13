"use client"

import { Bar, BarChart, XAxis, Line, LineChart, AreaChart, Area, CartesianGrid } from "recharts"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CrimeDataGraph } from "@/lib/schemas/CDE"
import { GraphParameters, GraphParamterData } from "./graph-picker";
interface ChartDataItem {
    year: string;
    [key: string]: string | number
}
const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"]
function BarChartComponent(props: GraphComponentProps) {
    const { chartData, chartConfig, chartLabels } = props;
    const params = props.params;
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={params.showXAxis} horizontal={params.showYAxis} />
                <XAxis
                    dataKey="year"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.toString()}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                {params.showLegend && <ChartLegend content={<ChartLegendContent />} />}
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
function LineChartComponent(props: GraphComponentProps) {
    const { chartData, chartConfig, chartLabels } = props;
    const params = props.params;
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <LineChart data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={params.showXAxis} horizontal={params.showYAxis} />
                <XAxis
                    dataKey="year"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.toString()}
                    padding={{ left: 12, right: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                {params.showLegend && <ChartLegend content={<ChartLegendContent />} />}
                {chartLabels.map((label, index) => (
                    <Line
                        type="natural"
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
interface Average {
    [key: string]: number
}
function AreaChartComponent(props: GraphComponentProps) {
    const { chartData, chartConfig, chartLabels } = props;
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <AreaChart data={chartData}
                margin={{
                    left: 0,
                    right: 0,
                }}
            >
                <CartesianGrid vertical={props.params.showXAxis} horizontal={props.params.showYAxis} strokeDasharray="" />
                <XAxis
                    dataKey="year"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.toString()}
                    padding={{ left: 0, right: 0 }}
                    scale={"point"}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel indicator="dot" />} />
                {props.params.showLegend && <ChartLegend content={<ChartLegendContent />} />}
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
    params: GraphParameters;
}
interface GraphPanelProps {
    graphData: CrimeDataGraph[];
    graphParameterData: GraphParamterData;
}
export default function GraphPanel(props: GraphPanelProps) {
    const graphData = props.graphData;
    const chartLabels = graphData.map((data) => data.crime);
    const chartValues = graphData.map((data) => data.data);
    const chartConfig: ChartConfig = {};
    for (let i = 0; i < chartLabels.length; i++) {
        chartConfig[chartLabels[i]] = {
            label: chartLabels[i].split("-").join(" "),
            color: COLORS[i % COLORS.length]
        }
    }
    const chartData: ChartDataItem[] = [];
    //for each year, append the data of each crime to the chartData array
    if (chartValues.length === 0) return null;
    for (let i = 0; i < chartValues[0].length; i++) {
        const data: ChartDataItem = { "year": chartValues[0][i].year.toString() };
        for (let j = 0; j < chartLabels.length; j++) {
            data[chartLabels[j]] = chartValues[j][i].value;
        }
        chartData.push(data);
    }
    const averages: Average = {};
    chartLabels.forEach((label) => {
        averages[label] = chartData.reduce((acc, data) => acc + Number(data[label]), 0) / chartData.length;
    })
    //sort the labels by the average value
    chartLabels.sort((a, b) => averages[b] - averages[a]);
    return (
        <div className="w-full h-full rounded-lg flex justify-center items-center p-0">
            {props.graphParameterData.graphType === "bar" && <BarChartComponent chartData={chartData} chartConfig={chartConfig} chartLabels={chartLabels} params={props.graphParameterData.allGraphParameters[0]} />}
            {props.graphParameterData.graphType === "line" && <LineChartComponent chartData={chartData} chartConfig={chartConfig} chartLabels={chartLabels} params={props.graphParameterData.allGraphParameters[1]} />}
            {props.graphParameterData.graphType === "area" && <AreaChartComponent chartData={chartData} chartConfig={chartConfig} chartLabels={chartLabels} params={props.graphParameterData.allGraphParameters[2]} />}
        </div>
    )
}