import { useState } from "react";
import configParam from "../../../config";

const useTroubleLogin = () => {
    const [troubleLoading, setLoading] = useState(false);
    const [troubleData, setData] = useState(null);
    const [troubleError, setError] = useState(null);

    const troubleLogin = async (email) => {
        setLoading(true);
        var url = configParam.AUTH_URL + "/password/reset";
        var emailid = email.toUpperCase()
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
                username: emailid
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
                } else {
                    setData(null);
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
    return { troubleLoading, troubleData, troubleError, troubleLogin };
};

export default useTroubleLogin;