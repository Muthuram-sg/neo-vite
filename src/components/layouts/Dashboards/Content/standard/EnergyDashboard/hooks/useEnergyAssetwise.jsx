import { useState } from "react";
import configParam from "config";

const useEnergyAssetwise = () => {
    const [EnergyAssetwiseLoading, setLoading] = useState(false);
    const [EnergyAssetwiseData, setData] = useState(null);
    const [EnergyAssetwiseError, setError] = useState(null);

    const getEnergyAssetwise = async (viids, dates, previousdates) => {
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
                            previousdates: previousdates,
                            groupby:x.groupby
                        }
                      return configParam.RUN_REST_API('/dashboards/energydashday', { data: body }, '', '', 'POST')
                            .then(res => {
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
                // console.log(result,"resultresult2")
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
    return { EnergyAssetwiseLoading, EnergyAssetwiseData, EnergyAssetwiseError, getEnergyAssetwise };
};

export default useEnergyAssetwise;