import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetCalendarData = () => {
    const [GetCalendarDataLoading, setLoading] = useState(false);
    const [GetCalendarDatadata, setData] = useState(null);
    const [GetCalendarDataerror, setError] = useState(null);

    const getGetCalendarData = async (lineid,startDate,endDate) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getCalenderDataSelectedTimeRange,{line_id:lineid,start:startDate,end:endDate})
            .then(assetlist => {
                if (assetlist.neo_skeleton_calendar_report) {
                    setData(assetlist.neo_skeleton_calendar_report)
                    setError(false)
                    setLoading(false)
                } else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }


            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });



    }
    return { GetCalendarDataLoading, GetCalendarDatadata, GetCalendarDataerror, getGetCalendarData };
}

export default useGetCalendarData;
