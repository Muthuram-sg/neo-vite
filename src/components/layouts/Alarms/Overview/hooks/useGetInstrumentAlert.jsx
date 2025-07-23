import { useState } from "react";
import configParam from "config";

const useGetInstrumentAlertData = () => {
    const [InstrumentAlertLoading, setLoading] = useState(false);
    const [InstrumentAlertData, setData] = useState(null);
    const [InstrumentAlertError, setError] = useState(null);

    const getInstrumentAlertData = async (body) => {
        setLoading(true); 
        try {
            const returnData = await configParam.RUN_REST_API('/alerts/getDrilldownAlertsByType', body, '', '', 'POST');
            if (returnData !== undefined) {

                if (returnData.type === 'Instrument') {
                    const updatedData = returnData.data.map(alert => {
                        const matchingAlert = returnData.dataAlerts.find(finalAlert => finalAlert.alert_id === alert.alert_id);
                        if (matchingAlert) {
                            alert.alarmTriggeredTime = matchingAlert.value_time;
                            alert.LastActiveAt = matchingAlert.value_time;
                        }
                        return alert;
                    });
                    returnData.data = updatedData;
                }

                setData(returnData);
                setError(false);
            } else {
                setData(null);
                setError(true);
            }
        } catch (e) {
            console.log("NEW MODEL", "ERR", e, "getInstrumentAlertData - alerts", new Date());
            setLoading(false);
            setError(e);
            setData(null);
        } finally {
            setLoading(false);
        }
    }

    return { InstrumentAlertLoading, InstrumentAlertData, InstrumentAlertError, getInstrumentAlertData };
}

export default useGetInstrumentAlertData;
