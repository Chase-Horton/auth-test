import MapboxMap from "@/components/myui/map-box";
import QueryDashboard from "./components/query-playground";

export default function MapPage(){
    return (
        <div className="h-screen">
            <QueryDashboard/>
        </div>
    )
}