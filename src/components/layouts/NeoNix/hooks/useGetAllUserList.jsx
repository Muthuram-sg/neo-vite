import { useState } from "react";
import configParam from "config"; 

const useGetAllUsersList = () => {
    const [usersLoading, setLoading] = useState(false);
    const [usersData, setData] = useState(null);
    const [usersError, setError] = useState(null);

    const getAllUsers = async () => {
        setLoading(true); 
        let url = "/neonix-api/api/CustomerMaster/GetUserList";
        await configParam.RUN_REST_API(url, "",'','',"GET")
        .then((response) => {
            if (response !== undefined && Array.isArray(response.response)) {
                setData(response.response);
                    setError(false)
                    setLoading(false)
                }

                else {
                    setData([])
                    setError(response)
                    setLoading(false)
                }

            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData([]);
            })
    }

    return { usersLoading, usersData, usersError, getAllUsers };
}


export default useGetAllUsersList;