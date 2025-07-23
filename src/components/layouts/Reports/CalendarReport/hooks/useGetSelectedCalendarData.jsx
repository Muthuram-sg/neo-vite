import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetSelectedAssetCalendarData = () => {
    const [GetSelectedAssetCalendarDataLoading, setLoading] = useState(false);
    const [GetSelectedAssetCalendarDatadata, setData] = useState(null);
    const [GetSelectedAssetCalendarDataerror, setError] = useState(null);

    const getGetSelectedAssetCalendarData = async (entity_id,startDate,endDate) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getSelectedAssetCalendarData,{entity_id:entity_id,start:startDate,end:endDate})
            .then(assetlist => {
                console.log(assetlist,"assetlist")
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
    return { GetSelectedAssetCalendarDataLoading, GetSelectedAssetCalendarDatadata, GetSelectedAssetCalendarDataerror, getGetSelectedAssetCalendarData };
}

export default useGetSelectedAssetCalendarData;
