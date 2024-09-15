"use client"

import { Bar, BarChart, XAxis, Line, LineChart, AreaChart, Area, CartesianGrid, Pie, PieChart, RadarChart, Radar, PolarAngleAxis, PolarGrid, RadialBarChart, RadialBar, LabelList } from "recharts"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CrimeDataGraph } from "@/lib/schemas/CDE"
import { GraphParameters } from "./graph-picker-pie";
import { ArrestData, useGraphDataStore } from "@/data/stores";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
interface ChartDataItem {
    year: string;
    [key: string]: string | number
}
const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))",
    "hsl(var(--chart-6))", "hsl(var(--chart-7))"]
function BarChartComponent(props: GraphComponentProps) {
    const { chartData, chartConfig, chartLabels } = props;
    const params = props.params;
    const { title, subtitle } = useGraphDataStore((state) => state.pieChartGraphTitleObj);
    return (
        <div className="min-h-[200px] h-full w-full flex flex-col">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
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
        </div>
    )
}
function StackedBarChartComponent(props: GraphComponentProps) {
    const { chartData, chartConfig, chartLabels } = props;
    const params = props.params;
    const { title, subtitle } = useGraphDataStore((state) => state.pieChartGraphTitleObj);
    return (
        <div className="min-h-[200px] h-full w-full flex flex-col">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
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
        </div>
    )
}
function LineChartComponent(props: GraphComponentProps) {
    const { chartData, chartConfig, chartLabels } = props;
    const params = props.params;
    const { title, subtitle } = useGraphDataStore((state) => state.pieChartGraphTitleObj);
    return (
        <div className="min-h-[200px] h-full w-full flex flex-col">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
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
        </div>
    )
}
interface Average {
    [key: string]: number
}
function AreaChartComponent(props: GraphComponentProps) {
    const { chartData, chartConfig, chartLabels } = props;
    const { title, subtitle } = useGraphDataStore((state) => state.pieChartGraphTitleObj);
    return (
        <div className="min-h-[200px] h-full w-full flex flex-col">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
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
        </div>
    )
}
type ArrestDataChart = ArrestData & { fill: string }
//will use props eventually
//eslint-disable-next-line
function PieChartComponent({ showLegend }: { showLegend: boolean }) {
    const { title, subtitle } = useGraphDataStore((state) => state.pieChartGraphTitleObj);
    const pieChartData = useGraphDataStore((state) => state.pieChartData);
    const [chartConfig, setChartConfig] = useState<ChartConfig>({});
    const [chartData, setChartData] = useState<ArrestDataChart[]>([]);

    useEffect(() => {
        const pieChartDataMemoized = pieChartData.map(data => ({
            ...data,
            fill: COLORS[pieChartData.indexOf(data) % COLORS.length]
        }));

        const newChartConfig: ChartConfig = {};
        const newChartData: ArrestDataChart[] = [];

        for (let i = 0; i < pieChartDataMemoized.length; i++) {
            newChartConfig[pieChartDataMemoized[i].offense] = {
                label: pieChartDataMemoized[i].offense,
                color: COLORS[i % COLORS.length]
            };
            newChartData.push(pieChartDataMemoized[i]);
        }

        setChartConfig(newChartConfig);
        setChartData(newChartData);
    }, [pieChartData]);

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
                    {chartData.map((_data, index) => (
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
    );
}

//will use props eventually
//eslint-disable-next-line
function RadarChartComponent({ showLegend }: { showLegend: boolean }) {
    const [chartData, setChartData] = useState<ArrestData[]>([]);
    const [chartConfig, setChartConfig] = useState<ChartConfig>({});
    const { title, subtitle } = useGraphDataStore((state) => state.pieChartGraphTitleObj);
    const pieChartData = useGraphDataStore((state) => state.pieChartData);

    useEffect(() => {
        const newChartData = pieChartData.map(data => ({ ...data }));
        const newChartConfig = {
            offense: {
                label: "arrests",
                color: COLORS[0]
            }
        };
        setChartConfig(newChartConfig);
        setChartData(newChartData);
    }, [pieChartData]);

    return (
        <div className="min-h-[200px] h-full w-full flex flex-col">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <ChartContainer config={chartConfig} className="min-h-[200px] h-full w-full">
                <RadarChart
                    data={chartData}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                >
                    <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="offense" />} />
                    <PolarAngleAxis dataKey="offense" />
                    <PolarGrid />
                    <Radar dataKey="arrests" fill={COLORS[0]} fillOpacity={0.6} />
                </RadarChart>
            </ChartContainer>
        </div>
    )
}

//will use props eventually
//eslint-disable-next-line
function DonutChartComponent({ showLegend }: { showLegend: boolean }) {
    const [chartData, setChartData] = useState<ArrestDataChart[]>([]);
    const [chartConfig, setChartConfig] = useState<ChartConfig>({});
    const { title, subtitle } = useGraphDataStore((state) => state.pieChartGraphTitleObj);
    const pieChartData = useGraphDataStore((state) => state.pieChartData);

    const pieChartDataMemoized = useMemo(() => pieChartData.map(data => ({
        ...data,
        fill: COLORS[pieChartData.indexOf(data) % COLORS.length]
    })), [pieChartData]);

    useEffect(() => {
        const newChartConfig:ChartConfig = {};
        const newChartData: ArrestDataChart[] = [];

        pieChartDataMemoized.forEach((data, index) => {
            newChartConfig[data.offense] = {
                label: data.offense,
                color: COLORS[index % COLORS.length]
            };
            newChartData.push(data);
        });

        setChartConfig(newChartConfig);
        setChartData(newChartData);
    }, [pieChartDataMemoized]);

    const chartLabels = pieChartDataMemoized.map((data) => data.offense);

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
//will use props eventually
//eslint-disable-next-line
function RadialBarChartComponent({ showLegend }: { showLegend: boolean }) {
    const [chartData, setChartData] = useState<ArrestDataChart[]>([]);
    const [chartConfig, setChartConfig] = useState<ChartConfig>({});
    const { title, subtitle } = useGraphDataStore((state) => state.pieChartGraphTitleObj);
    const pieChartData = useGraphDataStore((state) => state.pieChartData);

    const sortedPieChartDataMemoized = useMemo(() => {
        return pieChartData.slice().sort((a, b) => b.arrests - a.arrests);
    }, [pieChartData]);

    useEffect(() => {
        const newChartConfig: ChartConfig = {};
        const newChartData: ArrestDataChart[] = [];

        for (let i = 0; i < sortedPieChartDataMemoized.length; i++) {
            newChartConfig[sortedPieChartDataMemoized[i].offense] = {
                label: sortedPieChartDataMemoized[i].offense,
                color: COLORS[i % COLORS.length]
            };
            newChartData.push({
                ...sortedPieChartDataMemoized[i],
                fill: COLORS[i % COLORS.length]
            });
        }

        setChartConfig(newChartConfig);
        setChartData(newChartData);
    }, [sortedPieChartDataMemoized]);

    return (
        <div className="min-h-[200px] h-full w-full flex flex-col">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <RadialBarChart
                    data={chartData}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                    innerRadius={"20%"}
                    outerRadius={"100%"}
                    startAngle={90}
                    endAngle={-270}
                >
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="offense" />} />
                    <RadialBar dataKey="arrests" background>
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
//will use props eventually
//eslint-disable-next-line
function BarChartMixedComponent({ showLegend }: { showLegend: boolean }) {
    const [chartData, setChartData] = useState<ArrestDataChart[]>([]);
    const [chartConfig, setChartConfig] = useState<ChartConfig>({ arrests: { label: "arrests" } });
    const pieChartData = useGraphDataStore((state) => state.pieChartData);
    const { title, subtitle } = useGraphDataStore((state) => state.pieChartGraphTitleObj);

    const pieChartDataMemoized = useMemo(() => pieChartData.map(data => ({
        ...data,
        fill: COLORS[pieChartData.indexOf(data) % COLORS.length]
    })), [pieChartData]);

    useEffect(() => {
        const newChartConfig: ChartConfig = { arrests: { label: "arrests" } };
        const newChartData: ArrestDataChart[] = [];

        pieChartDataMemoized.forEach((data, index) => {
            newChartConfig[data.offense] = {
                label: data.offense,
                color: COLORS[index % COLORS.length]
            };
            newChartData.push({
                ...data,
                fill: COLORS[index % COLORS.length]
            });
        });

        setChartConfig(newChartConfig);
        setChartData(newChartData);
    }, [pieChartDataMemoized]);

    return (
        <div className="min-h-[200px] h-full w-full flex flex-col">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <ChartContainer config={chartConfig} className="min-h-[200px] h-full w-full">
                <BarChart
                    data={chartData}
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
                    <Bar dataKey={"arrests"} radius={4} />
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
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    const [chartConfig, setChartConfig] = useState<ChartConfig>({});
    const [chartLabels, setChartLabels] = useState<string[]>([]);
    
    const graphData = props.graphData;
    const graphParameterData = useGraphDataStore((state) => state.graphParameterData);

    useEffect(() => {
        const labels = graphData.map((data) => data.crime.toLocaleLowerCase());
        const values = graphData.map((data) => data.data);
        const config: ChartConfig = {};
        
        for (let i = 0; i < labels.length; i++) {
            config[labels[i]] = {
                label: labels[i].split("-").join(" "),
                color: COLORS[i % COLORS.length]
            };
        }

        const data: ChartDataItem[] = [];
        const listOfPieItems = ["pie", "radar", "donut", "radialBar", "barMixed"];
        if (values.length !== 0 && !listOfPieItems.includes(graphParameterData.graphType)) {
            for (let i = 0; i < values[0].length; i++) {
                const dataItem: ChartDataItem = { "year": values[0][i].year.toString() };
                for (let j = 0; j < labels.length; j++) {
                    dataItem[labels[j]] = values[j][i].value;
                }
                data.push(dataItem);
            }
        }

        const averages: Average = {};
        labels.forEach((label) => {
            averages[label] = data.reduce((acc, data) => acc + Number(data[label]), 0) / data.length;
        });

        labels.sort((a, b) => averages[b] - averages[a]);
        
        setChartLabels(labels);
        setChartConfig(config);
        setChartData(data);
    }, [graphData, graphParameterData]);

    if (chartData.length === 0 && !["pie", "radar", "donut", "radialBar", "barMixed"].includes(graphParameterData.graphType)) return null;
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