import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useDeleteSensor = () => {
    const [DeleteSensorLoading, setLoading] = useState(false);
    const [DeleteSensorData, setData] = useState(null);
    const [DeleteSensorError, setError] = useState(null);

    const getDeleteSensor = async (id) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.delSensor,{id:id})
            .then((response) => {
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { DeleteSensorLoading, DeleteSensorData, DeleteSensorError, getDeleteSensor };
}


export default useDeleteSensor;