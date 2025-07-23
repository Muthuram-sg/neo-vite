import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useExecutionPartCount = () => {
    const [executionPartCountLoading, setLoading] = useState(false);
    const [executionPartCountData, setData] = useState(null);
    const [executionPartCountError, setError] = useState(null);

    const getExecutionPartCount = async (schema, data, dates, isRepeat, previousData) => {

        
        Promise.all(data.map(async (val) => {

            return Promise.all(dates.map(async (d) => {
                setLoading(true);
                const body = {
                    schema: schema,
                    instrument_id: val.part_signal_instrument,
                    metric_name: val.metric.name,
                    start_date: d.start_date,
                    end_date: d.end_date,
                    binary: val.is_part_count_binary,
                    downfall: val.is_part_count_downfall
                }
                var url = "/dashboards/actualPartSignal";
                var partsdata = await configParam.RUN_REST_API(url, body)
                    .then(async (response) => {

                        var parts = isRepeat ? [...previousData, ...response.data] : response.data;
                       
                        if (response && !response.errorTitle && parts.length > 0) {
                            let diff = [];
                            for (let i = 1; i < parts.length; i++) {
                                let actDiff = new Date(parts[i - 1].time) / 1000 - new Date(parts[i].time) / 1000
                                if (actDiff > 0) { diff.push(actDiff) }
                               
                            }
                            const param = {
                                entity_id: val.entity_id,
                                from: d.start_date,
                                to: d.end_date
                            };
                            await configParam.RUN_GQL_API(gqlQueries.getQualityReports, param)
                                .then((reasonsData) => {
                                    if (reasonsData && reasonsData.neo_skeleton_prod_quality_defects && reasonsData.neo_skeleton_prod_quality_defects.length > 0) {
                                        let defects = reasonsData.neo_skeleton_prod_quality_defects;
                                        defects.forEach(x => {
                                            const defected = parts.findIndex(y => new Date(y.time).toISOString() === new Date(x.marked_at).toISOString())
                                            if (defected >= 0) {
                                                parts[defected]['defect'] = true;
                                            }
                                        })
                                        parts.sort((a, b) => new Date(b.time) - new Date(a.time));
                                    } else {
                                        parts.sort((a, b) => new Date(b.time) - new Date(a.time));
                                    }
                                    if (reasonsData && reasonsData.neo_skeleton_prod_part_comments && reasonsData.neo_skeleton_prod_part_comments.length > 0) {
                                        let comments = reasonsData.neo_skeleton_prod_part_comments;
                                        comments.forEach(x => {
                                            const commented = parts.findIndex(y => new Date(y.time).toISOString() === new Date(x.part_completed_time).toISOString())
                                            if (commented >= 0) {
                                                var savedcomments = ""
                                                if (Object.keys(x.param_comments).length > 0) {
                                                    Object.entries(x.param_comments).forEach((entry) => savedcomments = savedcomments + entry.join(" : ") + "\n")

                                                }
                                                if (x.comments.replace(/\s/g, '').length > 0) savedcomments = savedcomments + "Generic : " + x.comments
                                                parts[commented]['comment'] = savedcomments
                                            }
                                        })
                                        parts.sort((a, b) => new Date(b.time) - new Date(a.time));
                                    } else {
                                        parts.sort((a, b) => new Date(b.time) - new Date(a.time));
                                    }

                                })

                           

                            return { data: parts, actCycleTime: mode(diff), cycleTime: mode(diff.slice(0, Math.min(20, diff.length))) }
                        } else {
                            return { data: parts }
                        }
                    })
                    .catch((e) => {
                        return e
                    });
                
                return { partsdata: partsdata,  start: d.start_date, end: d.end_date, entity_id: val.entity_id, execid: d.execid }
            }))
            
           
        }
        ))
            .then(data1 => {
             
                if (data1.length > 0) {
                    setData(data1);
                }
                setError(false)
            })
            .catch((e) => {
                setData(e);
                setError(true)
            })
            .finally(() => {
                setLoading(false)
            });
    };
    var mode = a => {
        a = a.slice().sort((x, y) => x - y);

        var bestStreak = 1;
        var bestElem = a[0];
        var currentStreak = 1;
        var currentElem = a[0];

        for (let i = 1; i < a.length; i++) {
            if (a[i - 1] !== a[i]) {
                if (currentStreak > bestStreak) {
                    bestStreak = currentStreak;
                    bestElem = currentElem;
                }

                currentStreak = 0;
                currentElem = a[i];
            }

            currentStreak++;
        }

        return currentStreak > bestStreak ? currentElem : bestElem;
    };
    return { executionPartCountLoading, executionPartCountData, executionPartCountError, getExecutionPartCount };
};



export default useExecutionPartCount;