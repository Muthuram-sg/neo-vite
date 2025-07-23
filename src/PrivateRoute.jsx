import React from "react";
import { Navigate,useLocation,useParams } from "react-router-dom";
import { useAuth } from "components/Context";
import { useRecoilState } from "recoil";
import { LineHaveLicense} from "recoilStore/atoms";

function PrivateRoute({ children }) {
  const { authTokens,isErrorPage } = useAuth();
  let locPath = useLocation()
  let {schema,moduleName,subModule1,subModule2,queryParam} = useParams()
  const refresh_token = localStorage.getItem('refresh_token');
  const [isLineHaveLicense] = useRecoilState(LineHaveLicense)

  
  if ((!authTokens || authTokens === "undefined" || !refresh_token || refresh_token === 'undefined')  && !isLineHaveLicense && !isErrorPage) {
    // not logged in so redirect to login page with the return url
    if(moduleName || subModule1 || subModule2 || queryParam || schema){
      localStorage.setItem('location',locPath.pathname)
    }
  
    return <Navigate to="/login" />
  }
  else if(isLineHaveLicense){
    return <Navigate to="/licencseExpired"/>
  }
  else if(isErrorPage){
    return <Navigate to="/*"/>
  }

  return children;
}

export default PrivateRoute;