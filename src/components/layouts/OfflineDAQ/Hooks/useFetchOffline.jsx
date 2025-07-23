import { useState } from "react";
import configParam from "config"; 

const useFetchOffline = () => {
    const [fetchOfflineLoading, setLoading] = useState(false);
    const [fetchOfflineData, setData] = useState(null);
    const [fetchOfflineError, setError] = useState(null);

    const getfetchOffline = async (schema,iid,from,to,freq,metrics) => {
        setLoading(true);
        const body = {
            schema: schema,
            iid: iid,
            from: from,
            to: to,
            freq: freq,
            metrics:metrics
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

    return { fetchOfflineLoading, fetchOfflineData, fetchOfflineError, getfetchOffline };
}


export default useFetchOffline;