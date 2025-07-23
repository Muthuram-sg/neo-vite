import { useState } from "react";
import configParam from "config"; 

const useDeleteOffline = () => {
    const [DeleteOfflineLoading, setLoading] = useState(false);
    const [DeleteOfflineData, setData] = useState(null);
    const [DeleteOfflineError, setError] = useState(null);

    const getDeleteOffline = async (schema,iid,key,time) => { 
        setLoading(true);
        let url = "/offline/deleteData";
        let body = {data:{schema: schema,iid: iid,key: key,time: time}}
        configParam.RUN_REST_API(url, body ,'','','POST')
            .then((response) => {
                if (response !== undefined && response.data) {
                    setData(response.data);
                    setError(false)
                    setLoading(false)
                }

                else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }

            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { DeleteOfflineLoading, DeleteOfflineData, DeleteOfflineError, getDeleteOffline };
}


export default useDeleteOffline;