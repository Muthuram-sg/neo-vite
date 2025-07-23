import { useState } from "react";
import configParam from "config";
const useAlarmHistoryIns = () => {
  const [AlarmHistoryLoading, setLoading] = useState(false);
  const [AlarmHistoryData, setData] = useState(null);
  const [AlarmHistoryError, setError] = useState(null);

  function valuesStringToJson(valuesStr) {
    const pairs = valuesStr.replace(/"/g, '').split(', ');

    const valuesObj = {};

    pairs.forEach(pair => {
        const [key, value] = pair.split('=>');

        const trimmedKey = key ? key.trim() : '';
        const trimmedValue = value ?  value.trim() : '';

        valuesObj[trimmedKey] = trimmedValue === 'NULL' ? null : trimmedValue;
    });
    return valuesObj;
  }

  const getAlarmHistory = async (id) => {
    setLoading(true); 
    const url = '/alerts/getAlarmHistory';
    await configParam.RUN_REST_API(url, { taskid: id})
      .then((response) => {    
        if (response && !response.errorTitle) {
            // eslint-disable-next-line array-callback-return
            const modifiedData = response.data.map((val) => {
                const newValuesJson = val.new_values ? valuesStringToJson(val.new_values) : {};
                const oldValuesJson = val.old_values ? valuesStringToJson(val.old_values) : {};
        
                return {
                    ...val,
                    new_values: newValuesJson,
                    old_values: oldValuesJson
                };
            });
            setData(modifiedData);
            setError(false);
            setLoading(false);
        } else {
          setData(response);
          setError(true);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log("e",e)
        setLoading(false);
        setError(e);
        setData(null);
      });
  };
  return { AlarmHistoryLoading, AlarmHistoryData, AlarmHistoryError, getAlarmHistory };
};

export default useAlarmHistoryIns;