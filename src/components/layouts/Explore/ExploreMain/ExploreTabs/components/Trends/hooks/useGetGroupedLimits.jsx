/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetFetchGroupLimits = () => {
    const [fetchGroupLimitsLoading, setLoading] = useState(false);
    const [fetchGroupLimitsData, setData] = useState(null);
    const [fetchGroupLimitsError, setError] = useState(null);

    const getFetchGroupLimits = async (chipLocal) => {
        setLoading(true);
        let units = chipLocal?.[0].metric_val.split(',')
        Promise.all(
            units.map((val, index) => {
                    let stripped_val = val.split('(')?.[1]?.replace(')', '')
                    return (configParam
                        .RUN_GQL_API(gqlQueries.getLimits, { metric_name: stripped_val ? stripped_val : val, iid: chipLocal?.[0].id })
                        .then((result) => {
                            // console.log("result", result)
                            if (result.neo_skeleton_alerts_v2.length > 0) {
                                var temp = {
                                    key: val,
                                    id: chipLocal?.[0].metric_title?.[index].replace(/[ ()\/]/g, '-')+ '-' + chipLocal?.[0].id + '-' + index,
                                    y: Number(result.neo_skeleton_alerts_v2[0].critical_value),
                                    borderColor: '#FF0D00',
                                    seriesIndex: 0,
                                    label: {
                                        borderColor: '#FF0D00',
                                        style: {
                                            color: '#fff',
                                            background: '#FF0D00',
                                        },
                                        text : chipLocal?.[0].limits 
                                        ? `Critical Value (${chipLocal?.[0].hierarchy.split('_').slice(2).join('_')} - ${chipLocal?.[0].metric_title?.[index]})`
                                        : `Critical Value (${chipLocal?.[0].instrument_name} - ${chipLocal?.[0].metric_title?.[index]})`
                                    },

                                }
                                var temp1 = {
                                    key: val,
                                    id: chipLocal?.[0].metric_title[index].replace(/[ ()\/]/g, '-')+ '-' + chipLocal?.[0].id + '-',
                                    y: Number(result.neo_skeleton_alerts_v2[0].warn_value),
                                    borderColor: '#FF9500',
                                    seriesIndex: 0,
                                    label: {
                                        borderColor: '#FF9500',
                                        style: {
                                            color: '#fff',
                                            background: '#FF9500',
                                        },
                                        text : chipLocal?.[0].limits 
                                        ? `Warning Value (${chipLocal?.[0].hierarchy.split('_').slice(2).join('_')} - ${chipLocal?.[0].metric_title?.[index]})`
                                        : `Warning Value (${chipLocal?.[0].instrument_name} - ${chipLocal?.[0].metric_title?.[index]})`
                                    },

                                }
                            }
                            return { "critical": temp, "warning": temp1 }
                        }))
            }))
            .then((data) => {
                let A = []
                if (data.length > 0) {
                    data.forEach((a) => {
                        if (a && ((a.critical !== undefined) && (a.warning!== undefined)) && ((a.critical !== '') && (a.warning !== ''))) {
                            A.push(a.critical, a.warning)
                        }
                        
                    })
                   
                } 
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
    return { fetchGroupLimitsLoading, fetchGroupLimitsData, fetchGroupLimitsError, getFetchGroupLimits };
};

export default useGetFetchGroupLimits;
