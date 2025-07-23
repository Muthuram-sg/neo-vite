

import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetLicenceData = () => {
    const [LicenseDataLoading, setLoading] = useState(false);
    const [LicenseDataData, setData] = useState(null);
    const [LicenseDataError, setError] = useState(null);

    const getGetLicenceData = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.LicenseDetails,{})
            .then((response) => {
                if (response && response.neo_skeleton_licensing_table && response.neo_skeleton_licensing_table.length > 0) {
                    setData(response.neo_skeleton_licensing_table)
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
                console.log("NEW MODEL", e, "Getting calandar Setting Screen", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { LicenseDataLoading, LicenseDataData, LicenseDataError, getGetLicenceData };
};
  

export default useGetLicenceData