import { useState } from "react";
import configParam from "config"; 

const useGetOfflineData = () => {
    const [offlineLoading, setLoading] = useState(false);
    const [offlineData, setData] = useState(null);
    const [offlineError, setError] = useState(null);

    const getOfflineData = async (schema,iid,from,to,freq) => {
        setLoading(true);
        const body = {
            schema: schema,
            iid: iid,
            from: from,
            to: to,
            freq: freq 
          }
         
        await configParam.RUN_REST_API("/offline/fetchData", body) 
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

    return { offlineLoading, offlineData, offlineError, getOfflineData };
}


export default useGetOfflineData;