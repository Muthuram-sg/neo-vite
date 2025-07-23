import { useState } from "react";
import configParam from "config"; 

const useEditOffline = () => {
    const [editOfflineLoading, setLoading] = useState(false);
    const [editOfflineData, setData] = useState(null);
    const [editOfflineError, setError] = useState(null);

    const geteditOffline = async (obj) => {
        setLoading(true);
        let url = "/offline/editData";
        configParam.RUN_REST_API(url, {data:obj} ,'','','POST')
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

    return { editOfflineLoading, editOfflineData, editOfflineError, geteditOffline };
}


export default useEditOffline;