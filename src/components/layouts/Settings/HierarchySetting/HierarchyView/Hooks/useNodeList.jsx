import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useNodeList = () => {
    const [entityListLoading, setLoading] = useState(false);
    const [entityListData, setData] = useState(null);
    const [entityListError, setError] = useState(null); 
    const entityList = async (line_id) => { 
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getEntityWithoutAssert, {line_id: line_id})
            .then((response) => {
                if (response !== undefined && response.neo_skeleton_entity) {
                    setData(response.neo_skeleton_entity)
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
            });

    };
    return { entityListLoading, entityListData, entityListError, entityList };
};

export default useNodeList;