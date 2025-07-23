import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useInstrumentWiseAlert = () => {
    const [insAlarmLoading, setLoading] = useState(false);
    const [insAlarmData, setData] = useState(null);
    const [insAlarmError, setError] = useState(null);

    const InstrumentWiseAlert = async (insrument_metrics_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.InstrumentWiseAlert, { insrument_metrics_id: insrument_metrics_id })
        .then(async (instrument_alarm) => {
                const data = instrument_alarm.neo_skeleton_alerts_v2
                if (data ) {
                    setData(data) 
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData(null)
                    setError(false)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Trends", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return { insAlarmLoading, insAlarmData, insAlarmError, InstrumentWiseAlert };
};

export default useInstrumentWiseAlert;