import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetReportType = () => {
    const [GetReportTypeLoading, setLoading] = useState(false);
    const [GetReportTypedata, setData] = useState(null);
    const [GetReportTypeerror, setError] = useState(null);

    const getGetReportType = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getReportType)
            .then(assetlist => {
                if (assetlist.neo_skeleton_report_type.length > 0) {
                    setData(assetlist.neo_skeleton_report_type)
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
    return { GetReportTypeLoading, GetReportTypedata, GetReportTypeerror, getGetReportType };
}

export default useGetReportType;
