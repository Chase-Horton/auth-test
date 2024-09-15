import { CrimeDataGraph, MarkerData } from "@/lib/schemas/CDE";
import GetAgenciesForm from "./forms/get-agencies-form";
import GetNationalArrestsForm from "./forms/get-national-arrests-form";
import GetNationalCrimeForm from "./forms/get-national-crime-form";
import GetNationalArrestsByCategoryForm from "./forms/get-national-arrest-categories-form";
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
            {queryState == "selectNationalArrestCategories" && <GetNationalArrestsByCategoryForm startTransition={startTransition} isPending={isPending} setData={setGraphData} /> }
        </div>
    )
}