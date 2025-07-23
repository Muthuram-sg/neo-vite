import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const UseAnalyticConfigList = () => {
    const [AnalyticConfigListLoading, setLoading] = useState(false);
    const [AnalyticConfigListData, setData] = useState(null);
    const [AnalyticConfigListError, setError] = useState(null);

    const getAnalyticConfigList = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.AnalyticConfigList)
            .then((returnData) => {
                if (returnData.neo_skeleton_prod_asset_analytics_config) {
                    setData(returnData.neo_skeleton_prod_asset_analytics_config)
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
                console.log("NEW MODEL", e, "AnalyticConfigList Setting", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { AnalyticConfigListLoading, AnalyticConfigListData, AnalyticConfigListError, getAnalyticConfigList };
};

export default UseAnalyticConfigList;