import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useUpdateLicensing = () => {
    const [outLicenseUpdateLoading, setLoading] = useState(false);
    const [outLicenseUpdateData, setData] = useState(null);
    const [outLicenseUpdateError, setError] = useState(null);

    const getSaveLicenseDetails = async ( line_id,expiry_date,expiry_remainder) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.SaveLicensingDetails,{ line_id,expiry_date,expiry_remainder})
            .then((response) => {
                console.log(response,"edit license")
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                console.log("NEW MODEL", "ERR", e, "License Setting Update", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { outLicenseUpdateLoading, outLicenseUpdateData, outLicenseUpdateError, getSaveLicenseDetails };
}


export default useUpdateLicensing;