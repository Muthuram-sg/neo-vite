import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetLicence = () => {
    const [LicenseLoading, setLoading] = useState(false);
    const [LicenseData, setData] = useState(null);
    const [LicenseError, setError] = useState(null);

    const getLicenseData = async (line_id) => {
        console.log(line_id,"lineID")
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getLicenseDetails, {line_id:line_id})
            .then((returnData) => {
                if (returnData !== undefined && returnData.neo_skeleton_licensing_table && returnData.neo_skeleton_licensing_table.length > 0) {
                   console.log(returnData.neo_skeleton_licensing_table,"res")
                    setData(returnData.neo_skeleton_licensing_table)
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
                console.log("NEW MODEL", e, "Get License Data", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            });

    };
    return { LicenseLoading, LicenseData, LicenseError, getLicenseData };
};

export default useGetLicence;