import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useDeleteCo2Factor = () => {
    const [DeleteCo2FactorLoading, setLoading] = useState(false); 
    const [DeleteCo2FactorError, setError] = useState(null); 
    const [DeleteCo2FactorData, setData] = useState(null); 

    const getDeleteCo2Factor = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.DeleteCo2,{ id:id})
        
            .then((returnData) => {
                if (returnData.delete_neo_skeleton_co2_factor) {
                    setData(returnData.delete_neo_skeleton_co2_factor)
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
                console.log("NEW MODEL", "ERR", e, "ToolLife Setting", new Date())
            });

    };
    return {  DeleteCo2FactorLoading, DeleteCo2FactorData, DeleteCo2FactorError, getDeleteCo2Factor };
};

export default useDeleteCo2Factor;