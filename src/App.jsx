/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react"; 

import { Route, Routes, BrowserRouter,HashRouter, useNavigate,Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import { useRecoilState } from "recoil";
import { user, userData, userDefaultLines, currentPage, decodeToken, currentUserRole, isLogin,LineHaveLicense,ErrorPage,VisibleModuleAccess,selectedPlant, themeMode } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import { AuthContext } from "./components/Context";
import decode from "jwt-decode";
import LoadingScreenNDL from "./LoadingScreenNDL"
import configParam from "../src/config";
import gqlQueries from "./components/layouts/Queries"
import { useMutation } from "@apollo/client";
import Bowser from "bowser";
import { Helmet } from "react-helmet";
import routes from "routes";
import routes_users from "./routes_users";
import Chatbot from 'components/layouts/ChatBot/components/ChatBot';
import HandleRoutes from "components/HandleRoutes";
import axios from "axios";


const NEO = React.lazy(() => import(/* webpackChunkName: "neoTemplate" */ /* webpackPreLoad: true */ /* webpackPrefetch: true */  'components/layouts/neoTemplate.jsx'));
const Login = React.lazy(() => import(/* webpackChunkName: "LoginView" */ /* webpackPreLoad: true */ /* webpackPrefetch: true */'components/layouts/LoginView'));
const AccessCard = React.lazy(() => import('components/layouts/AccessCard/NotAccessRequired.jsx'));
const RequestAcc = React.lazy(() => import(/* webpackChunkName: "LoginView" */ /* webpackPreLoad: true */ /* webpackPrefetch: true */'components/layouts/AccessRequest'));
const ResetPassword = React.lazy(() => import(/* webpackChunkName: "LoginView" */ /* webpackPreLoad: true */ /* webpackPrefetch: true */'components/layouts/Signin/ResetPassword'));
const RouteMissing = React.lazy(() => import(/* webpackChunkName: "RouteMissing" */ /* webpackPreLoad: true */ /* webpackPrefetch: true */'components/RouteMissing'));
const Explore = React.lazy(() => import("components/layouts/Explore/index"));
const Dashboards = React.lazy(() => import("components/layouts/Dashboards/Dashboard"));
const Production = React.lazy(() => import("components/layouts/Settings/Production/Production"))
const Tasks = React.lazy(() => import("components/layouts/Tasks/NewTask")); 
const Offline = React.lazy(() => import("components/layouts/OfflineDAQ/index"))
const Reports = React.lazy(() => import("components/layouts/Reports"))
const Alarms = React.lazy(() => import("components/layouts/Alarms/index"))
const Analytics = React.lazy(() => import("components/layouts/Analytics/index.jsx"))
const PdM = React.lazy(() => import("components/layouts/FaultAnalysis/index"))
const Support = React.lazy(() => import("components/layouts/Support/index"))
const Sample = React.lazy(() => import("./Samples"));
const AssetHealth = React.lazy(() => import("components/layouts/AssetHealth/index"))
const OutofLicense = React.lazy(() => import("components/layouts/LicenseCard/OutofLicenseCard.jsx"));
const Scada=React.lazy(() => import("components/layouts/Scada/Scada"));
//const Production = React.lazy(() => import("components/layouts/Settings/Production/Production"));


 
export default function App() {
  
  const { t } = useTranslation();
  const [curPage] = useRecoilState(currentPage);
  const existingTokens = localStorage.getItem("neoToken");
  const [decoToken, setDecoToken] = useRecoilState(decodeToken);
  const [currUser, setcurruser] = useRecoilState(user);
  const [, setuserDetails] = useRecoilState(userData);
  const [, setUserDefaultLines] = useRecoilState(userDefaultLines);
  const [userLogin, setUserLogin] = useRecoilState(isLogin);
  const [currUserRole] = useRecoilState(currentUserRole); 
  const [errorPage] = useRecoilState(ErrorPage)
  const [headPlant] = useRecoilState(selectedPlant); 
  const [APP_type] = useState(import.meta.env.VITE_WEB || "web");
  const [moduleView] = useRecoilState(VisibleModuleAccess);
  const [CurTheme] = useRecoilState(themeMode)
  // const navigate_path = useNavigate(); 
const[,setFilteredRoutes]=useState("")
  // console.log("APP_type",APP_type,import.meta.env.VITE_WEB)
  const [authTokens, setAuthTokens] = React.useState(existingTokens);
  const [visibleModuleId,setVisibleModuleId]=useState([]);
  

  useEffect(() => {
    const mainModules = moduleView.mainModuleAccess
      .filter(x => x.module_id && !x.is_visible)
      .map(x => x.module_id);
    setVisibleModuleId(mainModules);
  }, [moduleView]);

  const baseUrl = window.location.hostname;

  const title =
  headPlant.custom_name ? `${headPlant.custom_name} - ` + t(curPage) : 
    (headPlant && headPlant.appTypeByAppType && headPlant.appTypeByAppType.id === 3) ||
    baseUrl?.toLowerCase().includes("cms")
      ? "CMS - " + t(curPage)
      : "Neo - " + t(curPage);

  //set clarity custom tags user id
  useEffect(()=>{
    if (currUser && currUser.name && typeof window.clarity === 'function') {
      window.clarity('set', 'User', currUser.name);
    }
  },[currUser])
  const setTokens = (data) => {
    setAuthTokens(data);
  };

  
  const changeFavIcon = async () => {
    const lineId = headPlant?.id;
    if (!lineId) return;
  
    const token = localStorage.getItem("neoToken")?.replace(/['"]+/g, "");
    const mode = localStorage.getItem("mode") === "dark" ? "dark" : "light";
    const fallbackMode = mode === "dark" ? "light" : "dark";
  
    const buildUrl = (category) =>
      `${configParam.API_URL}/settings/downloadLogo?category=${category}_favicon&line_id=${lineId}&x-access-token=${token}`;
  
    const setFavicon = (href, type = "image/x-icon") => {
      let link = document.querySelector("link[rel*='icon']") || document.createElement("link");
      link.rel = "icon";
      link.type = type;
      link.href = href;
      link.id = "faviconTag";
      document.head.appendChild(link);
    };
  
    const tryLoadFavicon = async (category) => {
      const url = buildUrl(category);
      try {
        const response = await fetch(url);
        if (!response.ok) return false;
    
        const blob = await response.blob();
    
        const contentType = blob.type || response.headers.get("content-type");
        if (!blob || blob.size === 0) return false;
    
        if (contentType === "image/png") {
          setFavicon(url, "image/png");
        } else if (contentType === "image/svg+xml") {
          const { data } = await axios.get(url);
          const svgBlob = new Blob([data], { type: "image/svg+xml" });
          const objectUrl = URL.createObjectURL(svgBlob);
          setFavicon(objectUrl, "image/svg+xml");
        } else {
          console.warn(`Unsupported content type: ${contentType}`);
          return false;
        }
    
        return true;
      } catch (e) {
        console.warn(`Error loading ${category} favicon`, e);
        return false;
      }
    };
    const success = await tryLoadFavicon(mode);
    if (!success) {
      const fallbackSuccess = await tryLoadFavicon(fallbackMode);
      if (!fallbackSuccess) {
        setFavicon("https://app.neo.saint-gobain.com/favicons/favicon_light.ico");
      }
    }
  };
  
  
  
  
  useEffect(() => {
   if(headPlant.id){
    // changeFavIcon()
  }
  if(headPlant.custom_name && localStorage.getItem('custom_name')){
    if(localStorage.getItem('custom_name') === 'Neo' && (headPlant.custom_name !== null && headPlant.custom_name !== undefined && headPlant.custom_name !== '')){
      localStorage.setItem('custom_name', headPlant.custom_name)
      // window.location.reload()
    }

  } if(localStorage.getItem('custom_name') === null || localStorage.getItem('custom_name') === undefined ){
      localStorage.setItem('custom_name', (headPlant.custom_name !== null && headPlant.custom_name !== undefined && headPlant.custom_name !== '') ? headPlant.custom_name : 'Neo')
  }
  }, [headPlant, CurTheme])

  const [userAccess] = useMutation(
    configParam.addUserHistory,
    {
      update: (inMemoryCache, returnData) => {
      //  console.log(returnData,"returnData") P:136
      }
    }
  );
  React.useEffect(() => {
    if (existingTokens !== "" && existingTokens !== "undefined" && existingTokens !== null) {
      var decodedToken = decode(existingTokens, { complete: true });
      var dateNow = new Date();

      if (decodedToken.exp < parseInt(dateNow.getTime() / 1000)) {
        (async () => {
          await configParam.FETCH_REFRESH_TOKEN()
            .then((result) => {
              // console.log(result,decodedToken.exp,parseInt(dateNow.getTime() / 1000))
              setAuthTokens(result.result.access_token);
              localStorage.setItem("neoToken",result.result.access_token)
            })
            .catch(error => console.log("error", error))
        })();
      } else {
        setAuthTokens(existingTokens);
        setDecoToken({ ...decode(existingTokens) });

        configParam.RUN_GQL_API(gqlQueries.GetUserDefaults, { user_id: decode(existingTokens).app_user_id })
          .then((returnData) => {
            if (returnData && returnData.neo_skeleton_user && returnData.neo_skeleton_user.length !== 0) {
              setuserDetails(returnData.neo_skeleton_user[0]);
              // console.log("__returnData__", headPlant)
              setcurruser({ id: returnData.neo_skeleton_user[0].id, sgid: returnData.neo_skeleton_user[0].sgid ? returnData.neo_skeleton_user[0].sgid : "", name: returnData.neo_skeleton_user[0].name });
              setUserDefaultLines(returnData.neo_skeleton_user[0].user_role_lines);
              if (userLogin) {
                setUserLogin(false);
                const browser = Bowser.parse(window.navigator.userAgent);
                const info = {
                  browser_name: browser.browser.name,
                  browser_version: browser.browser.version,
                  os_name: browser.os.name,
                  os_version: browser.os.versionName,
                  device: browser.platform.type
                };
                userAccess({ variables: { user_id: returnData.neo_skeleton_user[0].id, info: info } });
              }
            }
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingTokens, setDecoToken]);
   
  const switchRoutes = (
    <Route  name="NEO - Dashboard" element={<PrivateRoute user={decoToken}><NEO /></PrivateRoute>}>
      {((currUserRole.id === 3)  ? routes_users : routes).mainRoutes.filter(x=> !visibleModuleId.includes(x.moduleId)).map((route, idx) => {
        return route.component ? (
          <Route
            key={idx}
            path={route.schema +route.path}
            exact={route.exact}
            name={route.name}
            element={<route.component />} />
        ) : (null);
      })}
      <Route path=":schema/dashboard/:moduleName" element={<Dashboards/>}/> 
      <Route path=":schema/scada/:moduleName" element={<Scada/>}/> 
      <Route path=":schema/dashboard/:moduleName/:subModule1" element={<Dashboards/>}/> 
      <Route path=":schema/dashboard/:moduleName/:subModule1/:queryParam" element={<Dashboards/>}/> 
      {/* <Route path=":schema/BIDashboard/:moduleName" element={<Dashboards/>}/> 
      <Route path=":schema/BIDashboard/:moduleName/:subModule1" element={<Dashboards/>}/> 
      <Route path=":schema/BIDashboard/:moduleName/:subModule1/:queryParam" element={<Dashboards/>}/>  */}
      <Route path=":schema/explore/:moduleName" element={<Explore/>} />
      <Route path=":schema/Tasks/:moduleName" element={<Tasks/>} />
      <Route path=":schema/AssetHealth/:moduleName" element={<AssetHealth/>} />
      <Route path=":schema/AssetHealth/:moduleName/:subModule1/:subModule2" element={<AssetHealth/>} />
      <Route path=":schema/Tasks/:moduleName/:queryParam" element={<Tasks/>} />
      {currUserRole.id !== 3 &&
      <Route path=":schema/production/:moduleName/:subModule1" element={<Production/>} />}
      {currUserRole.id !== 3 &&
      <Route path=":schema/production/:moduleName/:subModule1/:subModule2" element={<Production/>} />}
      <Route path=":schema/offline/:moduleName" element={<Offline/>} />
      <Route path=":schema/offline/:moduleName/:queryParam" element={<Offline/>} />
      <Route path=":schema/reports/:moduleName" element={<Reports/>} />
      <Route path=":schema/reports/:moduleName/:subModule1" element={<Reports/>} />
      <Route path=":schema/reports/:moduleName/:subModule1/:subModule2" element={<Reports/>} />
      {/* <Route path=":schema/reports/:moduleName/:queryParam" element={<Reports/>} />
      <Route path=":schema/reports/:moduleName/:subModule1/:queryParam" element={<Reports/>} /> */}
      <Route path=":schema/reports/:moduleName/:subModule1/:subModule2/:queryParam" element={<Reports/>} />
      <Route path=":schema/Alarms/:moduleName" element={<Alarms/>} />
      <Route path=":schema/Alarms/:moduleName/:queryParam" element={<Alarms/>} />
      <Route path=":schema/analytics/:moduleName/:queryParam" element={<Analytics/>} />
      <Route path=":schema/PdM/:queryParam" element={<PdM/>} />
      <Route path=":schema/help" element={<Support/>} />
      <Route path=":schema/routehandler" element={<HandleRoutes/>}/>
    </Route>
  );
  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens, HF: { HMS: "HH:mm:ss", HMSS: "HH:mm:ss:SSS", HM: "HH:mm" },isErrorPage: errorPage }}>
       {APP_type == 'portable' ? 
       <HashRouter>
          <Helmet>
            <meta charSet="utf-8" />
            <title>{title}</title>
          </Helmet>
          <React.Suspense fallback={<LoadingScreenNDL />}>
          
            <Routes>
              
              {switchRoutes}
              <Route path='/request_access' element={<RequestAcc />} />
              <Route path='/resetpassword/:id' element={<ResetPassword />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/sample" exact element={<Sample />} />
              <Route path='/licencseExpired' exact element={<OutofLicense/>} />
              <Route path='/AccessCard' exact element={<AccessCard/>} />
              <Route path="/" exact element={<Navigate to="/login" />} />
              {/* <Route path="*" element={<RouteMissing />} /> */}
            </Routes>
            {/* <Chatbot /> */}
          </React.Suspense>
        </HashRouter> : 
        <BrowserRouter>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{title}</title>
        </Helmet>
        <React.Suspense fallback={<LoadingScreenNDL />}>
          <Routes>
            
            {switchRoutes}
            <Route path='/request_access' element={<RequestAcc />} />
            <Route path='/resetpassword/:id' element={<ResetPassword />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/sample" exact element={<Sample />} />
            <Route path='/licencseExpired' exact element={<OutofLicense/>} />
            <Route path='/AccessCard' exact element={<AccessCard/>} />
            <Route path="/" exact element={<Navigate to="/login" />} />
            <Route path="*" exact element={<RouteMissing currUserRole={currUserRole} />} />
          </Routes>
          {/* <Chatbot /> */}
        </React.Suspense>
      </BrowserRouter>}

    </AuthContext.Provider>
  );
}
