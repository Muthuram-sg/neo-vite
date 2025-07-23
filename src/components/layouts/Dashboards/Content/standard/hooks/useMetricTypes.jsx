import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useMetricTypes = () => {
    const [metrictypelistLoading, setLoading] = useState(false);
    const [metrictypelistdata, setData] = useState(null);
    const [metrictypelisterror, setError] = useState(null);

    const getMetricTypelist = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getMetricType, {})
            .then(metrictypelist => {
                if (metrictypelist !== undefined && metrictypelist.neo_skeleton_metrics && metrictypelist.neo_skeleton_metrics.length > 0) {
                    setData(metrictypelist.neo_skeleton_metrics)
                    setError(false)
                    setLoading(false)
                } else {
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



    }
    return { metrictypelistLoading, metrictypelistdata, metrictypelisterror, getMetricTypelist };
}

export default useMetricTypes;
