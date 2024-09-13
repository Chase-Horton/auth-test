"use client"

import { Bar, BarChart, XAxis, Line, LineChart, AreaChart, Area, CartesianGrid, Pie, PieChart, RadarChart, Radar, PolarAngleAxis, PolarGrid, RadialBarChart, RadialBar, LabelList } from "recharts"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CrimeDataGraph } from "@/lib/schemas/CDE"
import { GraphParameters, GraphParamterData } from "./graph-picker-pie";
import { ArrestData, useGraphDataStore } from "@/data/stores";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
interface ChartDataItem {
    year: string;
    [key: string]: string | number
}
const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))",
    "hsl(var(--chart-6))", "hsl(var(--chart-7))"]
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
function StackedBarChartComponent(props: GraphComponentProps) {
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
                {chartLabels.map((label, index) => {
                    let radius: [number, number, number, number] = [0, 0, 0, 0];
                    if (index === 0 && chartLabels.length === 1) {
                        radius = [4, 4, 4, 4];
                    } else if (index === 0) {
                        radius = [0, 0, 4, 4];
                    } else if (index === chartLabels.length - 1) {
                        radius = [4, 4, 0, 0];
                    }
                    return (
                        <Bar
                            key={index}
                            dataKey={label}
                            fill={chartConfig[label].color}
                            radius={radius}
                            stackId={"a"}
                        />);
                })}
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
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={props.params.showXAxis} horizontal={props.params.showYAxis} strokeDasharray="" />
                <XAxis
                    dataKey="year"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.toString()}
                    scale={"point"}
                />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
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
type ArrestDataChart = ArrestData & { fill: string }
function PieChartComponent(_props: { showLegend: boolean }) {
    const { title, subtitle } = useGraphDataStore((state) => state.pieChartGraphTitleObj);
    const chartData: ArrestDataChart[] = [];
    const chartConfig: ChartConfig = {};
    const pieChartData = useGraphDataStore((state) => state.pieChartData);
    const pieChartDataMemoized = useMemo(() => pieChartData, [pieChartData]);
    const chartLabels = pieChartDataMemoized.map((data) => data.offense);
    for (let i = 0; i < pieChartDataMemoized.length; i++) {
        chartData.push({
            ...pieChartDataMemoized[i],
            fill: COLORS[i % COLORS.length]
        });
        chartConfig[pieChartDataMemoized[i].offense] = {
            label: pieChartDataMemoized[i].offense,
            color: COLORS[i % COLORS.length]
        }
    }
    return (
        <div className="min-h-[200px] h-full w-full flex flex-col">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <PieChart data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                {chartLabels.map((_label, index) => (
                    <Pie
                        data={chartData}
                        key={index}
                        dataKey={"arrests"}
                        nameKey={"offense"}
                        strokeOpacity={1}
                        fillOpacity={1}
                        opacity={0.8}
                    />
                ))}
            </PieChart>
        </ChartContainer>
        </div>
    )
}
function RadarChartComponent(_props: { showLegend: boolean }) {
    const chartData: ArrestData[] = [];
    const chartConfig: ChartConfig = {};
    const { title, subtitle } = useGraphDataStore((state) => state.pieChartGraphTitleObj);
    const pieChartData = useGraphDataStore((state) => state.pieChartData);
    for (let i = 0; i < pieChartData.length; i++) {
        chartData.push({ ...pieChartData[i], });
    }
    chartConfig.offense = {
        label: "arrests",
        color: COLORS[0]
    }

    return (
        <div className="min-h-[200px] h-full w-full flex flex-col">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
        <ChartContainer config={chartConfig} className="min-h-[200px] h-full w-full">
            <RadarChart data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="offense" />} />
                <PolarAngleAxis dataKey="offense" />
                <PolarGrid />
                <Radar
                    dataKey="arrests"
                    fill={COLORS[0]}
                    fillOpacity={0.6}
                />
            </RadarChart>
        </ChartContainer>
        </div>
    )
}
function DonutChartComponent(_props: { showLegend: boolean }) {
    const { title, subtitle } = useGraphDataStore((state) => state.pieChartGraphTitleObj);
    const chartData: ArrestDataChart[] = [];
    const chartConfig: ChartConfig = {};
    const pieChartData = useGraphDataStore((state) => state.pieChartData);
    const pieChartDataMemoized = useMemo(() => pieChartData, [pieChartData]);
    const chartLabels = pieChartDataMemoized.map((data) => data.offense);
    for (let i = 0; i < pieChartDataMemoized.length; i++) {
        chartData.push({
            ...pieChartDataMemoized[i],
            fill: COLORS[i % COLORS.length]
        });
        chartConfig[pieChartDataMemoized[i].offense] = {
            label: pieChartDataMemoized[i].offense,
            color: COLORS[i % COLORS.length]
        }
    }
    return (
        <div className="min-h-[200px] h-full w-full flex flex-col">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <PieChart data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                {chartLabels.map((_label, index) => (
                    <Pie
                        data={chartData}
                        key={index}
                        dataKey={"arrests"}
                        nameKey={"offense"}
                        strokeOpacity={1}
                        fillOpacity={1}
                        opacity={0.8}
                        innerRadius={70}
                    />
                ))}
            </PieChart>
        </ChartContainer>
        </div>
    )
}
function RadialBarChartComponent(_props: { showLegend: boolean }) {
    const { title, subtitle } = useGraphDataStore((state) => state.pieChartGraphTitleObj);
    const chartData: ArrestDataChart[] = [];
    const chartConfig: ChartConfig = {};
    const pieChartData = useGraphDataStore((state) => state.pieChartData);
    const sortedPieChartData = pieChartData.sort((a, b) => b.arrests - a.arrests);
    for (let i = 0; i < sortedPieChartData.length; i++) {
        chartData.push({
            ...sortedPieChartData[i],
            fill: COLORS[i % COLORS.length]
        });
        chartConfig[sortedPieChartData[i].offense] = {
            label: sortedPieChartData[i].offense,
            color: COLORS[i % COLORS.length]
        }
    }
    return (
        <div className="min-h-[200px] h-full w-full flex flex-col">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <RadialBarChart data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                }}
                innerRadius={"20%"}
                outerRadius={"100%"}
                startAngle={90}
                endAngle={-270}
            >
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="offense"/>} />
                <RadialBar
                    dataKey="arrests"
                    background 
                >
                     <LabelList
                position="insideStart"
                dataKey="offense"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={15}
              />
                </RadialBar>
            </RadialBarChart>
        </ChartContainer>
        </div>
    )
}
function BarChartMixedComponent(props: { showLegend: boolean }) {
    const chartData: ArrestDataChart[] = [];
    const chartConfig: ChartConfig = { arrests: { label: "arrests" } };
    const pieChartData = useGraphDataStore((state) => state.pieChartData);
    const { title, subtitle } = useGraphDataStore((state) => state.pieChartGraphTitleObj);
    for (let i = 0; i < pieChartData.length; i++) {
        chartData.push({
            ...pieChartData[i],
            fill: COLORS[i % COLORS.length]
        });
        chartConfig[pieChartData[i].offense] = {
            label: pieChartData[i].offense,
            color: COLORS[i % COLORS.length]
        }
    }
    return (
        <div className="min-h-[200px] h-full w-full flex flex-col">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <ChartContainer config={chartConfig} className="min-h-[200px] h-full w-full">
                <BarChart data={chartData}
                    margin={{
                        left: 12,
                        right: 12,
                        bottom: 320
                    }}
                >
                    <XAxis
                        dataKey="offense"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label || value.toString()}
                        textAnchor="end"
                        angle={-90}
                        fontSize={15}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                        dataKey={"arrests"}
                        radius={4}
                    />
                </BarChart>
            </ChartContainer>
        </div>
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
}
export default function GraphPanel(props: GraphPanelProps) {
    const graphData = props.graphData;
    const graphParameterData = useGraphDataStore((state) => state.graphParameterData);
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
    const listOfPieItems = ["pie", "radar", "donut", "radialBar", "barMixed"];
    if (chartValues.length === 0 && !listOfPieItems.includes(graphParameterData.graphType)) return null;
    if (!listOfPieItems.includes(graphParameterData.graphType)) {
        for (let i = 0; i < chartValues[0].length; i++) {
            const data: ChartDataItem = { "year": chartValues[0][i].year.toString() };
            for (let j = 0; j < chartLabels.length; j++) {
                data[chartLabels[j]] = chartValues[j][i].value;
            }
            chartData.push(data);
        }
    }
    const averages: Average = {};
    chartLabels.forEach((label) => {
        averages[label] = chartData.reduce((acc, data) => acc + Number(data[label]), 0) / chartData.length;
    })
    //sort the labels by the average value
    chartLabels.sort((a, b) => averages[b] - averages[a]);
    return (
        <div className="w-full h-full rounded-lg flex justify-center items-center p-0">
            {graphParameterData.graphType === "bar" && <BarChartComponent chartData={chartData} chartConfig={chartConfig} chartLabels={chartLabels} params={graphParameterData.allGraphParameters[0]} />}
            {graphParameterData.graphType === "line" && <LineChartComponent chartData={chartData} chartConfig={chartConfig} chartLabels={chartLabels} params={graphParameterData.allGraphParameters[1]} />}
            {graphParameterData.graphType === "area" && <AreaChartComponent chartData={chartData} chartConfig={chartConfig} chartLabels={chartLabels} params={graphParameterData.allGraphParameters[2]} />}
            {graphParameterData.graphType === "barStack" && <StackedBarChartComponent chartData={chartData} chartConfig={chartConfig} chartLabels={chartLabels} params={graphParameterData.allGraphParameters[3]} />}
            {graphParameterData.graphType === "pie" && <PieChartComponent showLegend={graphParameterData.allGraphParameters[4].showLegend} />}
            {graphParameterData.graphType === "radar" && <RadarChartComponent showLegend={graphParameterData.allGraphParameters[5].showLegend} />}
            {graphParameterData.graphType === "barMixed" && <BarChartMixedComponent showLegend={graphParameterData.allGraphParameters[6].showLegend} />}
            {graphParameterData.graphType === "donut" && <DonutChartComponent showLegend={graphParameterData.allGraphParameters[7].showLegend} />}
            {graphParameterData.graphType === "radialBar" && <RadialBarChartComponent showLegend={graphParameterData.allGraphParameters[7].showLegend} />}
        </div>
    )
}