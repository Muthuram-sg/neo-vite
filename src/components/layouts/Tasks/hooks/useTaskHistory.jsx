import { useState } from "react";
import configParam from "config";
import moment from 'moment';
import { useAuth } from "components/Context";

const useTaskHistory = () => {
    const { HF } = useAuth();
  const [TaskHistoryLoading, setLoading] = useState(false);
  const [TaskHistoryData, setData] = useState(null);
  const [TaskHistoryError, setError] = useState(null);

  const getTaskHistory = async (id) => {
    setLoading(true); 
    const url = '/tasks/taskHistory';
    await configParam.RUN_REST_API(url, { taskid: id})
      .then((response) => {        
        if (response && !response.errorTitle) {
            let history = [];
            // eslint-disable-next-line array-callback-return
            response.data.map((val) => {
                if (val.updated_cols) {
                    // eslint-disable-next-line array-callback-return
                    val.updated_cols.map((item) => {
                        if (item !== "updated_ts") {

                            history.push({
                                "action_time": moment(val.action_timestamp).format(HF.HM) + " - " + moment(val.action_timestamp).format("DD/MM/YYYY"), "action": item !== 'updated_by' ? 'updated '+item.replace("_", " ") : 'updated ', "value": val[item]
                                , "user": val.username, "time": val.action_timestamp
                            })
                        }
                    })
                }
                else {
                    history.push({
                        "action_time": moment(val.action_timestamp).format(HF.HM) + " - " + moment(val.action_timestamp).format("DD/MM/YYYY"), "action": "task created", "value": "Task Created"
                        , "user": val.username, "time": val.action_timestamp
                    })
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
 
  return { TaskHistoryLoading, TaskHistoryData, TaskHistoryError, getTaskHistory };
};

export default useTaskHistory;