import { useState } from "react";
import configParam from "config";

const useEnergyShift = () => {
    const [energyshiftLoading, setLoading] = useState(false);
    const [energyshiftData, setData] = useState(null);
    const [energyshiftError, setError] = useState(null);

    const getEnergyShift = async (viids, dates, previousdates) => {
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
    return { energyshiftLoading, energyshiftData, energyshiftError, getEnergyShift };
};

export default useEnergyShift;