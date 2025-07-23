import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useDeleteScadaView = () => {
    const [DeleteScadaViewLoading, setLoading] = useState(false); 
    const [DeleteScadaViewError, setError] = useState(null); 
    const [DeleteScadaViewData, setData] = useState(null); 

    const getDeleteScadaView = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.DeleteScadaView,body)
        //await configParam.RUN_GQL_API(Mutation.DeleteScadaViewbyuserid,body)
            .then((returnData) => { 
                if (returnData !== undefined && returnData.delete_neo_skeleton_scada_dashboard.affected_rows >= 1 ) {  
                    setData(returnData.delete_neo_skeleton_scada_dashboard.affected_rows)
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
    return {  DeleteScadaViewLoading, DeleteScadaViewData, DeleteScadaViewError, getDeleteScadaView };
};

export default useDeleteScadaView;