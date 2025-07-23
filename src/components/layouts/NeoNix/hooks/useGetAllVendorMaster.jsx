import { useState } from "react";
import configParam from "config"; 

const useGetVendorMaster = () => {
    const [vendorLoading, setVendorLoading] = useState(false);
    const [vendorData, setVendorData] = useState(null);
    const [vendorError, setVendorError] = useState(null);

    const getVendorMaster = async () => {
        setVendorLoading(true); 
        let url = "/neonix-api/api/VendorMaster/GetAllVendorMaster";

        await configParam.RUN_REST_API(url, "", "", "", "Get")
            .then((response) => {
                if (response !== undefined && response) {
                    setVendorData(response.response);
                    setVendorError(false);
                    setVendorLoading(false);
                } else {
                    setVendorData(null);
                    setVendorError(response);
                    setVendorLoading(false);
                }
            })
            .catch((e) => {
                console.log("VENDOR MASTER API FAILURE", e, window.location.pathname.split("/").pop(), new Date());
                setVendorLoading(false);
                setVendorError(e);
                setVendorData(null);
            });
    };

    return { vendorLoading, vendorData, vendorError, getVendorMaster };
};

export default useGetVendorMaster;
