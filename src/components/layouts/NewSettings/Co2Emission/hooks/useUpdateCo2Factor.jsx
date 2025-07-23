import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useUpdateCo2Factor = () => {
    const [UpdateCo2FactorLoading, setLoading] = useState(false); 
    const [UpdateCo2FactorError, setError] = useState(null); 
    const [UpdateCo2FactorData, setData] = useState(null); 

    const getUpdateCo2Factor = async (id,name,starts_at,ends_at,updated_by) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.UpdateCo2Factor,{ id:id,co2_value:name, starts_at:starts_at,ends_at:ends_at, updated_by: updated_by})
        
            .then((returnData) => {
                if (returnData.update_neo_skeleton_co2_factor) {
                    setData(returnData.update_neo_skeleton_co2_factor)
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
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "ToolLife Setting", new Date())
            });

    };
    return {  UpdateCo2FactorLoading, UpdateCo2FactorData, UpdateCo2FactorError, getUpdateCo2Factor };
};

export default useUpdateCo2Factor;