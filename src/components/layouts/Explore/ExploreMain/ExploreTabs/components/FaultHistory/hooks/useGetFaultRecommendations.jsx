import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries"; 

const useGetFaultRecommendations = () => {
    const [faultrecommendationsLoading, setLoading] = useState(false);
    const [faultrecommendationsdata, setData] = useState(null);
    const [faultrecommendationserror, setError] = useState(null);

    const getFaultRecommendations = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getFaultRecommendations)
            .then(faulterecommendations => {
                if (faulterecommendations && faulterecommendations.neo_skeleton_fault_action_recommended) {
                    setData( faulterecommendations.neo_skeleton_fault_action_recommended)
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
    return { faultrecommendationsLoading, faultrecommendationsdata, faultrecommendationserror, getFaultRecommendations };
}

export default useGetFaultRecommendations;
