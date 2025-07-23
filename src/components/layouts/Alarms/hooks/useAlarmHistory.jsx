import { useState } from "react";
import configParam from "config";
import moment from 'moment';
import { useAuth } from "components/Context";

const useTaskHistory = () => {
    const { HF } = useAuth();
  const [AlarmHistoryLoading, setLoading] = useState(false);
  const [AlarmHistoryData, setData] = useState(null);
  const [AlarmHistoryError, setError] = useState(null);

  function valuesStringToJson(valuesStr) {
    const pairs = valuesStr.replace(/"/g, '').split(', ');

    const valuesObj = {};

    pairs.forEach(pair => {
        const [key, value] = pair.split('=>');

        const trimmedKey = key && key.trim();
        const trimmedValue = value && value.trim();

        valuesObj[trimmedKey] = trimmedValue === 'NULL' ? null : trimmedValue;
    });
    return valuesObj;
  }

  function findChangedKeys(newValues, oldValues) {
    const changedKeys = [];

    for (const key in newValues) {
        if (oldValues.hasOwnProperty(key) && newValues[key] !== oldValues[key]) {
            changedKeys.push(key);
        }
    }
    const keysToCheck = ['check_aggregate_window_function', 'name', 'insrument_metrics_id', 'check_type', 'check_last_n', 'alert_channels','warn_value','critical_value'];

    const matchingKeys = changedKeys.filter(key => keysToCheck.includes(key));
  
    return matchingKeys;
  }

  const getAlarmHistory = async (id) => {
    setLoading(true); 
    const url = '/alerts/getAlarmHistory';
    await configParam.RUN_REST_API(url, { taskid: id})
      .then((response) => {    
        if (response && !response.errorTitle) {
          let history = [];
            // eslint-disable-next-line array-callback-return
            response.data.map((val) => {
            const newValuesJson = val.new_values ? valuesStringToJson(val.new_values ) : {}
            const oldValuesJson = val.old_values ? valuesStringToJson(val.old_values  ): {}
            const matchingKeys = findChangedKeys(newValuesJson ? newValuesJson : {} , oldValuesJson ? oldValuesJson: {});
            
            if (matchingKeys.length > 0) {
            matchingKeys.forEach(key => {
                history.push({
                    "action_time": moment(val.action_timestamp).format(HF.HM) + " - " + moment(val.action_timestamp).format("DD/MM/YYYY"),
                    "user": val.username,
                    "time": val.action_timestamp,
                    "value": key,
                    "action": val.action
                });
            });
          } else if(val.action === "i") {
            history.push({
                "action_time": moment(val.action_timestamp).format(HF.HM) + " - " + moment(val.action_timestamp).format("DD/MM/YYYY"),
                "user": val.username,
                "time": val.action_timestamp,
                "action": val.action
            });
          } else if (Array.isArray(val.updated_cols) && val.updated_cols.length === 0) {
            history.push({
                "action_time": moment(val.action_timestamp).format(HF.HM) + " - " + moment(val.action_timestamp).format("DD/MM/YYYY"),
                "user": val.username,
                "time": val.action_timestamp,
                "action": 'i'
            });
        }
            })
          setData(history);
          setError(false);
           
        } else {
          setData(response);
          setError(true);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(e);
        setData(null);
      });
  };
  return { AlarmHistoryLoading, AlarmHistoryData, AlarmHistoryError, getAlarmHistory };
};

export default useTaskHistory;