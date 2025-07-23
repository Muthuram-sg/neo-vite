import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useInsertReport = () => {
    const [InsertReportLoading, setLoading] = useState(false); 
    const [InsertReportError, setError] = useState(null); 
    const [InsertReportData, setData] = useState(null); 

    const getInsertReport = async (datas, alert_channels, alert_users,instrumentConfig,instrument_type,isGroup,layout) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.insertReports,{name: datas.name,description: datas.description,custome_reports: datas.custome_reports,hierarchy_id: datas.hierarchy_id,metric_ids: datas.metric_ids,instument_ids: datas.instument_ids,entity_ids: datas.entity_ids,startsat: datas.startsat,aggreation: datas.aggreation,group_by: datas.group_by,created_by: datas.created_by,line_id: datas.line_id, public_access: datas.public_access, send_mail: datas.send_mail,user_access_list:datas.user_access_list,alert_channels: alert_channels, alert_users: alert_users,config: instrumentConfig,instrument_list_from: instrument_type,group_aggregation: isGroup,table_layout: layout})
        
            .then((returnData) => {
              
                if (returnData !== undefined) {
                    setData(returnData)
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
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "Reports", new Date())
            });

    };
    return {  InsertReportLoading, InsertReportData, InsertReportError, getInsertReport };
};

export default useInsertReport;