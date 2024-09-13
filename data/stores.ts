import { CrimeDataGraph } from '@/lib/schemas/CDE';
import {create} from 'zustand';
export type ArrestData = {
    offense: string;
    arrests: number;
}
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
type GraphTypeWhenSet = "estimates" | "arrests";
type GraphDataStoreType = {
    graphData: CrimeDataGraph[];
    setGraphData: (data:CrimeDataGraph[]) => void;
    graphTypeWhenSet: GraphTypeWhenSet;
    setGraphTypeWhenSet: (type:"estimates" | "arrests") => void;
}
export const useGraphDataStore = create<GraphDataStoreType>((set) => ({
    graphData: [],
    setGraphData: (graphData:CrimeDataGraph[]) => set({graphData}),
    graphTypeWhenSet: "estimates",
    setGraphTypeWhenSet: (type:GraphTypeWhenSet) => set({graphTypeWhenSet:type}),
}));