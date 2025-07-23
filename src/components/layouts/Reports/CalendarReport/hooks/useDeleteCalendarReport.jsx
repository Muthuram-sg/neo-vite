import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useDeleteCalendarReport = () => {
    const [DeleteCalendarReportLoading, setLoading] = useState(false);
    const [DeleteCalendarReportData, setData] = useState(null);
    const [DeleteCalendarReportError, setError] = useState(null);

    const getDeleteCalendarReport = async (id) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.DeleteCalendarReport,{id:id})
            .then((response) => {
                console.log(response)
                if (response !== undefined && response.delete_neo_skeleton_calendar_report && response.delete_neo_skeleton_calendar_report.affected_rows > 0) {
                    setData(response.delete_neo_skeleton_calendar_report.affected_rows);
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }

            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { DeleteCalendarReportLoading, DeleteCalendarReportData, DeleteCalendarReportError, getDeleteCalendarReport };
}


export default useDeleteCalendarReport;