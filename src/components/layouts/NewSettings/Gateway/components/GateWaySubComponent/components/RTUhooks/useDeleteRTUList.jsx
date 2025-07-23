import { useState } from "react";
import configParam from "config"; 

const useDeleteRTUData = () => {
    const [DeleteRTUDataLoading, setLoading] = useState(false);
    const [DeleteRTUDataData, setData] = useState(null);
    const [DeleteRTUDataError, setError] = useState(null);

    const DeleteRTUData  = async (body) => {
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
                console.log("NEW MODEL", "ERR", e, "DeleteRTUData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { DeleteRTUDataLoading, DeleteRTUDataData, DeleteRTUDataError, DeleteRTUData };
}


export default useDeleteRTUData;