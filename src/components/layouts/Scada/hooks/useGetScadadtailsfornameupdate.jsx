import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetScadadetailsfornameupdate = () => {
    const [GetScadadetailsfornameupdateLoading, setLoading] = useState(false); 
    const [GetScadadetailsfornameupdateError, setError] = useState(null); 
    const [GetScadadetailsfornameupdateData, setData] = useState(null); 

    const getGetScadadetailsfornameupdate = async (scadaID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.GetmyScadaDetailsfornameupdate,{"scada_id": scadaID})
        
            .then((returnData) => {  
                if (returnData !== undefined && returnData) { 
                   // console.log("API Response:", returnData);
                    if(returnData.neo_skeleton_scada_dashboard){
                        setData(returnData.neo_skeleton_scada_dashboard)
                        setError(false)
                        setLoading(false)
                        
                    }
                    
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
    return {  GetScadadetailsfornameupdateLoading, GetScadadetailsfornameupdateError, GetScadadetailsfornameupdateData, getGetScadadetailsfornameupdate};
};

export default useGetScadadetailsfornameupdate;