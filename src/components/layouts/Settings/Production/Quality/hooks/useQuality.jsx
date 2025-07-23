import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const UseQuality = () => {
    const [outQTLoading, setLoading] = useState(false);
    const [outQTData, setData] = useState(null);
    const [outQTError, setError] = useState(null);

    const getQuality = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getSavedQualityMetrics, { line_id: line_id })
            .then((Qualitydata) => {
                if (Qualitydata.neo_skeleton_quality_metrics) {
                    setData(Qualitydata.neo_skeleton_quality_metrics)
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
                console.log("NEW MODEL", e, "Getting Quality Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { outQTLoading, outQTData, outQTError, getQuality };
};

export default UseQuality;