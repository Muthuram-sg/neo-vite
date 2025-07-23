import { useState } from "react";
import configParam from "config";

const useDownloadReport = () => {
    const [DownloadReportLoading, setLoading] = useState(false); 
    const [DownloadReportError, setError] = useState(null); 
    const [DownloadReportData, setData] = useState(null); 

    const getDownloadReport = async (Name,ID) => {
        setLoading(true);
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/zip");
        myHeaders.append("x-access-token", localStorage.getItem("neoToken").replace(/['"]+/g, ""));
        myHeaders.append("responseType",'blob');
        const requestOptions = {
        method: "GET",
        headers: myHeaders 
        };
        const url = configParam.API_URL+"/iiot/reportFile?report_id="+ID;
        await fetch(url, requestOptions)
        .then((response) =>{
            if (response.status === 200) {  
                response.blob().then(function(myBlob) {
                    const fileURL = URL.createObjectURL(myBlob); 
                    const fileLink = document.createElement('a');
                    fileLink.href = fileURL; 
                    fileLink.setAttribute('download', Name);
                    fileLink.setAttribute('target', '_blank');
                    document.body.appendChild(fileLink);
                    fileLink.click();
                    fileLink.remove();
                });   
                setData("success")
                setError(false)
                setLoading(false)   
            }else{
                setData("failed")
                setError(false)
                setLoading(false)
                
            } 
        }) 
        .catch((error) => {
            setData(null)
            setError(true)
            setLoading(false)
            console.log("NEW MODEL", "ERR", error, "Reports Download", new Date())
        });
       

    };
    return {  DownloadReportLoading, DownloadReportData, DownloadReportError, getDownloadReport };
};

export default useDownloadReport;