import { useState } from "react";
import configParam from "config"; 

const useDeleteTCPData = () => {
    const [DeleteTCPDataLoading, setLoading] = useState(false);
    const [DeleteTCPDataData, setData] = useState(null);
    const [DeleteTCPDataError, setError] = useState(null);

    const DeleteTCPData  = async (body) => {
            setLoading(true);
            configParam.RUN_REST_API('/settings/DeleteDAQService', body, '', '', 'POST')
            .then((returnData) => {
                if(returnData !== undefined){
                    setData(returnData);
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
                console.log("NEW MODEL", "ERR", e, "DeleteTCPData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { DeleteTCPDataLoading, DeleteTCPDataData, DeleteTCPDataError, DeleteTCPData };
}


export default useDeleteTCPData;