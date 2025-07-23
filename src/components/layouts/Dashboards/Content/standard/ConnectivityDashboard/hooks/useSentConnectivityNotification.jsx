import { useState } from "react";
import configParam from "config";


const useSentConnectivityNotification = () => {
    const [ConnectivitySendEmailLoading, setLoading] = useState(false); 
    const [ConnectivitySendEmailError, setError] = useState(null); 
    const [ConnectivitySendEmailData, setData] = useState(null); 

    const getConnectivitySendEmail = async (data) => {
        setLoading(true);
        const url = "/mail/sentConnectivitymail";
    
        try {
            const response = await configParam.RUN_REST_API(url, data, '', '', "POST");
    
            const { accepted, rejected } = response.data;
    
            const result = {
                success: accepted.length,
                failure: rejected.length,
            };
    
            setData(result);
            setError(false);
        } catch (e) {
            console.error("Failed to send message", e);
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    
    return {  ConnectivitySendEmailLoading, ConnectivitySendEmailError, ConnectivitySendEmailData, getConnectivitySendEmail };
};

export default useSentConnectivityNotification;