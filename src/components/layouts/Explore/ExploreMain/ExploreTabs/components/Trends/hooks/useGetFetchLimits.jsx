/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";
import { useRecoilState } from 'recoil';
import { snackMessage , snackType , snackToggle, snackDesc } from "recoilStore/atoms";

const useGetFetchLimits = () => {
    const [fetchLimitsLoading, setLoading] = useState(false);
    const [fetchLimitsData, setData] = useState(null);
    const [fetchLimitsError, setError] = useState(null);

    const [, setSnackDesc] = useRecoilState(snackDesc);
            const [, setSnackMessage] = useRecoilState(snackMessage);
            const [, setType] = useRecoilState(snackType);
            const [, setOpenSnack] = useRecoilState(snackToggle);

    const getFetchLimits = async (chipLocal,value) => {
        console.clear()
        console.log(chipLocal, value)
        setLoading(true);
        Promise.all(
            chipLocal.map((val, ind) => {
               
                    return (configParam
                        .RUN_GQL_API(gqlQueries.getLimits, { metric_name: val.metric_val, iid: val.id })
                        .then((result) => {
                            console.log("RES _ ", result, val)
                            let temp,temp1;
                            if (result.neo_skeleton_alerts_v2.length > 0) {

                                temp = {
                                    id: val.metric_title.replace(/[ ()\/]/g, '-')+ '-' + val.id + '-',
                                    iid: val.metric_title + ' (' + val.id + ')',
                                    y: result.neo_skeleton_alerts_v2[0].critical_value,
                                    check_type: result.neo_skeleton_alerts_v2[0].critical_type,
                                    critical_min_value: result.neo_skeleton_alerts_v2[0].critical_min_value,
                                    critical_max_value: result.neo_skeleton_alerts_v2[0].critical_max_value,
                                    borderColor: '#FF0D00',
                                    seriesIndex: 0,
                                    label: {
                                        borderColor: '#FF0D00',
                                        style: {
                                            color: '#fff',
                                            background: '#FF0D00',
                                        },
                                        text : val.limits 
                                        ? `Critical Value (${val.hierarchy.split('_').slice(2).join('_')} - ${val.metric_title})`
                                        : `Critical Value (${val.instrument_name} - ${val.metric_title})`
                                    },

                                }
                                temp1 = {
                                    id: val.metric_title.replace(/[ ()\/]/g, '-')+ '-' + val.id + '-',
                                    iid: val.metric_title + ' (' + val.id + ')',
                                    y: result.neo_skeleton_alerts_v2[0].warn_value,
                                    check_type: result.neo_skeleton_alerts_v2[0].warn_type,
                                    warn_min_value: result.neo_skeleton_alerts_v2[0].warn_min_value,
                                    warn_max_value: result.neo_skeleton_alerts_v2[0].warn_max_value,
                                    borderColor: '#FF9500',
                                    seriesIndex: 0,
                                    label: {
                                        borderColor: '#FF9500',
                                        style: {
                                            color: '#fff',
                                            background: '#FF9500',
                                        },
                                        text : val.limits 
                                        ? `Warning Value (${val.hierarchy.split('_').slice(2).join('_')} - ${val.metric_title})`
                                        : `Warning Value (${val.instrument_name} - ${val.metric_title})`
                                    },

                                }
                            }
                            else if(`${val.metric_title} (${val.id})` === value) {
                                setOpenSnack(true)
                                setSnackMessage("No Alarm Limits found")
                                setSnackDesc('Please set appropriate alarm to view it.')
                                setType("warning")
                            }
                            return { "critical": temp, "warning": temp1 }
                        }))
                


            }))
            .then((data) => {
                console.log(data)
                let A = []
                if (data.length > 0) {
                    data.forEach((a) => {
                        if (a && (a.critical !== undefined) && (a.warning!== undefined)) {
                            A.push(a.critical, a.warning)
                        }
                        
                    })
                }
                console.log(A) 
                setData(A)
                setError(false)
                setLoading(false)
            })
            .catch((e)=>{
                console.log("NEW MODEL", e, "Trends-Limits", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })

    };
    return { fetchLimitsLoading, fetchLimitsData, fetchLimitsError, getFetchLimits };
};

export default useGetFetchLimits;
