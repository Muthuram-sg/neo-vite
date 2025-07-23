import { useState } from "react";
import configParam from "config"; 

const useGetAllEnquiryList = () => {
    const [enquiryLoading, setLoading] = useState(false);
    const [enquiryData, setData] = useState(null);
    const [enquiryError, setError] = useState(null);

    const getAllEnquiries = async () => {
        setLoading(true); 
        let url = "/neonix-api/api/EnquiryMaster/GetAllEnquiryMaster";
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

    return { enquiryLoading, enquiryData, enquiryError, getAllEnquiries };
}


export default useGetAllEnquiryList;