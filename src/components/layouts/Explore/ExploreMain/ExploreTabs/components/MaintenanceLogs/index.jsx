import React from "react";
import { useRecoilState } from "recoil";
import { selectedPlant} from "recoilStore/atoms";
import MaintenanceLogsList from "./components/MaintenanceLogsList"

export default function MaintenanceLogs() {

    const [headPlant] = useRecoilState(selectedPlant)

    return (
        <React.Fragment>
            <MaintenanceLogsList headPlant={headPlant} />
        </React.Fragment>
    )
}



