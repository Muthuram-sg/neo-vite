import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const UseEntity = () => {
    const [EntityLoading, setLoading] = useState(false);
    const [EntityData, setData] = useState(null);
    const [EntityError, setError] = useState(null);

    const getEntity = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.GetEntityList, {line_id: line_id})
            .then((returnData) => {
                if (returnData.neo_skeleton_entity) {
                    setData(returnData.neo_skeleton_entity)
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
                console.log("NEW MODEL", e, "Entity Setting", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { EntityLoading, EntityData, EntityError, getEntity };
};

export default UseEntity;