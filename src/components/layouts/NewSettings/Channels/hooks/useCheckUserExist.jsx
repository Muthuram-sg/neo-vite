import { useState } from "react";
import configParam from "config"; 

const useCheckUserExist = () => {
    const [CheckUserExistLoading , setLoading] = useState(false);
    const [CheckUserExistData, setData] = useState(null);
    const [CheckUserExistError , setError] = useState(null);

    const getCheckUserExist = async (Name) => {
        setLoading(true);
        var url = configParam.API_URL + "/employee/checkchannels?name=" + Name;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append(
          "x-access-token", localStorage.getItem("neoToken").replace(/['"]+/g, "")
        );
        await fetch(url, {
          method: 'GET',
          headers: myHeaders,
        })
          .then(response => response.json())
          .then((userExistData) => {
           
            if (userExistData !== undefined && userExistData.data !== undefined) {
                 
                setData("Channel Name Already Exist")
                setError(false)
                setLoading(false)
            }
            else if (userExistData.errorTitle === "Invalid Name" && userExistData.errorMessage === "Channel does not exist") { 
                setData({errorTitle:"Invalid Name",errorMessage:"Channel does not exist"  })
                setError(false)
                setLoading(false)
            } 
          })
          .catch((e) => {
            setLoading(false);
            setError(e);
            setData(null);
            console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
        });
        
    };
    return {  CheckUserExistLoading, CheckUserExistData ,CheckUserExistError, getCheckUserExist };
};

export default useCheckUserExist;