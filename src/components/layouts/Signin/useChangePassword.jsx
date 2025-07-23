import { useState } from "react";
import configParam from "../../../config";

const useChangePassword = () => {
    const [cpLoading, setLoading] = useState(false);
    const [cpData, setData] = useState(null);
    const [cpError, setError] = useState(null);

    const changePassword = async (newpass, cnfpass, searchParams) => {
        setLoading(true);
        var url = configParam.AUTH_URL + "/password/reset/"+searchParams;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
                new_password : newpass,
                new_password_repeat : cnfpass
            }),
            redirect: "follow",
            referrerPolicy: 'no-referrer'
        };
        await fetch(url, requestOptions)
            .then((response) => {
                if (response.status === 200) {
                    response.text().then((text) => {
                        setData(text);
                        setLoading(false);
                        setError(false);
                    });
                } else if (response.status >= 400 || response.status < 500) {
                    setData("invToken");
                    setLoading(false);
                    setError(true);
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });
    };
    return { cpLoading, cpData, cpError, changePassword };
};

export default useChangePassword;