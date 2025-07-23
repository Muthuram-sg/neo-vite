import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useEditDowntime = () => {
    const [EditDowntimeLoading, setLoading] = useState(false); 
    const [EditDowntimeError, setError] = useState(null); 
    const [EditDowntimeData, setData] = useState(null); 

    const getEditDowntime = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.editDowntime,body)
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.update_neo_skeleton_prod_outage) {  
                    setData(returnData.update_neo_skeleton_prod_outage)
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
                console.log("NEW MODEL", "ERR", e, "Reports", new Date())
            });

    };
    return {  EditDowntimeLoading, EditDowntimeData, EditDowntimeError, getEditDowntime };
};

export default useEditDowntime;