import { useState } from "react";
import configParam from "config"; 

const useFetchSingle = () => {
    const [fetchSingleLoading, setLoading] = useState(false);
    const [fetchSingleData, setData] = useState(null);
    const [fetchSingleError, setError] = useState(null);

    const getfetchSingle = async (schema,iid,time) => {
        setLoading(true);
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("x-access-token", localStorage.getItem("neoToken").replace(/['"]+/g, ""));
        let url = configParam.API_URL + "/offline/fetchSingleData?schema="+schema+"&iid="+iid+"&time="+time;
        await fetch(url, {
            method: 'Get',
            headers: myHeaders 
        })
        .then(response => response.json()) 
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

    return { fetchSingleLoading, fetchSingleData, fetchSingleError, getfetchSingle };
}


export default useFetchSingle;