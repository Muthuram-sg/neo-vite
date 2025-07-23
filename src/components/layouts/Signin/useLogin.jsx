import axios from "axios";
import { useState } from "react";
import configParam from "../../../config";
import gqlQueries from "components/layouts/Queries"

const useLogin = () => {
  const [loginLoading, setLoading] = useState(false);
  const [loginData, setData] = useState(null);
  const [loginError, setError] = useState(null);

  const userLogin = async (u, p) => {
    setLoading(true);
   
    var url = configParam.AUTH_URL + "/login";
    var userid = "";
    if (isNaN(u.charAt(0)) && !isNaN(u.substring(1)) && u.length === 8) {
      userid = u.toUpperCase()
    } else {
      userid = u;
    }
    
    await axios.post(url,{
      username: userid,
      password: p,
    })
    .then((response) => { 
          if (response.status === 200) { 
                if (response.data.access_token) {
                  setData(response.data);
                  setError(false);
                  setLoading(false);
                }else if(response.data.redirect_link) {
                  setData(response.data);
                  setError(false);
                  setLoading(false);
                }  else {
                  setData('incorrect credentials');
                  setLoading(false);
                  setError(true);
                } 
          } else if (response.status === 401) {  
                setData('No Access');
                setLoading(false);
                setError(true); 
          } else {
            setData('incorrect credentials');
            setLoading(false);
            setError(true);
          }
        }) 
        .catch(error => {
          // console.log(error,"errorerror")
            if(error && error.response && error.response.data && error.response.data.info){
              setData(error.response.data.info);
            } else{
              // setData(error.response.data);              
              setData('User not Found');
            }
            setLoading(false);
            setError(true);
        });
  };
  return { loginLoading, loginData, loginError, userLogin };
};

export default useLogin;