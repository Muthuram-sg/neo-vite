import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useUpdateSensor = () => {
    const [EditSensorLoading, setLoading] = useState(false);
    const [EditSensorData, setData] = useState(null);
    const [EditSensorError, setError] = useState(null);

    const getEditSensor = async ( body ) => {
        setLoading(true);

        await configParam.RUN_GQL_API(mutations.UpdateSensor,body)
            .then((response) => {
                if (response!== undefined && response.update_neo_skeleton_sensors) {
                    setData(response.update_neo_skeleton_sensors);
            
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

    return { EditSensorLoading, EditSensorData, EditSensorError, getEditSensor };
}


export default useUpdateSensor;