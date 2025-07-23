import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetHighPriorityAssetGT1M = () => {
    const [HighPriorityAssetGT1MLoading, setLoading] = useState(false);
    const [HighPriorityAssetGT1MError, setError] = useState(null);
    const [HighPriorityAssetGT1MData, setData] = useState(null);

    const getHighPriorityAssetGT1M = async (lineID, date) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getHighPriorityAssetGT1M, { line_id: lineID, date: date })

            .then((returnData) => {
                if (returnData !== undefined && returnData.neo_skeleton_tasks && returnData.neo_skeleton_tasks.length > 0) {

                    setData(returnData.neo_skeleton_tasks)
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
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "CMS Dashboard", new Date())
            });

    };
    return { HighPriorityAssetGT1MLoading, HighPriorityAssetGT1MData, HighPriorityAssetGT1MError, getHighPriorityAssetGT1M };
};

export default useGetHighPriorityAssetGT1M;