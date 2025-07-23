import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetAssetClass = () => {
    const [insClassLoading, setLoading] = useState(false);
    const [insClassData, setData] = useState(null);
    const [insClassError, setError] = useState(null);

    const getInsClass = async (entity_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getInsClass, {entity_id: entity_id})
            .then((returnData) => {
                if (returnData.neo_skeleton_instruments) {
                    setData(returnData.neo_skeleton_instruments)
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
                console.log("NEW MODEL", e, "Fault Analysis", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { insClassLoading, insClassData, insClassError, getInsClass };
};

export default useGetAssetClass;