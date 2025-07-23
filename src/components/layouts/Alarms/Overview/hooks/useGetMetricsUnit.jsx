import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetMetricsUnit = () => {
    const [metricsunitLoading, setLoading] = useState(false);
    const [metricsunitData, setData] = useState(null);
    const [metricsunitError, setError] = useState(null);

    const getmetricsunit = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getmetricunit)
            .then(response => {
                if (response.neo_skeleton_metrics) {
                    setData(response.neo_skeleton_metrics)
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
    return { metricsunitLoading, metricsunitData, metricsunitError, getmetricsunit };
}

export default useGetMetricsUnit;