import { useState } from "react";
import configParam from "config"; 

const useAddOffline = () => {
    const [addOfflineLoading, setLoading] = useState(false);
    const [addOfflineData, setData] = useState(null);
    const [addOfflineError, setError] = useState(null);

    const getaddOffline = async (line,schema,body,freq) => { 
        setLoading(true);
        let url = "/offline/insertData";
        let bodyJson = {data:{lineid:line, schema: schema,data:body,frequency: freq}}
        configParam.RUN_REST_API(url, bodyJson ,'','','POST')
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

    return { addOfflineLoading, addOfflineData, addOfflineError, getaddOffline };
}


export default useAddOffline;