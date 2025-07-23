import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useAddCo2 = () => {
    const [AddCo2Loading, setLoading] = useState(false); 
    const [AddCo2Error, setError] = useState(null); 
    const [AddCo2Data, setData] = useState(null); 

    const getAddCo2 = async (co2_value,starts_at,ends_at,line_id,default_value,created_by) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.AddCo2,{ co2_value: co2_value,starts_at: starts_at, ends_at: ends_at, line_id:line_id, default_value: default_value, created_by: created_by})
        
            .then((returnData) => {
                if (returnData.insert_neo_skeleton_co2_factor) {
                    setData(returnData.insert_neo_skeleton_co2_factor)
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
    return {  AddCo2Loading, AddCo2Data, AddCo2Error, getAddCo2 };
};

export default useAddCo2;