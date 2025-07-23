import { useState } from "react";
import configParam from "config";

const useEnergyAssetshiftwise = () => {
    const [EnergyAssetshiftwiseLoading, setLoading] = useState(false);
    const [EnergyAssetshiftwiseData, setData] = useState(null);
    const [EnergyAssetshiftwiseError, setError] = useState(null);

    const getEnergyAssetshiftwise = async (viids, dates, previousdates) => {
        setLoading(true);
       
        Promise.all(
            viids.map(async (a) => {
                return Promise.all(
                    a.responce.map(async (x) => {
                        let body = {
                            start: x.start,
                            end: x.end,
                            metrictype: x.type,
                            instruments: x.instruments,
                            metrics: x.metrics,
                            viid: x.viid ? x.viid.id : "",
                            dates: dates,
                            previousdates: previousdates
        
                        }
                        return configParam.RUN_REST_API('/dashboards/energydashshift', { data: body }, '', '', 'POST')
                                .then((res) => {
                                    if (res && !res.errorTitle && res.data) {
                                        return res.data
                                    } else {
                                        return []
                                    }
                                })
                    }))
                    .then((data) => { 
                        return {name: a.name, data:data,id: a.id}
                    })
            })
        )
            
            .then((result) => {
                setLoading(false);
                setError(false);
                setData(result);
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return { EnergyAssetshiftwiseLoading, EnergyAssetshiftwiseData, EnergyAssetshiftwiseError, getEnergyAssetshiftwise };
};

export default useEnergyAssetshiftwise;