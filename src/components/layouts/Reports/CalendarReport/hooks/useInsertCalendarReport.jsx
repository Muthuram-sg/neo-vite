import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useInsertCalendarReport = () => {
    const [InsertCalendarReportLoading, setLoading] = useState(false);
    const [InsertCalendarReportData, setData] = useState(null);
    const [InsertCalendarReportError, setError] = useState(null);

    const getInsertCalendarReport = async (body) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.addCalendarReport,body)
            .then((response) => {
                console.log(response)
                if (response !== undefined && response.insert_neo_skeleton_calendar_report && response.insert_neo_skeleton_calendar_report.returning.length > 0) {
                    setData(response.insert_neo_skeleton_calendar_report.returning);
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

    return { InsertCalendarReportLoading, InsertCalendarReportData, InsertCalendarReportError, getInsertCalendarReport };
}


export default useInsertCalendarReport;