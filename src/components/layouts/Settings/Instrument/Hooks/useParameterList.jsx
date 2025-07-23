import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useParameterList = () => {
    const [ParameterListLoading, setLoading] = useState(false);
    const [ParameterListData, setData] = useState(null);
    const [ParameterListError, setError] = useState(null);

    const getParameterList = async () => {
        setLoading(true);

        await configParam.RUN_GQL_API(gqlQueries.getParameterList, {})
            .then((metrics) => {
                if (metrics !== undefined && metrics.neo_skeleton_metrics && metrics.neo_skeleton_metrics.length > 0) {
                    setData(metrics.neo_skeleton_metrics);
                    setError(false)
                    setLoading(false)
                } else {
                   
                    setData(null)
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { ParameterListLoading, ParameterListData, ParameterListError, getParameterList };
}


export default useParameterList;