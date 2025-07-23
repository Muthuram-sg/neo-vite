import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const UseEntityType = () => {
    const [EntityTypeLoading, setLoading] = useState(false);
    const [EntityTypeData, setData] = useState(null);
    const [EntityTypeError, setError] = useState(null);

    const getEntityType = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.GetEntityType)
            .then((returnData) => {
              
                if (returnData.neo_skeleton_entity_types) {
                    setData(returnData.neo_skeleton_entity_types)
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
    return { EntityTypeLoading, EntityTypeData, EntityTypeError, getEntityType };
};

export default UseEntityType;