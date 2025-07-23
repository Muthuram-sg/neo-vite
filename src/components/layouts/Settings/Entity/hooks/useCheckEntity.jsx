import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const UseCheckEntity = () => {
    const [CheckEntityLoading, setLoading] = useState(false);
    const [CheckEntityData, setData] = useState(null);
    const [CheckEntityError, setError] = useState(null);

    const getCheckEntity = async (entity_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getEntityRelations, {entity_id: entity_id})
            .then((returnData) => {
               
                if (returnData) {
                    setData(returnData)
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData([])
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "CheckEntity Setting", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { CheckEntityLoading, CheckEntityData, CheckEntityError, getCheckEntity };
};

export default UseCheckEntity;