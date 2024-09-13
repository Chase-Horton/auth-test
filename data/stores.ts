import { CrimeDataGraph } from '@/lib/schemas/CDE';
import { GraphParamterData } from '@/app/map/components/graph-picker-pie';
import {create} from 'zustand';
export type ArrestData = {
    offense: string;
    arrests: number;
}
//TODO should replace data with an object that has key offense value arrests
export type ArrestDataYear = {
    year: number;
    data: ArrestData[];
}
type allArrestDataStoreType = {
    allArrestData: ArrestDataYear[];
    setAllArrestData: (data:ArrestDataYear[]) => void;
    from: number;
    setFrom: (year:number) => void;
    to: number;
    setTo: (year:number) => void;
}
export const useArrestDataStore = create<allArrestDataStoreType>((set) => ({
    allArrestData: [],
    from: 0,
    to: 0,
    setAllArrestData: (data:ArrestDataYear[]) => set({allArrestData:data}),
    setFrom: (year:number) => set({from:year}),
    setTo: (year:number) => set({to:year}),
}));
type GraphTypeWhenSet = "estimates" | "arrests" | "arrestsCategories";
type GraphDataStoreType = {
    graphData: CrimeDataGraph[];
    setGraphData: (data:CrimeDataGraph[]) => void;
    graphTypeWhenSet: GraphTypeWhenSet;
    setGraphTypeWhenSet: (type:GraphTypeWhenSet) => void;
    pieChartData: ArrestData[];
    setPieChartData: (data:ArrestData[]) => void;
    graphParameterData: GraphParamterData;
    setGraphParameterData: (data:GraphParamterData) => void;
    pieChartGraphTitleObj: {
        title: string;
        subtitle: string;
    }
    setPieChartGraphTitle: (title:string, subtitle:string) => void;
}
export const useGraphDataStore = create<GraphDataStoreType>((set) => ({
    graphData: [],
    setGraphData: (graphData:CrimeDataGraph[]) => set({graphData}),
    graphTypeWhenSet: "estimates",
    setGraphTypeWhenSet: (type:GraphTypeWhenSet) => set({graphTypeWhenSet:type}),
    pieChartData: [],
    setPieChartData: (data:ArrestData[]) => set({pieChartData:data}),
    graphParameterData: {
        graphType: "bar",
        allGraphParameters: [
            {showLegend: true, showXAxis: false, showYAxis: false},
            {showLegend: true, showXAxis: false, showYAxis: true},
            {showLegend: true, showXAxis: false, showYAxis: false},
            {showLegend: true, showXAxis: false, showYAxis: false},
            {showLegend: true, showXAxis: false, showYAxis: false},
            {showLegend: true, showXAxis: false, showYAxis: false},
            {showLegend: true, showXAxis: false, showYAxis: false},
            {showLegend: true, showXAxis: false, showYAxis: false},
            {showLegend: true, showXAxis: false, showYAxis: false},
          ],
    },
    setGraphParameterData: (data:GraphParamterData) => set({graphParameterData:data}),
    pieChartGraphTitleObj: {
        title: "",
        subtitle: "",
    },
    setPieChartGraphTitle: (title:string, subtitle:string) => set({pieChartGraphTitleObj:{title, subtitle}}),
}));