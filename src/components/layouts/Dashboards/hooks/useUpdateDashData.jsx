import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useUpdateDashData = () => {
    const [UpdateDashDataLoading, setLoading] = useState(false); 
    const [UpdateDashDataError, setError] = useState(null); 
    const [UpdateDashDataData, setData] = useState(null); 

    const getUpdateDashData = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.UpdateDashboardDATA,body)
        
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
    return {  UpdateDashDataLoading, UpdateDashDataData, UpdateDashDataError, getUpdateDashData };
};

export default useUpdateDashData;