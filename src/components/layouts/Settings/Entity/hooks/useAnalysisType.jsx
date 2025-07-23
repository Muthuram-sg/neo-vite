import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const UseAnalysisType = () => {
    const [AnalysisTypeLoading, setLoading] = useState(false);
    const [AnalysisTypeData, setData] = useState(null);
    const [AnalysisTypeError, setError] = useState(null);

    const getAnalysisType = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.GetAnalysisType)
            .then((returnData) => {
               
                if (returnData.neo_skeleton_analysis_type) {
                    setData(returnData.neo_skeleton_analysis_type)
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
                console.log("NEW MODEL", e, "Entity Setting - Analysis Type", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { AnalysisTypeLoading, AnalysisTypeData, AnalysisTypeError, getAnalysisType };
};

export default UseAnalysisType;