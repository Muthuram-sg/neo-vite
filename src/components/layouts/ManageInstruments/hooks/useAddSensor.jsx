import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddSensor = () => {
    const [AddSensorLoading, setLoading] = useState(false);
    const [AddSensorData, setData] = useState(null);
    const [AddSensorError, setError] = useState(null);

    const getAddSensor = async ( body ) => {
        setLoading(true);

        await configParam.RUN_GQL_API(mutations.Addnewsensor,body)
            .then((response) => {
                if (response!== undefined && response.insert_neo_skeleton_sensors) {
                    setData(response.insert_neo_skeleton_sensors);
            
                    setError(false)
                    setLoading(false)
                }
                else{
                setData(null)
                setError(response)
                setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { AddSensorLoading, AddSensorData, AddSensorError, getAddSensor };
}


export default useAddSensor;