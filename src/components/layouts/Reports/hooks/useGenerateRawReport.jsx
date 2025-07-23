import { useState } from "react";
import configParam from "config"; 
import moment from 'moment';

const useGenerateRawReport = () => {
    const [GenerateRawReportLoading , setLoading] = useState(false);
    const [GenerateRawReportData, setData] = useState(null);
    const [GenerateRawReportError , setError] = useState(null);

    const getGenerateRawReport = async (timezone,report_id,requested_by,from,to,line_id,reportObj,isStandard,oeeAsert) => {
        setLoading(true);
        
        let ObjData
        if(isStandard){
          ObjData = {
            report_id: report_id,
            requested_by: requested_by,
            start_dt: moment(from).format('YYYY-MM-DDTHH:mm:ssZ'),
            end_dt: moment(to).format('YYYY-MM-DDTHH:mm:ssZ'),
            line_id: line_id,
            json_query:reportObj ? reportObj : null,
            standard:isStandard ? isStandard : false,
            miscdata:oeeAsert ? oeeAsert : [],
            timezone: timezone
          }
        }else{
          ObjData = {
            report_id: report_id,
            requested_by: requested_by,
            start_dt: moment(from).format('YYYY-MM-DDTHH:mm:ssZ'),
            end_dt: moment(to).format('YYYY-MM-DDTHH:mm:ssZ'),
            line_id: line_id,
            timezone: timezone
          }
        } 
        await configParam.RUN_REST_API('/iiot/generateRawReport', {data:ObjData}, '', '', 'POST')  
          .then((resultData) => {
            if (resultData) {
                setData(resultData)
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
    return {  GenerateRawReportLoading, GenerateRawReportData ,GenerateRawReportError, getGenerateRawReport };
};

export default useGenerateRawReport;