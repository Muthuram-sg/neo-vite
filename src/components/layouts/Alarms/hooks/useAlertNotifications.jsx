import { useState } from "react";
import configParam from "config";

const useAlertNotifications = () => {
    const [alertNotificationLoading, setPaginationLoading] = useState(false);
    const [alertNotificationdata, ] = useState(null);
    const [alertNotificationerror, ] = useState(null);
    
    const getfetchAlertNotifications = (queryData) => {
       
        setPaginationLoading(true);
        
          configParam.RUN_REST_API('/alerts/getPaginationAlerts', queryData, '', '', 'POST')
          .then(result => {
            console.log('result');
          })
          .catch((err) => {
            console.log('error');
          })
    
    
      }
    return {alertNotificationLoading, alertNotificationdata, alertNotificationerror, getfetchAlertNotifications };
}

export default useAlertNotifications;
