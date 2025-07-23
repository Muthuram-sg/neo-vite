import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useUpdateScadaData = () => {
    const [UpdateScadaDataLoading, setLoading] = useState(false); 
    const [UpdateScadaDataError, setError] = useState(null); 
    const [UpdateScadaDataData, setData] = useState(null); 

    const getUpdateScadaData = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.updateScadaData,body)
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.update_neo_skeleton_scada_dashboard) {  
                    setData(returnData.update_neo_skeleton_scada_dashboard)
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
                console.log("NEW MODEL", "ERR", e, "Scada", new Date())
            });

    };
    return {  UpdateScadaDataLoading, UpdateScadaDataData, UpdateScadaDataError, getUpdateScadaData };
};

export default useUpdateScadaData;