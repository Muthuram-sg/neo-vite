import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useDeletefavstar = () => {
    const [DeletefavstarLoading, setLoading] = useState(false); 
    const [DeletefavstarError, setError] = useState(null); 
    const [DeletefavstarData, setData] = useState(null); 

    const getDeletefavstar = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.Deletefavstardashborad,body)
        //await configParam.RUN_GQL_API(Mutation.DeleteScadaViewbyuserid,body)
            .then((returnData) => { 
                if (returnData !== undefined && returnData.delete_neo_skeleton_scada_dash_star_fav.affected_rows >= 1 ) {  
                    setData(returnData.delete_neo_skeleton_scada_dash_star_fav.affected_rows)
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
    return {  DeletefavstarLoading, DeletefavstarData, DeletefavstarError, getDeletefavstar };
};

export default useDeletefavstar;