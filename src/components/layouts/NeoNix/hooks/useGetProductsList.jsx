import { useState } from "react";
import configParam from "config"; 

const useGetAllProductsList = () => {
    const [productsLoading, setLoading] = useState(false);
    const [productsData, setData] = useState(null);
    const [productsError, setError] = useState(null);

    const getAllProducts = async () => {
        setLoading(true); 
        let url = "/neonix-api/api/ProductMaster/GetProductMaster";
        await configParam.RUN_REST_API(url, "",'','',"GET")
        .then((response) => {
            if (response !== undefined && (response)) {
                setData(response.response);
                    setError(false)
                    setLoading(false)
                }

                else {
                    setData(null)
                    setError(response)
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

    return { productsLoading, productsData, productsError, getAllProducts };
}


export default useGetAllProductsList;