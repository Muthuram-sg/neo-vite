import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";
import moment from "moment";

const useLastOpened = () => {
    const [LastOpenedLoading, setLoading] = useState(false); 
    const [LastOpenedError, setError] = useState(null); 
    const [LastOpenedData, setData] = useState(null); 

    const getLastOpened = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.updateLastOpenedReport,{id:id,last_opened:moment().format("YYYY-MM-DDTHH:mm:ssZ")})
            .then((returnData) => {
                console.log(returnData,"getLastOpened")
                if (returnData !== undefined) {
                    setData(returnData)
                    setError(false)
                    setLoading(false)
                }
                else{
                setData(null)   
                setError(true)
                setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "Reports", new Date())
            });

    };
    return { LastOpenedLoading, LastOpenedData, LastOpenedError, getLastOpened };
};

export default useLastOpened;