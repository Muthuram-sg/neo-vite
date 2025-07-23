import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useDeleteAnEntity = () => {
    const [DeleteAnEntityLoading, setLoading] = useState(false); 
    const [DeleteAnEntityError, setError] = useState(null); 
    const [DeleteAnEntityData, setData] = useState(null); 

    const getDeleteAnEntity = async (entity_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.DeleteAnEntity,{ entity_id: entity_id})
        
            .then((returnData) => {
             
                if (returnData.delete_neo_skeleton_entity) {
                    setData(returnData.delete_neo_skeleton_entity)
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
    return {  DeleteAnEntityLoading, DeleteAnEntityData, DeleteAnEntityError, getDeleteAnEntity };
};

export default useDeleteAnEntity;