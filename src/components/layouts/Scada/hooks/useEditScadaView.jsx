import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useEditScadaView = () => {
    const [EditScadaViewLoading, setLoading] = useState(false); 
    const [EditScadaViewError, setError] = useState(null); 
    const [EditScadaViewData, setData] = useState(null); 

    const getEditScadaView = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.UpdateScadaViewName,body)
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.update_neo_skeleton_scada_dashboard) {  
                    setData(returnData.update_neo_skeleton_scada_dashboard)
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
    return {  EditScadaViewLoading, EditScadaViewData, EditScadaViewError, getEditScadaView };
};

export default useEditScadaView;