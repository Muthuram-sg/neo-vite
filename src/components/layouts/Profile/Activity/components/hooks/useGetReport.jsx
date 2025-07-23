import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetReport = () => {
    const [ReportLoading, setLoading] = useState(false);
    const [ReportData, setData] = useState(null);
    const [ReportError, setError] = useState(null);

    const getReport = async (curUserData,headPlant,start,end) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getReportNotificationDatewise, { requested_by: curUserData.id, line_id: headPlant.id,from:start,to:end })
        .then((returnData) => {
                if (returnData !== undefined && returnData.neo_skeleton_report_generation && returnData.neo_skeleton_report_generation.length > 0) {
                    setData(returnData.neo_skeleton_report_generation)
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData([])
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Getting Activity Screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { ReportLoading, ReportData, ReportError, getReport };
};

export default useGetReport;