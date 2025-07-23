import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useAddLicense = () => {
    const [addLicenseLoading, setLoading] = useState(false);
    const [addLicenseData, setData] = useState(null);
    const [addLicenseError, setError] = useState(null);

    const getAddLicense = async ( line_id,expiry_date,expiry_remainder ) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.AddLicensingDetails,{ line_id,expiry_date,expiry_remainder })
            .then((response) => {
                console.log(response,"add license")
                setData(response);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "license setting", new Date())
            })
    }

    return { addLicenseLoading, addLicenseData, addLicenseError, getAddLicense };
}


export default useAddLicense;