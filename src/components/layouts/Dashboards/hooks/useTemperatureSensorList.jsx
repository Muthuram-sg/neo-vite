import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useTemperatureSensorData = () => {
    const [temperatureSensorListDataLoading, setLoading] = useState(false);
    const [temperatureSensorListDataData, setData] = useState(null);
    const [temperatureSensorListDataError, setError] = useState(null);

    const getTemperatureSensorListData = async (line_id) => {
       
        setLoading(true);

        configParam.RUN_GQL_API(gqlQueries.getAllTemperatureInstrumentData,{"line_id": line_id})
            .then((response) => {
                setData(response.neo_skeleton_instruments);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
            })
    }

    return { temperatureSensorListDataLoading, temperatureSensorListDataData, temperatureSensorListDataError, getTemperatureSensorListData };
}


export default useTemperatureSensorData;