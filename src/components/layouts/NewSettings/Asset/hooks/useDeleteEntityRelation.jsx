import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useDeleteEntityRelation = () => {
    const [DeleteEntityRelationLoading, setLoading] = useState(false); 
    const [DeleteEntityRelationError, setError] = useState(null); 
    const [DeleteEntityRelationData, setData] = useState(null); 

    const getDeleteEntityRelation = async (entity_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.deleteEntityWithRelations,{ entity_id: entity_id})
        
            .then((returnData) => {
              
                if (returnData) {
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
                console.log("NEW MODEL", "ERR", e, "Entity Setting", new Date())
            });

    };
    return {  DeleteEntityRelationLoading, DeleteEntityRelationData, DeleteEntityRelationError, getDeleteEntityRelation };
};

export default useDeleteEntityRelation;