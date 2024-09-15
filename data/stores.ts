import { CrimeDataGraph } from '@/lib/schemas/CDE';
import { GraphParamterData } from '@/app/map/components/graphs/graph-picker-pie';
import {create} from 'zustand';
export type PieTypeData = {
    offense: string;
    arrests: number;
}
//TODO should replace data with an object that has key offense value arrests
export type PieTypeDataYear = {
    year: number;
    data: PieTypeData[];
}
type allArrestDataStoreType = {
    allArrestData: PieTypeDataYear[];
    setAllArrestData: (data:PieTypeDataYear[]) => void;
    from: number;
    setFrom: (year:number) => void;
    to: number;
    setTo: (year:number) => void;
}
export const useArrestDataStore = create<allArrestDataStoreType>((set) => ({
    allArrestData: [],
    from: 0,
    to: 0,
    setAllArrestData: (data:PieTypeDataYear[]) => set({allArrestData:data}),
    setFrom: (year:number) => set({from:year}),
    setTo: (year:number) => set({to:year}),
}));
type GraphTypeWhenSet = "estimates" | "estimates+" | "arrests" | "arrestsCategories";
type GraphDataStoreType = {
    graphData: CrimeDataGraph[];
    setGraphData: (data:CrimeDataGraph[]) => void;
    graphTypeWhenSet: GraphTypeWhenSet;
    setGraphTypeWhenSet: (type:GraphTypeWhenSet) => void;
    pieChartData: PieTypeData[];
    setPieChartData: (data:PieTypeData[]) => void;
    graphParameterData: GraphParamterData;
    setGraphParameterData: (data:GraphParamterData) => void;
    pieChartGraphTitleObj: {
        title: string;
        subtitle: string;
    }
    setPieChartGraphTitle: (title:string, subtitle:string) => void;
    resetChart: () => void;
}
export const useGraphDataStore = create<GraphDataStoreType>((set) => ({
    graphData: [],
    setGraphData: (graphData:CrimeDataGraph[]) => set({graphData}),
    graphTypeWhenSet: "estimates",
    setGraphTypeWhenSet: (type:GraphTypeWhenSet) => set({graphTypeWhenSet:type}),
    pieChartData: [],
    setPieChartData: (data:PieTypeData[]) => set({pieChartData:data}),
    graphParameterData: {
        graphType: "area",
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
    resetChart: () => set({pieChartData:[]}),
}));
type QueryUIStoreType = {
    years: {
        from: number;
        to: number;
    };
    setYears: (from:number, to:number) => void;
}
export const useQueryUIStore = create<QueryUIStoreType>((set) => ({
    years: {
        from: 0,
        to: 0,
    },
    setYears: (from:number, to:number) => set({years:{from, to}}),
}));