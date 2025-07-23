import { useState } from "react";
import configParam from "config"; 

const useGetAllEnquiryType = () => {
    const [enquiryTypeLoading, setLoading] = useState(false);
    const [enquiryTypeData, setData] = useState(null);
    const [enquiryTypeError, setError] = useState(null);

    const getAllEnquiryType = async () => {
        setLoading(true); 
        let url = "/neonix-api/api/EnquiryMaster/GetEnquiryType";
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

    return { enquiryTypeLoading, enquiryTypeData, enquiryTypeError, getAllEnquiryType };
}


export default useGetAllEnquiryType;