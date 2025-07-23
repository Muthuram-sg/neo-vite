import { useState } from "react";
import configParam from "config"; 
import moment from 'moment';

const useGetConnectivityTimelineData = () => {
    const [ConnectivityTimelineLoading, setLoading] = useState(false);
    const [ConnectivityTimelineData, setData] = useState(null);
    const [ConnectivityTimelineError, setError] = useState(null);

    const getConnectivityTimelineData  = async (body) => {
        setLoading(true);
        
            configParam.RUN_REST_API('/alerts/getConnectivityTimelineData', body, '', '', 'POST')
            .then((returnData) => {
                if(returnData !== undefined){
                    let temp = [
                        {
                          name: 'Active',
                          data: []
                        },
                        {
                          name: 'Inactive',
                          data: []
                        }
                      ]

                      if(returnData.data.length > 0){

                        // eslint-disable-next-line array-callback-return
                        returnData.data.map((x) => {

                            let Next = moment(x.next).valueOf() //Daylight Checking
                            let Time = moment(x.time).valueOf()

                            if (x.status === 'active') {
                                temp[0].data.push({
                                  x: 'Range',
                                  y: [Time, Next]
                                })
                              }
                              else {
                                temp[1].data.push({
                                  x: 'Range',
                                  y: [Time, Next]
                                })
                              }
                        })

                      }
                      

                    setData(temp);
                    setError(false)
                    setLoading(false)
                }
                else{
                    setData(null)
                    setError(true)
                    setLoading(false)
                    }
                
            })
            .catch((e) => {
                console.log("NEW MODEL", "ERR", e, "getConnectivityTimelineData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { ConnectivityTimelineLoading, ConnectivityTimelineData, ConnectivityTimelineError, getConnectivityTimelineData };
}


export default useGetConnectivityTimelineData;