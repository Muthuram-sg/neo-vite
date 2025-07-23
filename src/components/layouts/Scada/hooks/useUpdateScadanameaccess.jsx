import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";
import Queries from 'components/layouts/Queries';

const useUpdateScadanameaccess = () => {
    const [UpdateScadanameaccessLoading, setLoading] = useState(false); 
    const [UpdateScadanameaccessError, setError] = useState(null); 
    const [UpdateScadanameaccessData, setData] = useState(null); 

    const getUpdateScadanameaccess = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.UpdateScadaNameandAccess,body)
        
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

    
    const checkScadaNameExists = async (name, lineId) => {
        setLoading(true);
        try {
            const result = await configParam.RUN_GQL_API(Queries.Checkscadanamebyline, { name, line_id: lineId });
            setLoading(false);
            return result?.neo_skeleton_scada_dashboard?.length > 0;
        } catch (e) {
            setLoading(false);
            setError(e);
            console.error("Error checking SCADA name", e);
            return false;
        }
    };
    return {  UpdateScadanameaccessLoading, UpdateScadanameaccessData, UpdateScadanameaccessError,checkScadaNameExists, getUpdateScadanameaccess };
};

export default useUpdateScadanameaccess;