import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useUpdateFrequency = () => {
    const [UpdateFrequencyLoading, setLoading] = useState(false);
    const [UpdateFrequencyData, setData] = useState(null);
    const [UpdateFrequencyError, setError] = useState(null);

    const getUpdateFrequency = async (instruments_id,frequency ) => {
        setLoading(true);

        await configParam.RUN_GQL_API(mutations.UpdateFrequency,{instruments_id: instruments_id,frequency: frequency})
            .then((response) => {
                if (response!== undefined && response.update_neo_skeleton_instruments_metrics) {
                    setData(response.update_neo_skeleton_instruments_metrics);
                    setError(false)
                    setLoading(false)
                }
                else{
                setData(null)
                setError(true)
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

    return { UpdateFrequencyLoading, UpdateFrequencyData, UpdateFrequencyError, getUpdateFrequency };
}


export default useUpdateFrequency;