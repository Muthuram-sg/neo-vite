import { useState } from "react";
import configParam from "config";

const useFetchTimeslotData = () => {
    const [TimeslotLoading, setLoading] = useState(false);
    const [TimeslotData, setData] = useState(null);
    const [TimeslotError, setError] = useState(null);

    const getTimeslot = async (from, to, nodes ) => {
        setLoading(true);
        Promise.all(nodes.map(async (val) => {
            return  configParam.RUN_REST_API("/iiot/getTimeslotReport", { from: from, to: to , viid : val })
                .then((resultData) => {
                    if (resultData && resultData.data) {
                        return {viid : val , data :resultData.data }
                    } else {
                        return {viid : val , data : []}
                    }
                })
                .catch((e) => {
                    return e 
                });
        }))
            .then(data => {
                setData(data);
                setLoading(false);
                setError(false)
            })
            .catch((e) => {
                setData(e);
                setLoading(false);
                setError(true)
            })


    };
    return { TimeslotLoading, TimeslotData, TimeslotError, getTimeslot };
};

export default useFetchTimeslotData;