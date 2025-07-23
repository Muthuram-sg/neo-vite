import { useState } from "react";
import configParam from "config";  
import gqlQueries from "components/layouts/Queries"

const useGetAlertComparisonList= () => {
    const [ AlertComparisonListLoading , setLoading] = useState(false);
    const [ AlertComparisonListData, setData] = useState(null);
    const [ AlertComparisonListError , setError] = useState(null);

    const getAlertComparisonList = async (line_id) => {
        setLoading(true);
        
        await configParam.RUN_GQL_API(gqlQueries.alertComparisonList, {line_id :line_id}) 
          .then((response) => { 
            if(response){
                  setData(response)
                  setError(false)
                  setLoading(false)

            }else{
                        setData(null)
                        setError(false)
                        setLoading(false)
                    }

          })
          .catch((e) => {
            setLoading(false);
            setError(e);
            setData(null);
            console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
        });
        
    };
    return { AlertComparisonListLoading,  AlertComparisonListData , AlertComparisonListError,getAlertComparisonList };
};

export default  useGetAlertComparisonList;