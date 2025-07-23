import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useAddDowntime = () => {
    const [AddDowntimeLoading, setLoading] = useState(false); 
    const [AddDowntimeError, setError] = useState(null); 
    const [AddDowntimeData, setData] = useState(null); 

    const getAddDowntime = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.addOutageWithoutOrderID,body)
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.insert_neo_skeleton_prod_outage_one) {  
                    setData(returnData.insert_neo_skeleton_prod_outage_one)
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
    return {  AddDowntimeLoading, AddDowntimeData, AddDowntimeError, getAddDowntime };
};

export default useAddDowntime;