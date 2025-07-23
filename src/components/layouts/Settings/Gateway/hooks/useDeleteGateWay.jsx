import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useDeleteGateWay = () => {
    const [DeleteGateWayLoading, setLoading] = useState(false); 
    const [DeleteGateWayError, setError] = useState(null); 
    const [DeleteGateWayData, setData] = useState(null); 

    const getDeleteGateWay = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.DeleteGateWay,{ id: id})
        
            .then((returnData) => {
            
                if (returnData.delete_neo_skeleton_gateway) {
                    setData(returnData.delete_neo_skeleton_gateway)
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
                console.log("NEW MODEL", "ERR", e, "Entity Setting", new Date())
            });

    };
    return {  DeleteGateWayLoading, DeleteGateWayData, DeleteGateWayError, getDeleteGateWay };
};

export default useDeleteGateWay;