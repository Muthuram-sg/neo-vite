import { useState } from "react";
import configParam from "config";

const useGetDropDownOptions = () => {
    const [dropDownOptionsLoading, setLoading] = useState(false);
    const [dropDownOptionsData, setData] = useState(null);
    const [dropDownOptionsError, setError] = useState(null);

    const getDropDownOptions = async (type, params) => {
        setLoading(true);
        let url = `/neonix-api/api/${type}`;
         console.clear()
         console.log(type, url)
        let key = type.split("/").pop();
        await configParam.RUN_REST_API(url, params,'','',"GET")
            .then((response) => {
                if (response !== undefined && response) {
                   
                    console.log(key, response)
                    setData({[key]:response.response});
                    setError(false);
                    setLoading(false);
                } else {
                    setData(null);
                    setError(response);
                    setLoading(false);
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE", e, window.location.pathname.split("/").pop(), new Date());
                setLoading(false);
                setError(e);
                setData(null);
            });
    };

    return { dropDownOptionsLoading, dropDownOptionsData, dropDownOptionsError, getDropDownOptions };
};

export default useGetDropDownOptions;
