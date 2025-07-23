import { useState } from "react";
import configParam from "config"; 

const useGetAllEnquiryPriority = () => {
    const [enquiryPriorityLoading, setLoading] = useState(false);
    const [enquiryPriorityData, setData] = useState(null);
    const [enquiryPriorityError, setError] = useState(null);

    const getAllEnquiryPriority = async () => {
        setLoading(true); 
        let url = "/neonix-api/api/EnquiryMaster/GetEnquiryPriority";
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

    return { enquiryPriorityLoading, enquiryPriorityData, enquiryPriorityError, getAllEnquiryPriority };
}


export default useGetAllEnquiryPriority;