import { useState } from "react";
import configParam from "config";

const useNewUserMail = () => {
    const [mailTriggerLoading, setPaginationLoading] = useState(false);
    const [mailTriggerdata, ] = useState(null);
    const [mailTriggererror, ] = useState(null);
    
    const newUserMailTrigger = (queryData) => {
       
        setPaginationLoading(true);
        const url = '/mail/sentwelcomemail'
          configParam.RUN_REST_API(url, queryData,'','',"POST")
          .then(result => {
            console.log('result');
          })
          .catch((err) => {
            console.log('error');
          })
    
    
      }
    return {mailTriggerLoading, mailTriggerdata, mailTriggererror, newUserMailTrigger };
}

export default useNewUserMail;
