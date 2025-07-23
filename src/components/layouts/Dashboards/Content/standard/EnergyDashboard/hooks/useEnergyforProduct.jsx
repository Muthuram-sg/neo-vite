import { useState } from "react";
import configParam from "config";

const useEnergyforProduct = () => {
    const [energyforProductLoading, setLoading] = useState(false);
    const [energyforProductData, setData] = useState(null);
    const [energyforProductError, setError] = useState(null);

    const getEnergyforProduct = async (durations) => {
        setLoading(true);
            configParam.RUN_REST_API('/dashboards/getproductenergy', { data: durations }, '', '', 'POST')
            .then((res) => {
                if (res && !res.errorTitle && res.data) {
                    setLoading(false)
                    setData(res.data)
                    setError(false)
                } else {
                    setLoading(false)
                    setData([])
                    setError(false)
                }
            })
            .catch((e) => {
                setLoading(false)
                setData(null)
                setError(e)
            })


    };
    return { energyforProductLoading, energyforProductData, energyforProductError, getEnergyforProduct };
};

export default useEnergyforProduct;