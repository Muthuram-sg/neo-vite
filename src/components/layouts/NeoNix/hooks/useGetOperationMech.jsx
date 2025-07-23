import { useState } from "react";
import configParam from "config"; 

const useGetOperMech = () => {
    const [OperMechLoading, setLoading] = useState(false);
    const [OperMechData, setData] = useState(null);
    const [OperMechError, setError] = useState(null);

    const getOperMech = async () => {
        setLoading(true); 
        let url = "/neonix-api/api/OperationMaster/GetAvailableMachine";
        await configParam.RUN_REST_API(url, "",'','',"Get")
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

    return { OperMechLoading, OperMechData, OperMechError, getOperMech };
}


export default useGetOperMech;