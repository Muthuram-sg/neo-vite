import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useUpdateCalendarReport = () => {
    const [UpdateCalendarReportLoading, setLoading] = useState(false);
    const [UpdateCalendarReportData, setData] = useState(null);
    const [UpdateCalendarReportError, setError] = useState(null);

    const getUpdateCalendarReport = async (body) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.updateCalendarReport,body)
            .then((response) => {
                console.log(response)
                if (response !== undefined && response.update_neo_skeleton_calendar_report && response.update_neo_skeleton_calendar_report.affected_rows > 0) {
                    setData(response.update_neo_skeleton_calendar_report.affected_rows);
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

    return { UpdateCalendarReportLoading, UpdateCalendarReportData, UpdateCalendarReportError, getUpdateCalendarReport };
}


export default useUpdateCalendarReport;