import { useState } from "react";
import configParam from "config";
import moment from "moment";

const useGetEnergybysplitday = () => {
    const [energybysplitdayLoading, setLoading] = useState(false);
    const [energybysplitdayData, setData] = useState(null);
    const [energybysplitdayError, setError] = useState(null);

    const getenergybysplitday = async (viids, dates, previousdates,specificenergy,isProdSQMT,formula) => {
        setLoading(true);

        Promise.all(
            viids.map(async (x) => {
                let Dates = dates.filter(f=> (moment(f.start).isBetween(moment(x.start), moment(x.end)) ||  moment(f.start).isSame(x.start)) )
                let body = {
                    start: x.start,
                    end: x.end,
                    metrictype: x.type,
                    instruments: x.instruments,
                    metrics: x.metrics,
                    viid: x.viid ? x.viid.id : "",
                    dates: Dates,
                    previousdates: previousdates,
                    groupby:x.groupby,
                    specificenergy:specificenergy?specificenergy:false,
                    isProdSQMT : isProdSQMT ? isProdSQMT : false
                }
              return await configParam.RUN_REST_API('/dashboards/energydashday', { data: body }, '', '', 'POST')
                    .then(res => {
                        if (res && !res.errorTitle && res.data) {
                            return res.data
                        } else {
                            return []
                        }
                    })
            }))
            .then((result) => {
                let FinalData = []
                formula.forEach(re => {
                        let dayData = []
                        let previousdayData = []
                        let vi
                        result.forEach(d1 => {
                            if(d1.vi.id === re.id){
                                dayData = [...dayData,...d1.dayData]
                                previousdayData = [...previousdayData,...d1.previousdayData]
                                vi = d1.vi
                            }
                        })
                        FinalData.push({vi: vi, dayData: dayData,previousdayData:previousdayData })
                });
                    setData(FinalData); 
                // console.log(result,"energybysplitdayData",formula,FinalData)
                setLoading(false);
                setError(false);
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return { energybysplitdayLoading, energybysplitdayData, energybysplitdayError, getenergybysplitday };
};

export default useGetEnergybysplitday;