import { useState } from "react";
import configParam from "config";  
import gqlQueries from "components/layouts/Queries"

const useGetStarReport= () => {
    const [ StarReportLoading , setLoading] = useState(false);
    const [ StarReportData, setData] = useState(null);
    const [ StarReportError , setError] = useState(null);

    const getStarReport = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getStarReport,body) 
          .then((aggregate) => {
           console.log(aggregate,"aggregate",body)
            if ( aggregate !== undefined && aggregate.neo_skeleton_reports_star_fav) {
                setData(aggregate.neo_skeleton_reports_star_fav)
                setError(false)
                setLoading(false)
            } else{
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
    return {   StarReportLoading,  StarReportData , StarReportError,getStarReport };
};

export default  useGetStarReport;