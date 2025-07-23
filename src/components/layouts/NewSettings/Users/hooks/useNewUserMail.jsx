import { useState } from "react";
import configParam from "config";

const useNewUserMail = () => {
    const [mailTriggerLoading, setPaginationLoading] = useState(false);
    const [mailTriggerdata,setData ] = useState(null);
    const [mailTriggererror,setError ] = useState(null);
    
    const newUserMailTrigger = async(queryData) => {
       
        setPaginationLoading(true);
        // let controller = new AbortController();
        // let signal = controller.signal;
        
        // const url = configParam.API_URL + '/mail/sentwelcomemail'
        // var myHeaders = new Headers();
        // myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("x-access-token", localStorage.getItem("neoToken").replace(/['"]+/g, ""));
        // fetch(url, {
        //   method: 'POST',
        //   headers: myHeaders,
        //   signal: signal,
        //   body: JSON.stringify(queryData)
        // })
        //   .then(response => response.json())
        //   .then(result => {
        //     console.log('result');
        //   })

           await configParam.RUN_REST_API('/mail/sentwelcomemail', queryData, '', '', 'POST')
          .then((returnData) => {
              if(returnData !== undefined){
                  // setData(returnData.json());
                  // setError(false)
                  setPaginationLoading(false)
              }
              else{
                  // setData(null)
                  // setError(true)
                  setPaginationLoading(false)
                  }
              
          })
          .catch((err) => {
            console.log('error');
          })
    
    
      }
    return {mailTriggerLoading, mailTriggerdata, mailTriggererror, newUserMailTrigger };
}

export default useNewUserMail;
