import { CrimeDataGraph, MarkerData } from "@/lib/schemas/CDE";
import GetAgenciesForm from "./get-agencies-form";
import GetNationalArrestsForm from "./get-national-arrests-form";
import GetNationalCrimeForm from "./get-national-crime-form";
import { GraphParamterData } from "./graph-picker";
interface QueryParametersPanelProps {
    queryState: string;
    startTransition: (callback: () => void) => void;
    isPending: boolean;
    setMarkerData: (data: MarkerData[]) => void;
    setGraphData: (data: CrimeDataGraph[]) => void;
    graphData: CrimeDataGraph[];
}
export default function QueryParametersPanel(props: QueryParametersPanelProps) {
    const { queryState, startTransition, isPending, setMarkerData, setGraphData, graphData } = props;
    return (
        <div>
            {queryState == "selectAgency" && <GetAgenciesForm startTransition={startTransition} isPending={isPending} setData={setMarkerData}/> }
            {queryState == "selectNationalCrime" && <GetNationalCrimeForm startTransition={startTransition} isPending={isPending} setData={setGraphData} data={graphData}/> }
            {queryState == "selectNationalArrests" && <GetNationalArrestsForm startTransition={startTransition} isPending={isPending} setData={setGraphData} data={graphData}/> }
        </div>
    )
}