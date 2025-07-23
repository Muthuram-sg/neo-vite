import { useState } from "react";
import configParam from "config";

const useGetRouteCardDetails = () => {
    const [routeCardLoading, setLoading] = useState(false);
    const [routeCardData, setData] = useState(null);
    const [routeCardError, setError] = useState(null);

    const getRouteCardDetails = async (body) => {
        setLoading(true);
        const url = "/iiot/generateProdReportRouteCard";
       
        await configParam.RUN_REST_API(url, body,"","","POST")
            .then((response) => {
                const shiftwise_result = response.data.shiftwise_result;
                if (response && response.data && shiftwise_result.length > 0) {
                console.log(shiftwise_result,"shiftwise_result");
                    setLoading(false);
                    setError(false);
                    setData(shiftwise_result);
                } else {
                    setLoading(false);
                    setError(false);
                    setData([]);
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });
    };

    return { routeCardLoading, routeCardData, routeCardError, getRouteCardDetails };
};

export default useGetRouteCardDetails;
