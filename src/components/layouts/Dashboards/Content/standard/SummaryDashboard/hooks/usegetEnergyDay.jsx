import { useState } from "react";
import configParam from "config";

const useGetEnergyDay = () => {
    const [energydayLoading, setLoading] = useState(false);
    const [energydayData, setData] = useState(null);
    const [energydayError, setError] = useState(null);

    const getEnergyDay = async (viids, dates, previousdates,childPlant,type) => {
        setLoading(true);
        Promise.all(
            viids.map(async (x) => {
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
            .then((result) => {
                setLoading(false);
                setError(false);
                setData({Data:result,childPlant:childPlant,type:type});
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return { energydayLoading, energydayData, energydayError, getEnergyDay };
};

export default useGetEnergyDay;