import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useDeleteUserdefaultScadaView = () => {
    const [DeleteUserdefaultScadaViewLoading, setLoading] = useState(false); 
    const [DeleteUserdefaultScadaViewError, setError] = useState(null); 
    const [DeleteUserdefaultScadaViewData, setData] = useState(null); 

    const getDeleteUserdefaultScadaView = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.DeleteUserdefaultScadaView,body)
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.delete_neo_skeleton_user_default_scada_dashboard.affected_rows >= 1 ) {  
                    setData(returnData.delete_neo_skeleton_user_default_scada_dashboard.affected_rows)
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
    return {  DeleteUserdefaultScadaViewLoading, DeleteUserdefaultScadaViewData, DeleteUserdefaultScadaViewError, getDeleteUserdefaultScadaView };
};

export default useDeleteUserdefaultScadaView;