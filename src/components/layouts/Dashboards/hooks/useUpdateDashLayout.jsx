import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useUpdateDashLayout = () => {
    const [UpdateDashLayoutLoading, setLoading] = useState(false); 
    const [UpdateDashLayoutError, setError] = useState(null); 
    const [UpdateDashLayoutData, setData] = useState(null); 

    const getUpdateDashLayout = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.UpdateDashboardLAYOUT,body)
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.update_neo_skeleton_dashboard) {  
                    setData(returnData.update_neo_skeleton_dashboard)
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
                console.log("NEW MODEL", "ERR", e, "Dashboard", new Date())
            });

    };
    return {  UpdateDashLayoutLoading, UpdateDashLayoutData, UpdateDashLayoutError, getUpdateDashLayout };
};

export default useUpdateDashLayout;