import { CrimeDataGraph, MarkerData } from "@/lib/schemas/CDE";
import GetAgenciesForm from "./forms/get-agencies-form";
import GetNationalArrestsForm from "./forms/get-national-arrests-form";
import GetNationalCrimeForm from "./forms/get-national-crime-form";
import GetNationalArrestsByCategoryForm from "./forms/get-national-arrest-categories-form";
import {AnimatePresence, motion} from "framer-motion";
import GetNationalCrimeByStateForm from "./forms/get-national-crime-by-state-form";
import GetNationalExpandedHomicideForm from "./forms/get-expanded-homicide-national-form";
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
        <AnimatePresence>
        <motion.div>
            {queryState == "selectAgency" && <GetAgenciesForm startTransition={startTransition} isPending={isPending} setData={setMarkerData}/> }
            {queryState == "selectNationalCrime" && <GetNationalCrimeForm startTransition={startTransition} isPending={isPending} setData={setGraphData} data={graphData}/> }
            {queryState == "selectNationalCrimeByState" && <GetNationalCrimeByStateForm startTransition={startTransition} isPending={isPending} setData={setGraphData} data={graphData}/> }
            {queryState == "selectNationalArrests" && <GetNationalArrestsForm startTransition={startTransition} isPending={isPending} setData={setGraphData} data={graphData}/> }
            {queryState == "selectNationalArrestCategories" && <GetNationalArrestsByCategoryForm startTransition={startTransition} isPending={isPending} setData={setGraphData} /> }
            {queryState == "selectNationalExpandedHomicide" && <GetNationalExpandedHomicideForm startTransition={startTransition} isPending={isPending} setData={setGraphData} /> }
        </motion.div>
        </AnimatePresence>
    )
}