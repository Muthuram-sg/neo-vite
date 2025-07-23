import { useState } from "react";
import configParam from "config";


const useGetContractDetail = () => {
    const [useGetContractDetailLoading, setLoading] = useState(false);
    const [useGetContractDetailData, setData] = useState(null);
    const [useGetContractDetailError, setError] = useState(null);

    const getuseGetContractDetail = async (body) => {
        setLoading(true);
        const url = '/dashboards/getenergycontract'
        await configParam.RUN_REST_API(url,{data:body}, '', '', 'POST')
        .then((result) => {
          if (result &&  result.data) {
            setLoading(false)
            setData(result.data)
            setError(false)
        } else {
            setLoading(false)
            setData([])
            setError(false)
        }
      
            
        })
        .catch((e) => {
            console.log("NEW MODEL", "ERR", e, "getAlertsOverviewData - alerts", new Date())
            setLoading(false);
            setError(e);
            setData(null);
        })
}

      
        
    return { useGetContractDetailLoading, useGetContractDetailData, useGetContractDetailError, getuseGetContractDetail };
};

export default useGetContractDetail;