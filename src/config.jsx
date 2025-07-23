import { gql } from "graphql-tag";
import { promiseSetRecoil } from "recoil-outside"
import { apiTimeout } from "recoilStore/atoms"; 
import decode from "jwt-decode";
import moment from 'moment';
import React from "react"; 
import axios from 'axios';
import LogoLight from "assets/LogoLight.svg";
import Cmsicon from 'assets/neo_icons/Logos/cmslogo.svg'
const _get_app_url = function () {
  switch (import.meta.env.VITE_STAGE) {
    case "local-dev":
      return "http://localhost:3000";
    case "local-stage":
      return "http://localhost:3000";
    case "local-prod":
      return "http://localhost:3000";
    case "dev":
      return "https://dev.neo.indec4.saint-gobain.com";
    case "prod":
      return "https://app.neo.saint-gobain.com";
    case "stage":
      return "https://app.stage.neo.saint-gobain.com";
    case "cloud":
      return "https://app.neo.saint-gobain.com"
    default:
      return "";
  }
};


const _get_mqtt_url = () => {
  switch(import.meta.env.VITE_STAGE){
    case "local-dev":
      return "https://api.stage.neo.saint-gobain.com";
    case "local-stage":
      return "https://api.stage.neo.saint-gobain.com";
    case "local-prod":
      return "https://api.neo.saint-gobain.com";
    case "dev":
      return "https://dev.neo.indec4.saint-gobain.com/";
    case "prod":
      return "https://api.neo.saint-gobain.com";
    case "stage":
       return "https://api.stage.neo.saint-gobain.com"
      // return "https://api.stage.neo.saint-gobain.com";
    case "cloud":
      return "https://api.stage.neo.saint-gobain.com"
    default:
      return "";
  }
}
const _get_api_url = function () {
  switch (import.meta.env.VITE_STAGE) {
    case "local-dev":
      return "http://localhost:8090/api/v2";
    case "local-stage":
      return "http://localhost:8090/api/v2";
    case "local-prod":
      return " http://localhost:8090/api/v2";
    case "dev":
      return "https://dev.neo.indec4.saint-gobain.com/neo-api/api/v2";
    case "prod":
      return "https://api.neo.saint-gobain.com/neo-api/api/v2";
    case "stage":
      return "https://api.stage.neo.saint-gobain.com/neo-api/api/v2";
     
    case "cloud":
      return "https://neo.southindia.cloudapp.azure.com/api/v2";
    default:
      return "";
  }
};

const _get_neonix_api_url = function () {
  switch (import.meta.env.VITE_STAGE) {
    case "prod":
      return "https://phoenix.saint-gobain.com/phoenixproxy_api";
    case "stage":
      return "https://qas.phoenix.api.saint-gobain.com";
    default:
      return "";
  }
};

const _get_AUTH_URL = function () { 
  switch (import.meta.env.VITE_STAGE) {
    case "local-dev":
      return "https://ems2dest.ind4.saint-gobain.com/neo/v2/auth";
    case "local-stage":
      return "https://api.stage.neo.saint-gobain.com/auth";     
    case "local-prod":
      return "https://api.neo.saint-gobain.com/auth";
      //return "https://api.stage.neo.saint-gobain.com/auth"
    case "dev":
      return "https://dev.neo.indec4.saint-gobain.com/auth";
    case "prod":
      return "https://api.neo.saint-gobain.com/auth";
    case "stage":
      return "https://api.stage.neo.saint-gobain.com/auth";
    case "cloud":
      return "https://api.neo.saint-gobain.com/auth";
    default:
      return "";
  }
};

const _get_graphql_url = () => {
  switch (import.meta.env.VITE_STAGE) {
    case "local-dev":
      return "https://ems2dest.ind4.saint-gobain.com/neo/v2/skeleton/v1/graphql";
    case "local-stage":
      return "https://api.stage.neo.saint-gobain.com/skeleton/v1/graphql";
    case "local-prod":
      return "https://api.neo.saint-gobain.com/skeleton/v1/graphql";    
      //return "https://api.stage.neo.saint-gobain.com/skeleton/v1/graphql";
    case "dev":
      return "https://dev.neo.indec4.saint-gobain.com/skeleton/v1/graphql";
    case "prod":
      return "https://api.neo.saint-gobain.com/skeleton/v1/graphql";
    // case "stage":
    //   return "https://api.stage.neo.saint-gobain.com/skeleton/v1/graphql";
    case "stage":
      return "https://api.stage.neo.saint-gobain.com/skeleton1/v1/graphql";
    case "cloud":
      return "https://neo.southindia.cloudapp.azure.com/api/v1/skeleton/v1/graphql"
    default:
      return "";
  }
};




const _encode_query_qata = (data) => {
  const ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  return ret.join("&");
};

const get_prod_oee_value = (Datearr, cycleTime, total_parts, total_unplanned_dt, total_dt, quality_defects,range,OverallDownTime) => {
  let exp_cycle_time = cycleTime.job_exp_cycle_time !== 0 ? cycleTime.job_exp_cycle_time : cycleTime.mode_exp_cycle_time
  let Exec = cycleTime.workExe ? [...cycleTime.workExe] : [] 
  let total_secs = ((new Date(Datearr.end) - new Date(Datearr.start)) / 1000)
  
  if(Exec.length > 0){
    Exec.sort((a, b) => new Date(b.jobStart) - new Date(a.jobStart));
    // console.log(Exec,"Exec")
    total_secs = 0
    let ExeEndDate = (range === 11 || range === 6) ? new Date() : Datearr.end
    Exec.forEach((d,i)=>{
      let Ended_at = Exec[i].ended_at ? Exec[i].jobEnd : ExeEndDate
      total_secs = total_secs + (( new Date(Ended_at) - new Date(Exec[i].jobStart)) / 1000)
    })
  }
  let total_planned_dt = total_dt - total_unplanned_dt
  // console.log(new Date(Datearr.start), new Date(Datearr.end), total_secs, exp_cycle_time, total_parts, total_unplanned_dt, total_dt, quality_defects, "get_oee_value",total_planned_dt,Exec,Datearr,range)
  let avail = 1 - (total_unplanned_dt / (total_secs - total_planned_dt))
  let availLoss = (total_unplanned_dt)

  let perf = total_parts / ((total_secs - total_dt) / exp_cycle_time)

  if(Exec.length > 1){ 
    perf = cycleTime.mode_exp_cycle_time / cycleTime.part_act_cycle_time
  }
  // console.log(total_parts / ((total_secs - total_dt) / exp_cycle_time),"performance",total_parts,total_secs,total_dt,perf,avail)
  let runTime = total_secs - total_dt
  let downTime = total_dt
  let expParts = (total_secs - total_planned_dt) / exp_cycle_time
  let targetedParts = (total_secs - total_dt) / exp_cycle_time
  let qual = 1 - (quality_defects / total_parts)
  let perfLoss = ((expParts - total_parts) * exp_cycle_time) - availLoss
  let qualLoss = (quality_defects * exp_cycle_time) 
  avail = isNaN(avail) || !isFinite(avail) || !avail ? 0 : avail;
  perf = isNaN(perf) || !isFinite(perf) || !perf ? 0 : perf;
  qual = isNaN(qual) || !isFinite(qual) || !qual ? 0 : qual; 
  let temp1 = targetedParts - total_parts
  let temp2 = total_parts - targetedParts
  let partDiffVal = temp1 < 0 ? temp2 : temp1
  let partDiffStat = temp1 < 0 ? "Ahead" : "Behind"
  // console.log(avail,"availavail",isNaN(partDiffVal) , partDiffVal,perf)
  return { availability: avail, performance: perf, quality: qual, oee: avail * perf * qual, availLoss: availLoss, perfLoss: perfLoss, qualLoss: qualLoss, expParts: targetedParts, actParts: total_parts, expCycle: exp_cycle_time, actcycle: cycleTime.part_act_cycle_time, expSetup: 0, actSetup: 0, partDiffVal: Number.isFinite(partDiffVal) ? partDiffVal : 0, partDiffStat: partDiffStat, runTime: runTime, downTime: downTime, rejParts: quality_defects }
}

const _fetch_refresh_token = async (url, data,lineid) => {  
  var child_lines = JSON.parse(localStorage.getItem("child_line_token")) 
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let refreshurl = url? url:config.AUTH_URL + "/refresh";
  let r_token = localStorage.getItem("refresh_token");
  if(r_token && r_token !== 'undefined'){
    return fetch(refreshurl, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ refresh_token: r_token })
    })
      .then(response =>{ 
        if(!response.ok && response.status === 401) { 
          localStorage.removeItem("neoToken");
          localStorage.removeItem("refresh_token");
          window.location.reload()
        }
        else return response.json();
        // response.json()
      })
      .then((result) => {
        // console.log(result,"refreshToken")
        if (Object.keys(result).length > 0) {
          if (result["refresh_token"]) {
            localStorage.setItem("refresh_token", result["refresh_token"])
          }
          else {
            localStorage.removeItem("refresh_token");
          }
          if (result["access_token"]) {
            if(lineid){
              const curr_line = child_lines.findIndex(x=>x.line_id === lineid);
              child_lines[curr_line]['token'] = result["access_token"];
              localStorage.setItem("child_line_token",JSON.stringify(child_lines));
            }else{
              localStorage.setItem("neoToken", result["access_token"])  
            }   
          }
          else {
            localStorage.removeItem("neoToken");
          }
          return { url: url, data: data, result: result };
        } else {
          console.log("rest api no response from refresh token hit",result);
          localStorage.removeItem("neoToken");
          localStorage.removeItem("refresh_token");
          window.location.reload()
        }
      })
      .catch((error) => {
        console.log('_fetch_refresh_token_error', error); 
        return {};
        // localStorage.removeItem("refresh_token");
        // window.location.reload();
      });     
  }else{
        localStorage.removeItem("neoToken");
        localStorage.removeItem("refresh_token");
        window.location.reload();
  }
  
}

export const _check_and_get_token = async (existingTokens,lineid) => {
  try {    
    var child_lines = JSON.parse(localStorage.getItem("child_line_token")) 
    let decodedToken = decode(existingTokens, { complete: true });
    let dateNow = new Date();
    // console.log(decodedToken.exp < parseInt(dateNow.getTime() / 1000),"decodedToken.exp < parseInt(dateNow.getTime() / 1000)",new Date(decodedToken.exp),new Date(parseInt(dateNow.getTime() / 1000)))
    if (decodedToken.exp < parseInt(dateNow.getTime() / 1000)) {
      let r_token = localStorage.getItem("refresh_token");
      if(r_token && r_token !== 'undefined'){
      // (async () => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let url = config.AUTH_URL + "/refresh"+ (lineid ? "?tenant_id="+ lineid : '');
        return fetch(url, {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify({ refresh_token: r_token })
        })
          .then(response => response.json())
          .then(async result => {
            // console.log(result,"_check_and_get_token1")
            if (Object.keys(result).length > 0) {
              // console.log(result,"_check_and_get_token4")
              if (result["refresh_token"]) {
                localStorage.setItem("refresh_token", result["refresh_token"])
              }
              else {
                localStorage.removeItem("refresh_token");
              }
              if (result["access_token"]) {
                if(lineid){
                  const curr_line = child_lines.findIndex(x=>x.line_id === lineid);
                  child_lines[curr_line]['token'] = result["access_token"];
                  localStorage.setItem("child_line_token",JSON.stringify(child_lines));
                }else{
                  localStorage.setItem("neoToken", result["access_token"])  
                }                                
              }
              else {
                localStorage.removeItem("neoToken");
              }
              // console.log(result["access_token"],"_check_and_get_token3")
              return result["access_token"];
            } else {
              console.log("no response from refresh token hit");
              return ""
            }
          })
          .catch((error) => {
            console.log('error_check_and_get_token', error);
            // window.location.reload();
          });
      // })();
      }else{        
        localStorage.removeItem("neoToken");
        window.location.href = '/login';
      }
    }
    else {
      return existingTokens
    }
  }
  catch (e) {
    return ""
  }
}

export const refesh_neo_token = async (lineid, callback) => {
  try {
    var child_lines = JSON.parse(localStorage.getItem("child_line_token")) 
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = config.AUTH_URL  + "/refresh"+ (lineid ? "?tenant_id="+ lineid : '');
    let r_token = localStorage.getItem("refresh_token");
    return fetch(url, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ refresh_token: r_token })
    })
      .then(response => response.json())
      .then(async result => {
        // console.log(result,"_check_and_get_token1")
        if (Object.keys(result).length > 0) {
          // console.log(result,"_check_and_get_token4")
          if (result["refresh_token"]) {
            // console.log("SET REFRESH TOKEN")
            localStorage.setItem("refresh_token", result["refresh_token"])
          }
          else {
            localStorage.removeItem("refresh_token");
          }
          if (result["access_token"]) {
            if(lineid){
              const curr_line = child_lines.findIndex(x=>x.line_id === lineid);
              child_lines[curr_line]['token'] = result["access_token"];
              localStorage.setItem("child_line_token",JSON.stringify(child_lines));
            }else{
              // console.log("SET NEO TOKEN")
              localStorage.setItem("neoToken", result["access_token"])  
              callback(result['access_token'])
            }                                
          }
          else {
            localStorage.removeItem("neoToken");
          }
          // console.log(result["access_token"],"_check_and_get_token3")
          
          return result["access_token"];
        } else {
          console.log("no response from refresh token hit");
          return ""
        }
      })
      .catch((error) => {
        console.log('error_check_and_get_token', error);
        // window.location.reload();
      });
  }
  catch(e){}
}

const _run_rest_api = async (url, data, childToken,lineid,method = 'GET',noHeader,retries = 3) => {
  let controller = new AbortController();
  let signal = controller.signal;
  let myHeaders = new Headers();
  
  
  // console.log(url, data, childToken,"url, data, childToken",_get_api_url() + url + (method === 'GET' ? "?" + _encode_query_qata(data) : ''))
  let token = await _check_and_get_token(childToken ? childToken.replace(/['"]+/g, "") : localStorage.getItem("neoToken").replace(/['"]+/g, ""),lineid?lineid:null);
  
  // console.log(token,"tokentokentoken")
  if (token === "") {
    window.location.reload()
  }
  if(!noHeader){
    myHeaders.append("Content-Type", "application/json");
  }
  myHeaders.append("x-access-token", token);
  if(url === '/neoai/askMeAnything' ){
    setTimeout(() => controller.abort(), 300000);

  }else{
  setTimeout(() => controller.abort(), url === "/iiot/getreport" ||   url === "/dashboards/machinestatussignal" || url === "dashboards/actualPartSignal" || url === "/dashboards/getpartsperdressing"  || url === "/dashboards/actualPartSignal"  ? 300000 : 60000);

  }
  let Json = {
    method: method,
    headers: myHeaders,
    signal: signal
  }
  // Json["body"] = (method === 'POST') ? JSON.stringify(data) : ''

  if(method === 'POST' ||  method === 'PUT'){
    let DataType = noHeader ? data : JSON.stringify(data)
    Json["body"] = (method === 'POST' ||  method === 'PUT') ? DataType : ''
  }
  // else{
  //   Json["body"] = data
  // }

  return fetch( ( url.includes("neonix-api") ? _get_neonix_api_url() : _get_api_url()) + url + ((method === 'GET' || method ==="DELETE" ) ? "?" + _encode_query_qata(data) : ''), Json).then(async (response) => {
    
    const contentType = response.headers.get("content-type");
    if (response.status === 401 || response.status === 403) {
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then(async (result) => {
          if (result !== undefined && result.errorTitle !== undefined && result.errorMessage !== undefined) {
            if (result.errorTitle === "Authentication error" || result.errorTitle === "Invalid Token") {
              
              //var returnedRefresh = await _fetch_refresh_token(url, data)
              var returnedRefresh = await _fetch_refresh_token("",data,lineid?lineid:null) 
              // console.log(returnedRefresh,"returnedRefreshreturnedRefresh")
              if (returnedRefresh.data) {
                // console.log('recall url')
                return _run_rest_api(url, returnedRefresh.data,returnedRefresh.result.access_token,lineid,method, noHeader, 0)
              }
            }
            else {
              console.log("success")
              return result;
            }
          }
          else {
            return { errorTitle: 'No Valid Response', errorMessage: 'No Valid Response' };
          }
        }); 
      }
      else {
        return response.text().then((text) => {
          return { data: text };
        });
      }
    }
    else if (response.status === 200) {
      // console.log(contentType,"contentTypecontentType",response)
      if(contentType && contentType.indexOf("application/octet-stream") !== -1){
        return response.blob();
      }else if(contentType && (contentType==='image/png' || contentType === 'image/jpeg' || contentType === 'image/jpg')){
        return response.blob();
      }else{
        if(url === '/neoai/askMeAnything'){
          return response
        } else if(url === '/mail/sentwelcomemail'){
          return {data:"Email Sent Successfully"}
        }else{
          return response.json().then((result) => {
            if (result !== undefined && result.data !== undefined) {
              return result
            }else{
              return result
            }
  
          });
        }
      }      
    } else if(response.status === 201){
      if(url.includes('neonix-api')){
       
        return response.json().then((result) => {
            return result.response
        });
      }
    } else if (response.status === 400 || response.status === 409 || response.status === 500 || response.status === 502) { 
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then((result) => {
          if (result !== undefined) {
            if (result.errorTitle !== undefined && result.errorMessage !== undefined) {
              return result
            }
            else {
              return { data: result }

            }
          }
        });
      }
      else {
        return response.text().then((text) => {
          return { data: text };
        });
      }
    }

  })
    .catch((e) => {
      console.log(e,"RUN_REST_API")
      if (retries > 0 &&  url !== "/neoai/askMeAnything") return _run_rest_api(url, data,childToken,lineid, method,noHeader,retries - 1);
      else {
        promiseSetRecoil(apiTimeout, true);
        return e;
      }
    });
};

const _run_file_api = async (existingTokens,lineid) => {
  try {    
    var child_lines = JSON.parse(localStorage.getItem("child_line_token")) 
    let decodedToken = decode(existingTokens, { complete: true });
    let dateNow = new Date();
    // console.log(decodedToken.exp < parseInt(dateNow.getTime() / 1000),"decodedToken.exp < parseInt(dateNow.getTime() / 1000)",new Date(decodedToken.exp),new Date(parseInt(dateNow.getTime() / 1000)))
    if (decodedToken.exp < parseInt(dateNow.getTime() / 1000)) {
      let r_token = localStorage.getItem("refresh_token");
      if(r_token && r_token !== 'undefined'){
      // (async () => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let url = config.AUTH_URL + "/refresh"+ (lineid ? "?tenant_id="+ lineid : '');
        return fetch(url, {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify({ refresh_token: r_token })
        })
          .then(response => response.json())
          .then(async result => {
            // console.log(result,"_check_and_get_token1")
            if (Object.keys(result).length > 0) {
              // console.log(result,"_check_and_get_token4")
              if (result["refresh_token"]) {
                localStorage.setItem("refresh_token", result["refresh_token"])
              }
              else {
                localStorage.removeItem("refresh_token");
              }
              if (result["access_token"]) {
                if(lineid){
                  const curr_line = child_lines.findIndex(x=>x.line_id === lineid);
                  child_lines[curr_line]['token'] = result["access_token"];
                  localStorage.setItem("child_line_token",JSON.stringify(child_lines));
                }else{
                  localStorage.setItem("neoToken", result["access_token"])  
                }                                
              }
              else {
                localStorage.removeItem("neoToken");
              }
              // console.log(result["access_token"],"_check_and_get_token3")
              return result["access_token"];
            } else {
              console.log("no response from refresh token hit");
              return ""
            }
          })
          .catch((error) => {
            console.log('error_check_and_get_token', error);
            // window.location.reload();
          });
      // })();
      }else{        
        localStorage.removeItem("neoToken");
        window.location.href = '/login';
      }
    }
    else {
      return existingTokens
    }
  }
  catch (e) {
    return ""
  }

}

const _run_gql_api = async (query, variables,childToken,lineid, retries = 3) => {
  // console.log(childToken,"childToken",localStorage.getItem("neoToken").replace(/['"]+/g, ""))
  let controller = new AbortController();
  let signal = controller.signal;
  let LocalToken= localStorage.getItem("neoToken")?localStorage.getItem("neoToken").replace(/['"]+/g, ""):''
  let token = await _check_and_get_token(childToken ? childToken.replace(/['"]+/g, "") : LocalToken,lineid?lineid:"");
  if (token === "") {
    window.location.reload()
  }
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Authorization",
    "Bearer " + token
  );
  setTimeout(() => controller.abort(), 20000);
  return fetch(_get_graphql_url(), {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({ query: query, variables: variables }),
    signal: signal,
  })
    .then((response) => response.json())
    .then((result) => {

      if ((result !== undefined && result.errors !== undefined && (result.errors[0].extensions.code) && (result.errors[0].extensions.code === 'authentication-failed' || result.errors[0].extensions.code === 'invalid-jwt'))) {
        // console.log('unnecessary entering');
        var returnedRefresh = _fetch_refresh_token("",{query:query,variables:variables},lineid?lineid:null)
        if (returnedRefresh.data) {
          return _run_gql_api(returnedRefresh.data.query, returnedRefresh.variables,childToken,lineid, 0)

        }
      }
      else { 
        return result["data"];
      }
    })
    .catch((e) => {
      console.log("catch ------e", e);
      // console.log("query ------e", query);

      if (retries > 0) return _run_gql_api(query, variables,childToken,lineid, 0);
      else {
        promiseSetRecoil(apiTimeout, true);
        return e;
      }
    });
};

const _time_diff = (time) => {
  const MINUTE = 60;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  if (!time) return "";
  let createdTime = new Date(time).getTime();
  let diff = ((new Date().getTime() - createdTime) / 1000).toFixed();
  if (diff < 1 * MINUTE)
    return Number(diff) === 1 ? "a second ago" : diff + " seconds ago";

  if (diff < 2 * MINUTE) return "a minute ago";

  if (diff < 45 * MINUTE) return (diff / MINUTE).toFixed() + " minutes ago";

  if (diff < 90 * MINUTE) return "an hour ago";

  if (diff < 24 * HOUR) return (diff / HOUR).toFixed() + " hours ago";

  if (diff < 48 * HOUR) return "yesterday";

  if (diff < 7 * DAY) return (diff / DAY).toFixed() + " days ago";

  if (diff < 5 * WEEK) {
    let diffWeeks = (diff / WEEK).toFixed();
    return diffWeeks <= 1 ? "a week ago" : diffWeeks + " weeks ago";
  }
};

const _time_diff_short = (time) => {
  const MINUTE = 60;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  if (!time) return "";
  let createdTime = new Date(time).getTime();
  let diff = ((new Date().getTime() - createdTime) / 1000).toFixed();
  if (diff < 1 * MINUTE) return Number(diff) === 1 ? "1s" : diff + "s";

  if (diff < 2 * MINUTE) return "1m";

  if (diff < 45 * MINUTE) return (diff / MINUTE).toFixed() + "m";

  if (diff < 90 * MINUTE) return "1h";

  if (diff < 24 * HOUR) return (diff / HOUR).toFixed() + "h";

  if (diff < 48 * HOUR) return "1d";

  if (diff < 7 * DAY) return (diff / DAY).toFixed() + "d";

  if (diff < 5 * WEEK) {
    let diffWeeks = (diff / WEEK).toFixed();
    return diffWeeks <= 1 ? "1w" : diffWeeks + "w";
  }
};

const cmsUrl="cms.saint-gobain.com"
const lightValues = {
  color: "rgb(22, 22, 22)",
  border: "1px solid #e0e0e0"
};

const darkValues = {
  color: "#c6c6c6",
  border: "1px solid rgba(255, 255, 255, 0.12)"
};

const _get_style_value = (prop, theme) => {
  if (theme === "light") {
    return lightValues[prop];
  } else {
    return darkValues[prop];
  }
} 

const _render_divider = () => {
  return (<React.Fragment>
  </React.Fragment>)
}
const convertTime = (time) => {
  let st = new Date(
    moment().format(
      `YYYY-MM-DDT` + time
    ) + "Z"
  );
  let st1 = st.toLocaleTimeString("en-GB");
  let st2 = st1.split(":");
  return `${st2[0]}:${st2[1]}`;
}
var janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
var julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
var stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset
let TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight

const _get_moment_for_dashboard = (index, headPlant) => {
  const Objdate = new Date();
  let yesday = new Date().getDay()
  const Strdate = Objdate.toISOString().split('T').shift();
  let shifts = (headPlant && headPlant.shift && headPlant.shift.ShiftType !== "Weekly") ? headPlant.shift.shifts : [];

  let shiftToDates = shifts.map(date => {
    // console.log('date',date)
    var beginningTime = moment(date.startDate + '+00:00', 'HH:mmZ');
    // moment().format(`YYYY-MM-DDT` + date.startDate) + 'Z'
    var closeTime = moment(date.endDate + '+00:00', 'HH:mmZ');
    // console.log(moment(beginningTime).format("YYYY-MM-DDTHH:mm:ss"),date,"Startdate",moment(closeTime).format("YYYY-MM-DDTHH:mm:ss") )
    if (closeTime.isBefore(beginningTime)) {
      closeTime.add(1, 'days');
       
    }
    return { start: beginningTime, end: closeTime }
  })
  
  switch (Number(index)) {
    case 27:
      return moment().subtract(1, 'minutes').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 1:
      return moment().subtract(6, 'minutes').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 2:
      return moment().subtract(16, 'minutes').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 3:
      return moment().subtract(31, 'minutes').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 4:
      return moment().subtract(61, 'minutes').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 5:
      return moment().subtract(361, 'minutes').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 6:
      return moment().startOf('day').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 7:
      return moment(moment().subtract(1, 'day')).startOf('day').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 8:
      return moment().startOf('week').format('YYYY-MM-DDTHH:mm:ss'+TZone);
    case 9:
      return moment().startOf('month').format('YYYY-MM-DDTHH:mm:ss'+TZone);
    case 10:
      return moment().format();
    case 12:
      return moment().subtract(181, 'minutes').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 13:
      return moment().subtract(1441, 'minutes').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 14:
      return moment().subtract(6, 'day').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 15:
      return moment().subtract(30, 'day').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 16:
      return moment().subtract(1, 'month').startOf('month').startOf('day').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 24:
      return moment().subtract(90, 'days').startOf('day').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 18:
      return moment().subtract(3, 'month').startOf('day').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 26:
        return moment().subtract(6, 'month').startOf('day').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 19:
      let shiftToday;
      const dateObj = new Date();
      let day = new Date().getDay()
      const dateStr = dateObj.toISOString().split('T').shift();
      if (headPlant.shift && headPlant.shift.shifts) {
        let DST1
        if (headPlant.shift.ShiftType === "Weekly") {
          let arry = day ? (day - 1) : 6
          let weektime = headPlant.shift.shifts[arry]
          DST1 = moment(dateStr + ' ' + convertTime(weektime[0].startDate)).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ"); 
        } else {
          DST1 = moment(dateStr + ' ' + convertTime(headPlant.shift.shifts[0].startDate)).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ"); 
        }
        shiftToday = DST1 
      }
      return shiftToday ? shiftToday : moment().format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 20:
      let shiftYestarday;
      if (headPlant.shift && headPlant.shift.shifts) {
        let DST1
        if (headPlant.shift.ShiftType === "Weekly") {
          let arry = yesday ? (yesday - 1) : 6
          let weektime = headPlant.shift.shifts[arry ? (arry - 1) : 6]
          DST1 = moment(Strdate + ' ' + convertTime(weektime[0].startDate)).subtract(1, 'day'); 
        } else {
          DST1 = moment(Strdate + ' ' + convertTime(headPlant.shift.shifts[0].startDate)).subtract(1, 'day')  
        }
        shiftYestarday = DST1.utcOffset(stdOffset).format(`YYYY-MM-DDTHH:mm:ssZ`)  // Checking for Day-light Saving
      }
      return shiftYestarday ? shiftYestarday : moment().format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 22:
      let shiftEndYestarday;
      const Objdateend = new Date();
      let yesdayend = new Date().getDay()
      const Strdateend = Objdateend.toISOString().split('T').shift();
      if (headPlant.shift && headPlant.shift.shifts) {
        let DST1
        if (headPlant.shift.ShiftType === "Weekly") {
          let arry = yesdayend ? (yesdayend - 1) : 6
          let weektime = headPlant.shift.shifts[arry ? (arry - 1) : 6]
          const shiftstart = new Date(
            moment().format(
              `YYYY-MM-DDT` + weektime[weektime.length - 1].startDate
            )
          );
          const shiftend = new Date(
            moment().format(
              `YYYY-MM-DDT` + weektime[weektime.length - 1].endDate
            )
          );
          if (shiftstart > shiftend) {
            DST1 = moment(Strdateend + ' ' + convertTime(weektime[weektime.length - 1].endDate))
          } else {
            DST1 = moment(Strdateend + ' ' + convertTime(weektime[weektime.length - 1].endDate)).subtract(1, 'day')  
          }
          console.log(Strdate,headPlant.shift,"shiftEndYestarday",shiftEndYestarday,weektime)
        } else {
          if (headPlant.shift.shifts[0].startDate === headPlant.shift.shifts[headPlant.shift.shifts.length - 1].endDate) {
            DST1 = moment(Strdateend + ' ' + convertTime(headPlant.shift.shifts[headPlant.shift.shifts.length - 1].endDate)) 
          }
          else {
            DST1 = moment(Strdateend + ' ' + convertTime(headPlant.shift.shifts[headPlant.shift.shifts.length - 1].endDate)).subtract(1, 'day')  
          } 
        }
        shiftEndYestarday = DST1.utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ"); // Checking for Day-light Saving
        // console.log(headPlant.shift,"headPlant.shift")
      }
      return shiftEndYestarday ? shiftEndYestarday : moment().format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 21:
      // Last Shift 
      let Lastshiftstart;
      if (headPlant.shift && headPlant.shift.shifts) {
        if (headPlant.shift.ShiftType === "Weekly") {
          let arry = yesday ? (yesday - 1) : 6
          let weektime = headPlant.shift.shifts[arry]
          let datearr = []
          let datearr2 = []
          for (let j = 0; j < weektime.length; j++) {
            let end = convertTime(weektime[j].endDate);
            let start = convertTime(weektime[j].startDate);
            let endtime = moment(Strdate + ' ' + end);
            if (new Date(Strdate + ' ' + start).getTime() > new Date(Strdate + ' ' + end).getTime()) {
              endtime = moment(Strdate + ' ' + end).add(1, 'day')
            }
            let datefound = moment(Objdate).isBetween(moment(Strdate + ' ' + start), moment(endtime))
            // console.log(endtime,datefound,"datefound",moment(Objdate).format("YYYY-MM-DD HH:mm:ssZ"),moment(Strdate+' '+weektime[j].startDate).format("YYYY-MM-DD HH:mm:ssZ"),moment(endtime).format("YYYY-MM-DD HH:mm:ssZ"))
            let startdt
            if (datefound) {
              if (j > 0) {
                startdt = convertTime(weektime[j - 1].startDate);
                datearr.push(moment(Strdate + ' ' + startdt).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ"))
              } else {
                weektime = headPlant.shift.shifts[arry ? (arry - 1) : 6]
                startdt = convertTime(weektime[weektime.length - 1].startDate);
                datearr.push(moment(Strdate + ' ' + startdt).subtract(1, 'day').utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ"))
              }
            } else {
              
              if (j > 0) {
                startdt = convertTime(weektime[j - 1].startDate); 
              } else {
                startdt = convertTime(weektime[0].startDate);
              }
              datearr2.push(moment(Strdate + ' ' + startdt).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ"))
            }
          }
          Lastshiftstart = datearr.length > 0 ? datearr[0] : datearr2[datearr2.length - 1];
        } else {
          
          console.log(shiftToDates,"shift")
          const currentshift = shiftToDates.filter(x => { return moment().isBetween(moment(x.start), moment(x.end)) })
          // eslint-disable-next-line eqeqeq
          console.log('currentshift',currentshift);
          const requiredIndex = shiftToDates.indexOf(currentshift[0]) == 0 ? shiftToDates.length - 1 : shiftToDates.indexOf(currentshift[0]) - 1
          const lastshift = shiftToDates[requiredIndex]
          let DST1
          if(shiftToDates.indexOf(currentshift[0]) == 0){
            DST1 = lastshift ? moment(lastshift.start).subtract(1, 'day').utcOffset(stdOffset).format('YYYY-MM-DDTHH:mm:ssZ') : moment().utcOffset(stdOffset).format('YYYY-MM-DDTHH:mm:ssZ'); 
          }else{
            DST1 = lastshift? moment(lastshift.start).utcOffset(stdOffset).format('YYYY-MM-DDTHH:mm:ssZ') : moment().utcOffset(stdOffset).format('YYYY-MM-DDTHH:mm:ssZ'); 
          } 
          Lastshiftstart = DST1
        }

      }
      return Lastshiftstart ? Lastshiftstart : moment().format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 23:
      // Last Shift 
      let LastshiftEnd;
      if (headPlant.shift && headPlant.shift.shifts) {
        if (headPlant.shift.ShiftType === "Weekly") {
          let arry = yesday ? (yesday - 1) : 6
          let weektime = headPlant.shift.shifts[arry]
          let datearr = []
          let datearr2 = [] 
          for (let j = 0; j < weektime.length; j++) {
            const start = convertTime(weektime[j].startDate);
            const end = convertTime(weektime[j].endDate);
            let endtime = moment(Strdate + ' ' + end);
            // console.log('date diff', new Date(Strdate + ' ' + start), new Date(Strdate + ' ' + end))
            if (new Date(Strdate + ' ' + start).getTime() > new Date(Strdate + ' ' + end).getTime()) {
              endtime = moment(Strdate + ' ' + end).add(1, 'day')
            }
            let datefound = moment(Objdate).isBetween(moment(Strdate + ' ' + start), moment(endtime))
            // console.log(endtime,datefound,"datefound",moment(Objdate).format("YYYY-MM-DD HH:mm:ssZ"),moment(Strdate+' '+weektime[j].startDate).format("YYYY-MM-DD HH:mm:ssZ"),moment(endtime).format("YYYY-MM-DD HH:mm:ssZ"))
            if (datefound) {
              if (j > 0) {
                const enddate = convertTime(weektime[j - 1].endDate);
                datearr2.push(moment(Strdate + ' ' + enddate).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ"))
              } else {
                weektime = headPlant.shift.shifts[arry ? (arry - 1) : 6]
                const startdate = convertTime(weektime[weektime.length - 1].startDate);
                const enddate = convertTime(weektime[weektime.length - 1].endDate);
                if (new Date(Strdate + ' ' + startdate).getTime() > new Date(Strdate + ' ' + enddate).getTime()) {
                  datearr2.push(moment(Strdate + ' ' + enddate).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ"))
                } else {
                  let DST1 = moment(Strdate + ' ' + enddate).subtract(1, 'day').utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ") 
                  datearr.push(DST1)
                }

              }
            } else {
              let enddate
              if (j > 0) {
                enddate = convertTime(weektime[j - 1].endDate);
              } else {
                enddate = convertTime(weektime[0].endDate)
              }
              datearr2.push(moment(Strdate + ' ' + enddate).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ"))
            }
          }
          LastshiftEnd = datearr.length > 0 ? datearr[0] : datearr2[datearr2.length - 1];
          //console.log(datearr,datearr2,headPlant.shift,"headPlant.shift",LastshiftEnd,weektime)
        } else {
          const currentshift = shiftToDates.filter(x => { return moment().isBetween(moment(x.start), moment(x.end)) })
          // eslint-disable-next-line eqeqeq
          const requiredIndex = shiftToDates.indexOf(currentshift[0]) == 0 ? shiftToDates.length - 1 : shiftToDates.indexOf(currentshift[0]) - 1
          const lastshift = shiftToDates[requiredIndex]
          let DST1
          if(shiftToDates.indexOf(currentshift[0]) == 0){
            DST1 = lastshift?moment(lastshift.end).subtract(1, 'day').utcOffset(stdOffset).format('YYYY-MM-DDTHH:mm:ssZ'):moment().utcOffset(stdOffset).format('YYYY-MM-DDTHH:mm:ssZ'); 
          }else{
            DST1 = lastshift?moment(lastshift.end).utcOffset(stdOffset).format('YYYY-MM-DDTHH:mm:ssZ'):moment().utcOffset(stdOffset).format('YYYY-MM-DDTHH:mm:ssZ'); 
          } 
          LastshiftEnd = DST1
        }

      }
      return LastshiftEnd ? LastshiftEnd : moment().format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 11:
      let shiftStart;
      if (headPlant.shift && headPlant.shift.shifts) {
        
      if (headPlant.shift.ShiftType === "Weekly") { 
          let t = new Date().getDay() === 0 ? 7 : new Date().getDay() - 1;
          console.log(headPlant.shift,"headPlant.shift",t)
          if (shifts[t] && shifts[t].length > 0) {
            const currentshift = shifts[t].filter(x => {
              let FromTime = moment(moment().format(`YYYY-MM-DDT` + x.startDate + "Z")).format('HH:mm') 
              const starttime = new Date(moment().format(`YYYY-MM-DDT` + FromTime));
              const endtime = new Date(moment().format(`YYYY-MM-DDT` + x.endDate) + "Z");
              console.log('yes', moment(new Date()).isBetween(moment(starttime), moment(endtime)),)
              return moment(new Date()).isBetween(moment(starttime), moment(endtime))
            })
            if (currentshift.length > 0) {
              const startdt = convertTime(currentshift[0].startDate);
              const enddt = convertTime(currentshift[0].endDate);
              
              let startdate = new Date(moment().format(`YYYY-MM-DDT` + startdt + "Z"))
              // console.log(startdt,enddt,"enddtenddt",new Date(Strdate + ' ' + startdt).getTime() > new Date(Strdate + ' ' + enddt).getTime(),startdate,moment(startdate).format('YYYY-MM-DDTHH:mm:ssZ'))
              if (new Date(Strdate + ' ' + startdt).getTime() > new Date(Strdate + ' ' + enddt).getTime()) {
                startdate = moment(Strdate + ' ' + enddt).subtract(1, 'day').format("YYYY-MM-DD HH:mm:ssZ")
              }
              let DST1 = moment(startdate).utcOffset(stdOffset).format('YYYY-MM-DDTHH:mm:ssZ');
               
              shiftStart = DST1
            } else {
              shiftStart = moment().format('YYYY-MM-DDTHH:mm:ssZ');
            }
          }


        } else {
           
          // console.log("shiftToDates2shiftToDates2",shiftToDates)
          const currentshift = shiftToDates.filter(x => { return moment().isBetween(moment(x.start), moment(x.end)) })
          if (currentshift.length > 0) {
              let DST1 = moment(currentshift[0].start).utcOffset(stdOffset).format('YYYY-MM-DDTHH:mm:ssZ'); 
              shiftStart = DST1
          }
        }
      }
      console.log(shiftStart,"shiftStart",headPlant.shift)
      return shiftStart ? shiftStart : moment().format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 30:
      return moment().subtract(21, 'minutes').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 28:
      return moment().subtract(121, 'minutes').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    case 29:
      return moment().subtract(365, 'days').startOf('day').format("YYYY-MM-DDTHH:mm:ss"+TZone);

    default:
      return moment().format("YYYY-MM-DDTHH:mm:ss"+TZone);
  }

}

const logotype=(urlPath)=>{
 if(urlPath===cmsUrl){
  return {
    src: Cmsicon,
    alt: "CMS Logo",
    text:"Cms"
  };
  
 }
 else{
  return {
    src: LogoLight,
    alt: "NEO Logo",
    text:"Neo"
  };
 }
}



const  shuffleColors=(colors)=>{
  for (let i = colors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colors[i], colors[j]] = [colors[j], colors[i]];
  }
  return colors;
}

const mode = a => {
  a = a.slice().sort((x, y) => x - y);

  var bestStreak = 1;
  var bestElem = a[0];
  var currentStreak = 1;
  var currentElem = a[0];

  for (let i = 1; i < a.length; i++) {
    if (a[i - 1] !== a[i]) {
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
        bestElem = currentElem;
      }

      currentStreak = 0;
      currentElem = a[i];
    }

    currentStreak++;
  }

  return currentStreak > bestStreak ? currentElem : bestElem;
};

const formatTime = (range, time) => {
  // console.log(moment(time).utcOffset(stdOffset).format('DD-MM-YYYY'),"moment(time).utcOffset(stdOffset).format('DD-MM-YYYY')")
  if (range < 7 || range === 12 || range === 13) {
    return moment(time).utcOffset(stdOffset).format('HH:mm:ss')
  } else if (range === 7) {
    return moment(time).utcOffset(stdOffset).format('DD-MM HH:mm')
  } else {
    return moment(time).utcOffset(stdOffset).format('DD-MM-YYYY')
  }
}
const executionBasedStartandEnd = (jobStart,jobEnd,rangeStart,rangeEnd) =>{
  var tempStart="",tempEnd="";
  if(jobStart && jobEnd && rangeStart && rangeEnd){ 
    if (new Date(jobStart).getTime() <= new Date(rangeStart).getTime() || new Date(jobStart).getTime() >= new Date(rangeStart).getTime() || new Date(jobEnd).getTime() <= new Date(rangeEnd).getTime() || new Date(jobEnd).getTime() >= new Date(rangeEnd).getTime()) { 
      if (!(new Date(jobStart).getTime() < new Date(rangeStart).getTime() && new Date(jobEnd).getTime() < new Date(rangeStart).getTime()) &&
        !(new Date(jobStart).getTime() > new Date(rangeEnd).getTime() && new Date(jobEnd).getTime() > new Date(rangeEnd).getTime())) { 
        tempStart = (new Date(jobStart).getTime() >= new Date(rangeStart).getTime() && new Date(jobStart).getTime() <= new Date(rangeEnd).getTime())
          ? moment(jobStart).format('YYYY-MM-DDTHH:mm:ssZ') : rangeStart;
        tempEnd = (new Date(jobEnd).getTime() <= new Date(rangeEnd).getTime() &&
          new Date(jobEnd).getTime() >= new Date(rangeStart).getTime())
          ? moment(jobEnd).format('YYYY-MM-DDTHH:mm:ssZ') : rangeEnd 
          return [tempStart,tempEnd];
      }else{ 
        return [tempStart,tempEnd]
      }
    }else{ 
      return [tempStart,tempEnd]
    }
  }else{
    return [tempStart,tempEnd]
  }
} 
const calculateMaterialEfficiency = (feed,dried,scrap) =>{
  const result = ((dried-scrap)/feed)*100;
  return isNaN(result)?0:result;
}
const calculateDryerOEE = (execution,DateArr,feed_data,dried_data,scrap_data,downtime,totalDowntime) =>{
  try{ 
    const planned_time =  ((new Date(DateArr.end) - new Date(DateArr.start)) / 1000)
    const cycle_time = execution.cycleTime;
    let run_time = planned_time - downtime; 
  let total_planned_dt = totalDowntime - downtime;   
  let expParts = (planned_time - total_planned_dt) / cycle_time 
  // eslint-disable-next-line no-unused-vars 
  let perfLoss = ((expParts - dried_data) * cycle_time) - downtime;
  let qualLoss = (scrap_data * cycle_time) 
    let availability = run_time/planned_time;
    let sand_production_qty = dried_data - scrap_data; 
    let performance = (sand_production_qty * cycle_time)/planned_time; 
    let quality = (dried_data - scrap_data)/feed_data;
    let oee = ((availability + quality + performance)/3)*100; 
    return { availability: isNaN(availability)?0:availability, performance: isNaN(performance)?0:performance, quality: isNaN(quality)?0:quality, oee: isNaN(oee)?0:Math.round(oee), availLoss: downtime, perfLoss: perfLoss, qualLoss: qualLoss, expParts: expParts, actParts: dried_data, expCycle: cycle_time, actcycle: 0, expSetup: expParts, actSetup: 0, partDiffVal: 0, partDiffStat: "Behind", runTime:run_time, downTime:downtime  };
    
  }catch(err){ 
    return { availability: 0, performance: 0, quality: 0, oee: 0, availLoss: 0, perfLoss: 0, qualLoss: 0, expParts: 0, actParts: 0, expCycle: 0, actcycle: 0, expSetup: 0, actSetup: 0, partDiffVal: 0, partDiffStat: "BehindCCC", runTime: 0, downTime: 0 };
  }
  
}
const calculateEnergyEfficiency = (energy) =>{
  try{ 
      const evaporatedMoist = energy.moistureInData - energy.moistureOutData; 
      const  gasEnergy = energy.gasEnergy > 0?(energy.gasEnergy/28.26) * 293.3:0
      const totalEnergy = gasEnergy + energy.electricalEnergy;
  
      let too_wet = ((energy.moistureInData - energy.idealMoistureIn) * energy.materialfeed)/evaporatedMoist;
      too_wet = too_wet * energy.idealEnergy;
       let too_dry = (energy.materialfeed * (energy.moistureOutData - energy.idealMoistureOut))/evaporatedMoist;
      too_dry = too_dry * energy.idealEnergy;
      let actual_consumption = totalEnergy/energy.materialfeed;
      let scrap_energy_loss = actual_consumption * energy.materialScrap;
      let identified_loss = too_wet + too_dry + scrap_energy_loss; 
      let effective_energy_consumed = totalEnergy - identified_loss;
      let energy_efficiency = ((energy.idealEnergy * energy.materialfeed)/effective_energy_consumed) * 100;
      // console.log(energy_efficiency,"energy_efficiency",energy)
      return {totalEnergy: totalEnergy,electricalEnergy: energy.electricalEnergy,gasEnergy: gasEnergy,energy_efficiency: isNaN(energy_efficiency)?0:Math.round(energy_efficiency)}; 
    
  }catch(err){
    console.log('dryer energy calc err',err)
    return {totalEnergy: 0,electricalEnergy: 0,gasEnergy: 0,energy_efficiency: 0};
  }
  
}
const config = {
  DATE_ARR: _get_moment_for_dashboard,

  OEE_PROD_VALUE: get_prod_oee_value,

  RUN_FILE_API: _run_file_api,

  APP_URL: _get_app_url(),

  MQTT_URL: _get_mqtt_url(),

  API_URL: _get_api_url(),

  ENCODE_QUERY: _encode_query_qata,

  AUTH_URL: _get_AUTH_URL(),

  APP_STAGE: import.meta.env.VITE_STAGE,

  FETCH_REFRESH_TOKEN: _fetch_refresh_token,

  GRAPHQL_API_URL: _get_graphql_url(),

  RUN_REST_API: _run_rest_api,

  RUN_GQL_API: _run_gql_api,

  TIME_DIFF: _time_diff,

  TIME_DIFF_SHORT: _time_diff_short,

  GET_STYLE_VALUE: _get_style_value, 

  RENDER_DIVIDER: _render_divider,

  MODE: mode,

  FORMAT_TIME: formatTime,

  excutionDuration: executionBasedStartandEnd,

  calculateDryerOEE: calculateDryerOEE,
  
  MAT_EFFICIENCY: calculateMaterialEfficiency,

  ENREGY_EFFICIENCY: calculateEnergyEfficiency,
  shuffle_Colors:shuffleColors,
  LOGOTYPE:logotype,
   CMSURL: cmsUrl,
  CO2_tag : 0.85 ,

  

  GetAdminDashboard: gql`
  query GetAdminDashboard($line_id: uuid, $user_id: uuid) {
    neo_skeleton_dashboard {
      id
      custome_dashboard
      standard
      line_id
      name
      userByUpdatedBy {
        name
      }
    }
    neo_skeleton_user_default_dashboard(where: {user_id: {_eq: $user_id}, _and: {line_id: {_eq: $line_id}}}) {
      line_id
      dashboard {
        id
        dashboard
        layout
      }
    }
  }
  
  `,
  Addnewdashboard: gql`
  mutation Addnewdashboard($user_id: uuid, $custom: Boolean, $dashboard: jsonb, $line_id: uuid, $name: String, $layout: jsonb, $standard: Boolean) {
    insert_neo_skeleton_dashboard(objects: {created_by: $user_id, custome_dashboard: $custom, standard: $standard, dashboard: $dashboard, line_id: $line_id, name: $name, updated_by: $user_id, layout: $layout}) {
      affected_rows
      returning {
        id
        custome_dashboard
        standard
        line_id
        name
        userByUpdatedBy {
          id
          name
        }
        userByCreatedBy {
          id
          name
        }
      }
    }
  }
  `,
  UpdateDashboardName: gql`
    mutation UpdateDashboardName($name: String, $dash_id: uuid, $user_id: uuid, $custom: Boolean, $standard: Boolean ) {
      update_neo_skeleton_dashboard(where: {id: {_eq: $dash_id}}, _set: {name: $name, updated_by: $user_id, custome_dashboard: $custom, standard: $standard}) {
        affected_rows
        returning {
          id
          custome_dashboard
          standard
          line_id
          name
          userByUpdatedBy {
            id
            name
          }
          userByCreatedBy {
            id
            name
          }
        }
      }
    }
  
  `,
  UpdateDashboardDATA: gql`
    mutation UpdateDashboardDATA($dash_id: uuid, $dashboard: jsonb, $user_id: uuid) {
      update_neo_skeleton_dashboard(where: {id: {_eq: $dash_id}}, _set: {dashboard: $dashboard, updated_by: $user_id}) {
        affected_rows
        returning {
          id
          dashboard
        }
      }
    }
  `,

  DeleteUserdefaultdashboard: gql`
  mutation DeleteUserdefaultdashboard($dashboard_id: uuid) {
  delete_neo_skeleton_user_default_dashboard(where: {dashboard_id: {_eq: $dashboard_id}}){
    affected_rows
  }
}
  `,

  DeleteDashboard: gql`
  mutation Deletedashboard($dashboard_id: uuid) {
    delete_neo_skeleton_dashboard(where: {id: {_eq: $dashboard_id}, line_id: {_is_null: false}}) {
      affected_rows
    }
  }
  
  `,
  UpdateNotificationCheckpoint: gql`
  mutation UpdateNotificationCheckpoint($notification_checkpoint: timestamptz, $user_id: uuid) {
    insert_neo_skeleton_user_notification_one(object: {notification_checkpoint: $notification_checkpoint, user_id: $user_id}, on_conflict: {constraint: user_notification_pk, update_columns: notification_checkpoint}) {
    user_id
    notification_checkpoint
    clear_notification_checkpoint
    }
    }
  `,
  UpdateClearNotificationCheckpoint: gql`
  mutation UpdateClearNotificationCheckpoint($clear_notification_checkpoint: timestamptz, $user_id: uuid) {
    insert_neo_skeleton_user_notification_one(object: {clear_notification_checkpoint: $clear_notification_checkpoint, user_id: $user_id, notification_checkpoint: $clear_notification_checkpoint }, on_conflict: {constraint: user_notification_pk, update_columns: [clear_notification_checkpoint, notification_checkpoint]}) {
    user_id
    notification_checkpoint
    clear_notification_checkpoint
    }
    }
  `,
  UpdateDashboardLAYOUT: gql`
    mutation UpdateDashboardLAYOUT($dash_id: uuid, $layout: jsonb, $user_id: uuid) {
      update_neo_skeleton_dashboard(where: {id: {_eq: $dash_id}}, _set: {layout: $layout, updated_by: $user_id}) {
        affected_rows
        returning {
          id
          layout
        }
      }
    }
  `,
  makeNotificationRead: gql`
  mutation makeNotificationRead($user_id: uuid) {
    update_neo_skeleton_user_notification(where: {user_id: {_eq: $user_id}}, _set: {read_checkpoint: "now()"}) {
      affected_rows
    }
  }
`,

  Updateuserdashboard: gql`
    mutation Updateuserdashboard($dash_id: uuid, $dashboard: jsonb, $user_id: uuid) {
      update_neo_skeleton_dashboard(where: {id: {_eq: $dash_id}}, _set: {dashboard: $dashboard, updated_by: $user_id}) {
        affected_rows
        returning {
          id
          dashboard
        }
      }
    }
  `,
  Updateusercurrdashboard: gql`
  mutation Updateusercurrdashboard($user_id: uuid, $line_id: uuid, $dash_id: uuid) {
    insert_neo_skeleton_user_default_dashboard_one(object: {user_id: $user_id, line_id: $line_id, dashboard_id: $dash_id}, on_conflict: {constraint: user_default_dashboard_pk, update_columns: dashboard_id, where: {line_id: {_eq: $line_id}, user_id: {_eq: $user_id}}}) {
      dashboard {
        id
        name
        dashboard
        layout
      }
    }
  }
  `,

  GetUserRoleList: gql`
  query GetUserRoleList{
    neo_skeleton_roles(where: {_not: {id: {_eq: 1}}}) {
      id
      role
    }
  }
  `,
  GetAccessLinesList: gql`
  query GetAccessLinesList($user_id: uuid) {
    neo_skeleton_user_role_line(where: {user_id: {_eq: $user_id}}) {
      user_id
      role_id
      line_id
      created_ts
      updated_ts
      line { 
        name
        gaia_plants_detail {
          business_name
        }
      }
      role {
        role
      }
      userByCreatedBy {
        name
      }
    }
  }
  `,
  DeleteUserRoleLineAccess: gql`
  mutation DeleteUserRoleLineAccess($line_id: uuid, $role_id: Int, $user_id: uuid) {
    delete_neo_skeleton_user_role_line(where: {line_id: {_eq: $line_id}, _and: {role_id: {_eq: $role_id}, _and: {user_id: {_eq: $user_id}}}}) {
      affected_rows
    }
  }
  `,
  DeleteDefaultDashboard: gql`
  mutation DeleteDefaultDashboard($line_id: uuid, $user_id: uuid ) {
    delete_neo_skeleton_user_default_dashboard(where: {_and: {line_id: {_eq: $line_id}, user_id: {_eq: $user_id}}}) {
      affected_rows
    }
  }`,
  GetUsersListForLine: gql`
  query GetUsersListForLine($line_id: uuid, $disable: Boolean = false) {
    neo_skeleton_user_role_line(where: {line_id: {_eq: $line_id}, disable: {_eq: $disable}}, order_by: {userByUserId: {name: asc}}) {
      role_id
      user_id
      created_ts
      updated_ts
      role {
        id
        role
      }
      userByUserId {
        id
        name
      }
    }
  }
  
  `,
  EditUserLineAccess: gql`
  mutation EditUserLineAccess($user_id: uuid, $line_id: uuid, $role_id: Int) {
    update_neo_skeleton_user_role_line(where: {user_id: {_eq: $user_id}, _and: {line_id: {_eq: $line_id}}}, _set: {role_id: $role_id}) {
      affected_rows
    }
  }
  `,
  EditChannelLineAccess: gql`
  mutation EditChannelLineAccess($id: uuid, $updated_by: uuid, $type: uuid, $parameter: String,$name: String) {
    update_neo_skeleton_notification_channels(where: {id: {_eq: $id}}, _set: {name: $name, parameter: $parameter, type: $type, updated_by: $updated_by}) {
      affected_rows
    }
  }
  `,
  DeleteUserLineAccess: gql`
  mutation DeleteUserLineAccess($user_id: uuid, $line_id: uuid) {
    delete_neo_skeleton_user_role_line(where: {user_id: {_eq: $user_id}, _and: {line_id: {_eq: $line_id}}}) {
      affected_rows
    }
  }
  `,
  DeleteChanellLineAccess: gql`
  mutation DeleteChanellLineAccess($id: uuid, $line_id: uuid) {
    delete_neo_skeleton_notification_channels(where: {id: {_eq: $id}, _and: {line_id: {_eq: $line_id}}}) {
      affected_rows
    }
  }
  `,
  CreateUserRoleLineAccess: gql`
  mutation CreateUserRoleLineAccess($user_id: uuid, $role_id: Int, $line_id: uuid, $created_by: uuid) {
    insert_neo_skeleton_user_role_line_one(object: {user_id: $user_id, line_id: $line_id, role_id: $role_id, created_by: $created_by, updated_by: $created_by, disable: false}) {
      line_id
      role_id
      user_id
    }
  }
  `,
  CreateNewChannel: gql`
  mutation CreateNewChannel($type: uuid, $line_id: uuid,$name: String, $parameter: String, $created_by: uuid) {
    insert_neo_skeleton_notification_channels_one(object: {type: $type, name: $name, parameter: $parameter, line_id: $line_id, created_by: $created_by, updated_by: $created_by}) {
      id
      name
    }
  }
  `,
  CreateNewUser: gql`
  mutation CreateNewUser($name: String, $mobile: String, $sgid: String, $email: String, $created_by: uuid, $avatar: String) {
    insert_neo_skeleton_user_one(object: {name: $name, mobile: $mobile, sgid: $sgid, email: $email, disable: false, avatar: $avatar, created_by: $created_by, updated_by: $created_by}) {
      id
    }
  }
  `,
  SaveLineDetails: gql`
  mutation SaveLineDetails($location: String, $name: String, $line_id: uuid, $energy_asset: uuid, $dash_aggregation: String, $mic_stop_duration: numeric, $shift: jsonb) {
    update_neo_skeleton_lines(where: {id: {_eq: $line_id}}, _set: {name: $name, location: $location, energy_asset: $energy_asset, dash_aggregation: $dash_aggregation, mic_stop_duration: $mic_stop_duration, shift: $shift}) {
      affected_rows
      returning {
        name
        location
      }
    }
  }
  
  
  `,
  GetTableName: gql`
    query GetTableName($buildID: String) {
      ems_meta_data_ems_building_online_table_list(where: {building_id: {_eq: $buildID}}) {
        online_tbl
        row_id
        building_name
        backup_tbl
        building_id
      }
    }
  `,
  CheckAdmin: gql`
    query CheckAdmin($sgid: String) {
      ems_meta_data_ems_user_master(where: {sgid: {_eq: $sgid}, admin_flag: {_eq: "Y"}}) {
        sgid
      }
    }
  `,
  CreateNewHierarchy: gql`
  mutation CreateNewHierarchy($name: String, $hierarchy: jsonb, $line_id: uuid, $user_id: uuid) {
    insert_neo_skeleton_hierarchy_one(object: {name: $name, hierarchy: $hierarchy, line_id: $line_id, created_by: $user_id, updated_by: $user_id}) {
      id
    }
  }
  `,
  UpdateHierarchy: gql`
  mutation UpdateHierarchy($name: String, $hierarchy: jsonb, $line_id: uuid, $user_id: uuid, $hier_id: uuid) {
    update_neo_skeleton_hierarchy(where: {id: {_eq: $hier_id}, _and: {line_id: {_eq: $line_id}}}, _set: {name: $name, hierarchy: $hierarchy, updated_by: $user_id}) {
      affected_rows
    }
  }
  `,
  AddOrUpdateUserDefaultHierarchy: gql`
  mutation AddOrUpdateUserDefaultHierarchy($hier_id: uuid, $line_id: uuid, $user_id: uuid) {
    insert_neo_skeleton_user_line_default_hierarchy_one(object: {hierarchy_id: $hier_id, line_id: $line_id, user_id: $user_id, updated_by: $user_id, created_by: $user_id}, on_conflict: {constraint: user_line_default_hierarchy_user_id_line_id_primary_key, update_columns: hierarchy_id, where: {user_id: {_eq: $user_id}, _and: {line_id: {_eq: $line_id}}}}) {
      hierarchy_id
    }
  }  
  `,
  DeleteHierarchy: gql`
  mutation DeleteHierarchy($hier_id: uuid) {
    delete_neo_skeleton_hierarchy(where: {id: {_eq: $hier_id}}) {
      affected_rows
    }
  }
  `,
  GetUserLineHierarchy: gql`
  query GetUserLineHierarchy($user_id: uuid, $line_id: uuid) {
    neo_skeleton_user_line_default_hierarchy(where: {user_id: {_eq: $user_id}, _and: {line_id: {_eq: $line_id}}}) {
      updated_ts
      hierarchy {
        id
        line_id
        name
        hierarchy
        updated_ts
        userByUpdatedBy {
          name
        }
      }
    }
  }
  `,
  GetLineHierarchy: gql`
  query GetLineHierarchy($line_id: uuid) {
    neo_skeleton_hierarchy(where: {line_id: {_eq: $line_id}}, order_by: {created_ts: asc}) {
      id
      name
      line_id
      hierarchy
      updated_ts
      userByUpdatedBy {
        name
      }
    }
  }
  `,
  GetEntityList: gql`
  query GetEntityList($line_id: uuid) {
    neo_skeleton_entity(where: {line_id: {_eq: $line_id}}, order_by: {name: asc}) {
      id
      name
      entity_type
      created_ts
      entityTypeByEntityType {
        name
      }
      user {
        name
      }
    }
  }
  `,
  GetEntityType: gql`
  query GetEntityType {
    neo_skeleton_entity_types {
      id
      name
    }
  }
  `,
  AddNewEntity: gql`
  mutation AddNewEntity($user_id: uuid, $name: String, $line_id: uuid, $entity_type: Int) {
    insert_neo_skeleton_entity(objects: {line_id: $line_id, name: $name, entity_type: $entity_type, created_by: $user_id, updated_by: $user_id}) {
      affected_rows
      returning {
        id
      }
    }
  }
  `,
  EditAnEntity: gql`
  mutation EditAnEntity($entity_id: uuid, $entity_type: Int, $name: String, $user_id: uuid) {
    update_neo_skeleton_entity(where: {id: {_eq: $entity_id}}, _set: {name: $name, entity_type: $entity_type, updated_by: $user_id}) {
      affected_rows
      returning {
        id
        name
        entity_type
      }
    }
  }
  `,
  DeleteAnEntity: gql`
  mutation DeleteAnEntity($entity_id: uuid) {
    delete_neo_skeleton_entity(where: {id: {_eq: $entity_id}}) {
      affected_rows
    }
  }
  `,
  AddorUpdateOEEConfig: gql`
  mutation AddorUpdateOEEConfig($entity_id: uuid, $part_signal: bigint, $part_signal_instrument: String, $machine_status_signal_instrument: String, $machine_status_signal: bigint, $planned_downtime: numeric, $setup_time: numeric, $enable_setup_time: Boolean, $is_part_count_binary: Boolean, $above_oee_color: String, $above_oee_value: String, $below_oee_color: String, $below_oee_value: String, $between_oee_color: String,$mic_stop_duration: numeric,$is_status_signal_available: Boolean) {
    insert_neo_skeleton_prod_asset_oee_config_one(object: {entity_id: $entity_id, part_signal_instrument: $part_signal_instrument, part_signal: $part_signal, machine_status_signal: $machine_status_signal, machine_status_signal_instrument: $machine_status_signal_instrument, planned_downtime: $planned_downtime, setup_time: $setup_time, enable_setup_time: $enable_setup_time, is_part_count_binary: $is_part_count_binary, above_oee_color: $above_oee_color, above_oee_value: $above_oee_value, below_oee_color: $below_oee_color, below_oee_value: $below_oee_value, between_oee_color: $between_oee_color,mic_stop_duration: $mic_stop_duration,is_status_signal_available: $is_status_signal_available}, on_conflict: {constraint: prod_asset_oee_config_un, update_columns: [part_signal_instrument, part_signal, machine_status_signal_instrument, machine_status_signal, planned_downtime, setup_time, enable_setup_time, is_part_count_binary,mic_stop_duration,is_status_signal_available]}) {
      id
    }
  }
  `,
  createForm: gql`
  mutation createForm($user_id: uuid, $frequency: String, $incoming_web_hook: Boolean, $line_id: uuid, $name: String, $subtitle: String, $time_resolution: String, $observation: Boolean,$image: Boolean,$image_set: Boolean,$custome_form: Boolean) {
    insert_neo_skeleton_forms(objects: {incoming_web_hook: $incoming_web_hook, frequency: $frequency, line_id: $line_id, subtitle: $subtitle, time_resolution: $time_resolution, updated_by: $user_id, created_by: $user_id, name: $name, observation: $observation,image: $image,image_set: $image_set,custome_form: $custome_form}) {
      affected_rows
      returning {
        id
      }
    }
  }`,
  createFormWithSingleMetrics: gql`
  mutation CreateFormWithFirstMetric($user_id: uuid, $entity: uuid, $mandatory: Boolean, $metric_name: String, $metric_unit: String,$field_type: String, $frequency: String, $incoming_web_hook: Boolean = false, $line_id: uuid, $name: String, $subtitle: String, $time_resolution: String, $observation: Boolean,$image: Boolean,$image_set: Boolean,$custome_form: Boolean) {
    insert_neo_skeleton_form_metrics(objects: {metric_name: $metric_name, mandatory: $mandatory, updated_by: $user_id, metric_unit: $metric_unit,field_type: $field_type, entity: $entity, created_by: $user_id, form: {data: {created_by: $user_id, frequency: $frequency, incoming_web_hook: $incoming_web_hook, line_id: $line_id, name: $name, subtitle: $subtitle, time_resolution: $time_resolution, updated_by: $user_id, observation: $observation,image: $image,image_set: $image_set,custome_form: $custome_form}}}) {
      affected_rows
      returning {
        form {
          id
        }
      }
    }
  }
  `,
  addMetrics: gql`
  mutation addMetrics($metric_unit: String, $metric_name: String, $mandatory: Boolean = false,$field_type: String, $form_id: String, $entity: uuid, $created_by: uuid) {
    insert_neo_skeleton_form_metrics(objects: {created_by: $created_by, updated_by: $created_by, entity: $entity, form_id: $form_id, mandatory: $mandatory, metric_name: $metric_name, metric_unit: $metric_unit,field_type: $field_type}) {
      affected_rows
    }
  }
  `,
  InsertorUpdateMultipleFormMetrics: gql`
  mutation InsertorUpdateMultipleFormMetrics($formMetrics: [neo_skeleton_form_metrics_insert_input!]!) {  insert_neo_skeleton_form_metrics(objects: $formMetrics, on_conflict: {constraint: form_metrics_pkey, update_columns: [form_id, entity, mandatory, metric_name, metric_unit,field_type, updated_by]}) {
    affected_rows
    returning {
      id
    }
  }
  }
  `,
  addUserAccess: gql`
  mutation addUserAccess($created_by: uuid , $forms_id: String , $user_id: uuid) {
    insert_neo_skeleton_forms_user_access(objects: {created_by: $created_by, forms_id: $forms_id, user_id: $user_id}) {
      affected_rows
    }
  }
  `,
  addUsersListArr: gql`
  mutation addUsersListArr($userAccessList: [neo_skeleton_forms_user_access_insert_input!]!) {
    insert_neo_skeleton_forms_user_access(objects: $userAccessList) {
      affected_rows
    }
  }
  `,
  editFormVal: gql`
  mutation editFormVal($frequency: String, $incoming_web_hook: Boolean, $observation: Boolean, $image: Boolean,$image_set: Boolean, $name: String, $subtitle: String, $time_resolution: String, $updated_by: uuid, $id: String, $custome_form: Boolean) {
    update_neo_skeleton_forms(where: {id: {_eq: $id}}, _set: {frequency: $frequency, incoming_web_hook: $incoming_web_hook, name: $name, subtitle: $subtitle, observation: $observation, image: $image,image_set: $image_set, time_resolution: $time_resolution, updated_by: $updated_by, custome_form: $custome_form}) {
      affected_rows
    }
  }
  `,
  editMetrics: gql`
  mutation editMetrics($entity: uuid, $id: Int, $mandatory: Boolean, $metric_name: String,$field_type: String, $metric_unit: String, $updated_by: uuid) {
    update_neo_skeleton_form_metrics(where: {id: {_eq: $id}},_set: {entity: $entity, id: $id, mandatory: $mandatory, metric_name: $metric_name, metric_unit: $metric_unit,field_type: $field_type, updated_by: $updated_by}) {
      affected_rows
    }
  }
  `,

  Deleteformfromformmetrics: gql`
  mutation Deleteformfromformmetrics($form_id: String) {
    delete_neo_skeleton_form_metrics(where: {form_id: {_eq: $form_id}}) {
      affected_rows
    }
  }
  `,
  Deleteformuseraccess: gql`
  mutation Deleteformuseraccess($form_id: String) {
    delete_neo_skeleton_forms_user_access(where: {form: {id: {_eq: $form_id}}}){
      affected_rows
    }
  }
  `,
  Deleteform: gql`
  mutation Deleteform($form_id: String) {
    delete_neo_skeleton_forms(where: {id: {_eq: $form_id}}) {
      affected_rows
    }
  }
  `,



  getGaiaDetails: gql`
  query getGaiaDetails {
    neo_skeleton_gaia_plants_details {
      activity_name
      business_name
      country_name
      gaia_plant_name
      gaia_plant_code
    }
  }
  `,
  getRoles: gql`
  query getRoles {
    neo_skeleton_roles {
      id
      role
    }
  }
  `,
  getAccessReqHistory: gql`
  query getAccessReqHistory($user_id: uuid) {
    neo_skeleton_user_request_access(where: {created_by: {_eq: $user_id}}, order_by: {created_ts: desc}) {
      id
      approve
      reject
      reject_reason
      updated_ts
      line {
        name
        gaia_plants_detail {
          activity_name
          business_name
          country_name
        }
      }
      created_ts
    }
  }
  `,
  getAccessList: gql`
  query getAccessList($user_id: uuid) {
    neo_skeleton_user_request_access(where: {created_by: {_eq: $user_id}, approve: {_eq: true}}) {
      activity
      business
      id
      approve
      location
      plant
      role_id
      updated_ts
      created_ts
      user {
        name
        created_ts
      }
      role {
        role
      }
    }
  }
  `,
  PendingReqList: gql`
  query getPendingReq($user_id: uuid ) {
    neo_skeleton_user_request_access(where: {created_by: {_neq: $user_id},  approve: {_eq: false}, reject: {_eq: false}}) {
      id
      approve
      reject
      reject_reason
      updated_ts
      user {
        id
        name
      }
      role {
        id
        role
      }
      line {
        name
        gaia_plants_detail {
          activity_name
          business_name
          country_name
        }
      }
    }
  } 
  `,
  deleteAccessRequest: gql`
  mutation deleteAccessRequest($id: bigint) {
    delete_neo_skeleton_user_request_access(where: {id: {_eq: $id}}) {
      affected_rows
      returning {
        id
      }
    }
  }
  
  `,
  getFormUsers: gql`
  query getFormUsers($form_id: String) {
    neo_skeleton_forms_user_access(where: {forms_id: {_eq: $form_id}}) {
      userByUserId {
        id
        name
      }
    }
  }  
  `,
  getMetricList: gql`
  query getMetricList($line_id: uuid, $form_id: String, $metric_name: String = "observation") {
    neo_skeleton_form_metrics(where: {form: {line_id: {_eq: $line_id}, id: {_eq: $form_id}}, metric_name: {_neq: $metric_name}}) {
      metric_name
      id
    }
  }`,
  getFormsList: gql`
  query getFormsList($line_id: uuid, $user_id: uuid) {
    neo_skeleton_forms(where: {line_id: {_eq: $line_id}, _and: {forms_user_access: {user_id: {_eq: $user_id}}}}) {
      name
      id
    }
  }
  `,
  getMetricValues: gql`
  query getMetricValues {
    neo_skeleton_forms(where: {id: {}}) {
      id
      name
      form_metrics {
        id
        metric_name
        metric_unit
        formInputsByFmid {
          value
        }
      }
    }
  }
  
  `,
  getParameterList: gql`
  query getParameterList {
    neo_skeleton_metrics {
      id
      name
      title
      type
      metricUnitByMetricUnit {
        id
        unit
      }
      metricDatatypeByMetricDatatype {
        id
        type
      }
      instruments_metrics {
        instruments_id
      }
    }
  }
  `,
  checkIfLineExists: gql`
  query checkIfLineExists($plant_id: String) {
    neo_skeleton_lines(where: {gaia_plant_id: {_eq: $plant_id}}) {
      id
      name
    }
  }
  `,
  checkUserAccessForLine: gql`
  query checkUserAccessForLine($line_id: uuid, $user_id: uuid) {
    neo_skeleton_user_role_line(where: {line_id: {_eq: $line_id}, user_id: {_eq: $user_id}}) {
      role_id
      user_id
      userByUserId {
        name
      }
    }
  }  
  `,
  submitAccessReq: gql`
  mutation submitAccessReq($created_by: uuid, $line_id: uuid, $reject: Boolean = false, $approve: Boolean = false, $role_id: bigint) {
    insert_neo_skeleton_user_request_access(objects: {created_by: $created_by, line_id: $line_id, reject: $reject, approve: $approve, role_id: $role_id}) {
      affected_rows
      returning {
        id
      }
    }
  }
  `,
  checkIfReqAlreadyRaised: gql`
  query checkIfReqAlreadyRaised($line_id: uuid, $user_id: uuid) {
    neo_skeleton_user_request_access(where: {line_id: {_eq: $line_id}, user: {id: {_eq: $user_id}}}) {
      approve
      reject
      reject_reason
      created_ts
    }
  }
  `,
  toReviewRequest: gql`
 mutation toReviewRequest($approve: Boolean, $reject: Boolean, $reviewed_ts: timestamptz, $user_id: uuid, $reject_reason: String, $id: bigint) {
  update_neo_skeleton_user_request_access(where: {id: {_eq: $id}}, _set: {approve: $approve, reject: $reject, reject_reason: $reject_reason, reviewed_by: $user_id, reviewed_ts: $reviewed_ts, updated_by: $user_id}) {
    affected_rows
    returning {
      id
      approve
      reject
      reject_reason
      reviewed_by
      reviewed_ts
      role_id
      line_id
      created_by
    }
  }
}
 `,
  createUserRoleLine: gql`
 mutation createUserRoleLine($user_id: uuid, $role_id: Int, $line_id: uuid, $updated_by: uuid) {
  insert_neo_skeleton_user_role_line(objects: {line_id: $line_id, role_id: $role_id, user_id: $user_id, updated_by: $updated_by, created_by: $updated_by, disable: false}) {
    affected_rows
    returning {
      line_id
      role_id
      user_id
    }
  }
}

 `,
  getInstrumentList: gql`
 query getInstrumentList($line_id: uuid) {
  neo_skeleton_instruments(where: {line_id: {_eq: $line_id}}, order_by: {name: asc}) {
    id
    instrument_type
    name
    instrumentTypeByInstrumentType {
      name
    }
  }
}
 `,
  insertReports: gql`
  mutation insertReports($name: String, $description: String, $custome_reports: Boolean = false, $metric_ids: _int4, $aggreation: String, $group_by: String, $created_by: uuid, $line_id: uuid, $hierarchy_id: uuid, $instument_ids: _varchar, $reports: jsonb = "{}", $entity_ids: _uuid, $startsat: timetz) {
    insert_neo_skeleton_reports(objects: {name: $name, description: $description, custome_reports: $custome_reports, metric_ids: $metric_ids, aggreation: $aggreation, group_by: $group_by, created_by: $created_by, line_id: $line_id, instument_ids: $instument_ids, reports: $reports, entity_ids: $entity_ids, hierarchy_id: $hierarchy_id, startsat: $startsat}) {
      affected_rows
      returning {
        id
      }
    }
  }
  
`,
  GetSavedReports: gql`
query getSavedReports($line_id: uuid) {
  neo_skeleton_reports(where: {line_id: {_eq: $line_id}}) {
    id
    name
    description
    custome_reports
    aggreation
    metric_ids
    entity_ids
    instument_ids
    group_by
    hierarchy_id  
    startsat  
    userByUpdatedBy {
      name
      id
    }
    created_by
  }
}
`,
  updateReport: gql`
  mutation updateReport($id: uuid, $aggreation: String, $custome_reports: Boolean = false, $description: String, $entity_ids: _uuid, $group_by: String, $instument_ids: _varchar, $metric_ids: _int4, $name: String, $updated_by: uuid, $hierarchy_id: uuid, $startsat: timetz) {
    update_neo_skeleton_reports(where: {id: {_eq: $id}}, _set: {aggreation: $aggreation, custome_reports: $custome_reports, description: $description, entity_ids: $entity_ids, group_by: $group_by, instument_ids: $instument_ids, metric_ids: $metric_ids, name: $name, updated_by: $updated_by, hierarchy_id: $hierarchy_id, startsat: $startsat}) {
      affected_rows
      returning {
        id
      }
    }
  }
  
`,
  getMetricsForInstrument: gql`
query getMetricsForInstrument($id: [String!], $distinct_on: [neo_skeleton_instruments_metrics_select_column!] = metrics_id) {
  neo_skeleton_instruments_metrics(where: {instruments_id: {_in: $id}}, distinct_on: $distinct_on) {
    metric {
      id
      name
      title
      type
      metricUnitByMetricUnit {
        unit
      }
    }
  }
}
`,
  getMetricsForInstrumentWithID: gql`
query getMetricsForInstrumentWithID($id: [String!]) {
  neo_skeleton_instruments_metrics(where: {instruments_id: {_in: $id}}) {
    instruments_id
    metric {
      id
      name
      title
      metricUnitByMetricUnit {
        unit
      }
    }
    instrument {
      category
    }
  }
}
`,
  deleteReport: gql`
mutation deleteReport($id: uuid, $status: Int) {
  delete_neo_skeleton_report_generation(where: {report_id: {_eq: $id}, status: {_eq: $status}}) {
    affected_rows
  }
     delete_neo_skeleton_reports_star_fav(where: {report_id: {_eq: $id}}) {
    affected_rows
  }
  delete_neo_skeleton_reports(where: {id: {_eq: $id}}) {
    affected_rows
  }
   
}
`,
  deleteReportGeneration: gql`
mutation deleteReportGeneration($id: uuid ) {
  delete_neo_skeleton_report_generation(where: {report_id: {_eq: $id}}) {
    affected_rows
  }
}
`,
  getHierarchy: gql`
query getHierarchy($id: uuid) {
  neo_skeleton_hierarchy(where: {id: {_eq: $id}}) {
    hierarchy
  }
}
`,
  deleteUserFormAccess: gql`
mutation deleteUserFormAccess($form_id: String, $user_id: uuid) {
  delete_neo_skeleton_forms_user_access(where: {forms_id: {_eq: $form_id}, _and: {user_id: {_eq: $user_id}}}) {
    affected_rows
  }
}
`,
  getInstrumentFormula: gql`
query GetVirtualInstrument($line_id: uuid) {
  neo_skeleton_virtual_instruments(where: {line_id: {_eq: $line_id}}) {
  id
  name
  line_id
  formula
  }
}
`,
  addInstrumentFormula: gql`
  mutation AddNewVirtualInstrument($name: String, $line_id: uuid, $formula: String) {
    insert_neo_skeleton_virtual_instruments_one(object: {line_id: $line_id, name: $name, formula: $formula}, on_conflict: {constraint: virtual_instruments_pkey, update_columns: formula}) {
    id
    }
}
`,
  editInstrumentFormula: gql`
mutation EditVirtualInstrument($name: String, $line_id: uuid, $formula: String, $for_id: uuid) {
  update_neo_skeleton_virtual_instruments(where: {id: {_eq: $for_id}, _and: {line_id: {_eq: $line_id}}}, _set: {formula: $formula, name: $name}) {
  affected_rows
  }
}
`,
  deleteInstrumentFormula: gql`
mutation DeleteVirtualInstrument($for_id: uuid) {
  delete_neo_skeleton_virtual_instruments(where: {id: {_eq: $for_id}}) {
  affected_rows
  }
}
`,
  getRealInstrumentList: gql`
query getRealIntrumentsList($line_id: uuid) {
  neo_skeleton_instruments(where: {line_id: {_eq: $line_id}}) {
    id
    name
    instrument_type
    gateway {
      id
      name
    }
    instrument_category {
      id
      name
    }
    instrumentTypeByInstrumentType {
      id
      name
    }
    userByUpdatedBy {
      id
      name
    }
    instruments_metrics {
      metric {
        id
        name
        title
      }
    }
  }
}
`,
  getUserFormMetricsIDs: gql`
query getUserFormMetricsIDs($user_id: uuid, $line_id: uuid) {
  neo_skeleton_forms_user_access(where: {user_id: {_eq: $user_id}, form: {line_id: {_eq: $line_id}}}) {
    form {
      form_metrics {
        id
      }
    }
  }
}`,
  getInstrumentCategory: gql`
query getInstrumentCategory {
  neo_skeleton_instrument_category {
    id
    name
  }
}
`,
  getInstrumentType: gql`
query getInstrumentType {
  neo_skeleton_instrument_types {
    id
    name
  }
}
`,
  AddInstrumentWithID: gql`
mutation AddInstrument($id: String, $category: Int, $line_id: uuid, $name: String, $user_id: uuid, $instrument_type: Int) {
  insert_neo_skeleton_instruments_one(object: {category: $category, id: $id, line_id: $line_id, name: $name, updated_by: $user_id, instrument_type: $instrument_type, created_by: $user_id, ignore: false}, on_conflict: {constraint: instruments_pkey, update_columns: [category, name, line_id, instrument_type]}) {
  id
  }
  }
`,
  AddInstrumentWithoutID: gql`
mutation AddInstrument($category: Int, $line_id: uuid, $name: String, $user_id: uuid, $instrument_type: Int) {
  insert_neo_skeleton_instruments_one(object: {category: $category line_id: $line_id, name: $name, updated_by: $user_id, instrument_type: $instrument_type, created_by: $user_id, ignore: false}, on_conflict: {constraint: instruments_pkey, update_columns: [category, name, line_id, instrument_type]}) {
  id
  }
}
`,
  UpdateInstrument: gql`
mutation UpdateInstrument($id: String, $line_id: uuid, $category: Int, $instrument_type: Int, $name: String, $updated_by: uuid) {
  update_neo_skeleton_instruments(where: {id: {_eq: $id}, _and: {line_id: {_eq: $line_id}}}, _set: {name: $name, instrument_type: $instrument_type, category: $category, updated_by: $updated_by}) {
    affected_rows    
  }
}
`,
  DeleteInstrument: gql`
mutation DeleteInstrument($id: String, $line_id: uuid) {
  delete_neo_skeleton_instruments(where: {id: {_eq: $id}, _and: {line_id: {_eq: $line_id}}}) {
    affected_rows
  }
}
`,
  addNewReasonType: gql`
mutation addNewReasonType($reason_type: String = "", $created_by: uuid = "") {
  insert_neo_skeleton_prod_reason_types(objects: {reason_type: $reason_type, created_by: $created_by, created_ts: "now()"}) {
    affected_rows
  }
}
`,
  addInstrumentMetrics: gql`
mutation addInstrumentMetrics($formMetrics: [neo_skeleton_instruments_metrics_insert_input!]!) {
  insert_neo_skeleton_instruments_metrics(objects: $formMetrics) {
    affected_rows
    returning {
      metrics_id
      id
      enable_forecast
      instruments_id
    }
  }
}
`,
  getTasksTypes: gql`
query getTaskTypes {
  neo_skeleton_task_types(order_by: {task_type: asc}) {
    id
    task_type
  }
}
`,
  getTaskPriorities: gql`
query getTaskPriorities {
  neo_skeleton_task_priority(order_by: {task_level: asc}) {
    id
    task_level
  }
}
`,
  getTaskStatus: gql`
query getTaskStatus {
  neo_skeleton_task_status(order_by: {status: asc}) {
    id
    status
  }
}
`,
  getUsersList: gql`
  query GetUsersList {
    neo_skeleton_user(order_by: {name: asc}) {
      id
      name
      sgid
      email
      mobile
    }
  }
`,
  addTask: gql`
  mutation AddTask($title: String, $type: Int, $priority: Int, $status: Int, $entity_id: uuid, $assingee: uuid, $description: String, $due_date: timestamptz, $created_by: uuid, $updated_by: uuid,$action_taken: uuid,$action_recommended: String,$comments: String , $action_taken_date : timestamptz, $observed_date: timestamptz, $observed_by: uuid, $reported_by: uuid, $analysis_type: Int ) {
    insert_neo_skeleton_tasks_one(object: {title: $title, type: $type, priority: $priority, status: $status, entity_id: $entity_id, assingee: $assingee, description: $description, due_date: $due_date, created_by: $created_by, updated_by: $updated_by,action_taken: $action_taken,action_recommended: $action_recommended,comments: $comments,action_taken_date : $action_taken_date,observed_date:$observed_date,observed_by:$observed_by,reported_by:$reported_by,analysis_type_id:$analysis_type}) {
      id
    }
  }
`,
  taskList: gql`
  query taskList {
    neo_skeleton_tasks {
      id
      entity_id
      priority
      status
      title
      type
      assingee
      created_by
      due_date
      description
      created_ts
      updated_by
      updated_ts
      observed_date
      taskStatus {
        id
        status
      }
      taskType {
        id
        task_type
      }
      taskPriority {
        id
        task_level
      }
      entityId {
        id
        name
      }
      userByAssignedFor {
        id
        name
      }
      userByObservedBy {
        id
        name
      }
      userByReportedBy {
        id
        name
      }
    }
  }
`,
  deleteTask: gql`
  mutation deleteTask($taskid: uuid) {
    delete_neo_skeleton_tasks(where: {id: {_eq: $taskid}}) {
      affected_rows
    }
  }
`,
  updateTask: gql`
  mutation updateTask($taskid: uuid,$title: String, $type: Int, $priority: Int, $status: Int, $entity_id: uuid, $assingee: uuid, $description: String, $due_date: timestamptz, $updated_by: uuid,$action_taken: uuid,$action_recommended: String,$comments: String,$action_taken_date: timestamptz,$observed_date: timestamptz, $observed_by: uuid, $reported_by: uuid, $analysis_type: Int) {
    update_neo_skeleton_tasks(where: {id: {_eq: $taskid}}, _set: {title: $title, type: $type, priority: $priority, status: $status, entity_id: $entity_id, assingee: $assingee, description: $description, due_date: $due_date, updated_by: $updated_by,action_taken: $action_taken,action_recommended: $action_recommended,comments: $comments,action_taken_date:$action_taken_date,observed_date:$observed_date,observed_by:$observed_by,reported_by:$reported_by,analysis_type_id:$analysis_type}) {
      affected_rows
    }
  }
`,
  getAssetInfo: gql`
query getAssetInfo($entity_id: uuid) {
  neo_skeleton_entity_info(where: {entity_id: {_eq: $entity_id}}) {
    info
    entity_id
  }
}
`,
  addTaskType: gql`
mutation addTaskType($task_type: String) {
  insert_neo_skeleton_task_types_one(object: {task_type: $task_type}) {
    id
  }
}
`,
  editTaskType: gql`
mutation editTaskType($type_id: Int, $task_type: String) {
  update_neo_skeleton_task_types(where: {id: {_eq: $type_id}}, _set: {task_type: $task_type}) {
    affected_rows
  }
}
`,
  addTaskPriority: gql`
mutation addTaskPriority($task_level: String) {
  insert_neo_skeleton_task_priority_one(object: {task_level: $task_level}) {
    id
  }
}
`,
  addMetricUnit: gql`
mutation addMetricUnit($unit: String, $description: String) {
  insert_neo_skeleton_metric_unit_one(object: {description: $description, unit: $unit}) {
    id
  }
}
`,
  addMetric: gql`
mutation addMetric($metric_datatype: Int, $metric_unit: Int, $name: String, $title: String, $type: Int , $instrument_type : bigint) {
  insert_neo_skeleton_metrics_one(object: {metric_datatype: $metric_datatype, metric_unit: $metric_unit, name: $name, title: $title, type: $type , instrument_type : $instrument_type}) {
    id
  }
}
`,
  addTaskStatus: gql`
mutation addTaskStatus($status: String) {
  insert_neo_skeleton_task_status_one(object: {status: $status}) {
    id
  }
}
`,
  addProduct: gql`
mutation addProduct($product_id: String, $name: String, $line_id: uuid, $unit: String, $user_id: uuid, $info: jsonb) {
  insert_neo_skeleton_prod_products_one(object: {product_id: $product_id, name: $name, line_id: $line_id, unit: $unit, updated_by: $user_id, info: $info, created_by: $user_id}) {
    id
  }
}
`,
  editProduct: gql`
mutation editProduct($id: uuid, $product_id: String, $name: String, $unit: String, $user_id: uuid, $info: jsonb) {
  update_neo_skeleton_prod_products(where: {id: {_eq: $id}}, _set: {product_id: $product_id, name: $name, unit: $unit, updated_by: $user_id, info: $info}) {
    affected_rows
  }
}
`,
  deleteProduct: gql`
mutation deleteProduct($id: uuid) {
  delete_neo_skeleton_prod_products(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`,
  addOrder: gql`
mutation addOrder($order_id: String, $line_id: uuid, $start_dt: timestamptz, $end_dt: timestamptz, $qty: String $product_id: uuid, $user_id: uuid) {
  insert_neo_skeleton_prod_order_one(object: {order_id: $order_id, start_dt: $start_dt, end_dt: $end_dt, qty: $qty, product_id: $product_id, updated_by: $user_id, created_by: $user_id, line_id: $line_id}) {
    id
  }
}
`,
  editOrder: gql`
mutation editOrder($order_id: String, $start_dt: timestamptz, $end_dt: timestamptz, $qty: String, $product_id: uuid, $user_id: uuid, $id: uuid) {
  update_neo_skeleton_prod_order(where: {id: {_eq: $id}}, _set: {order_id: $order_id, start_dt: $start_dt, end_dt: $end_dt, qty: $qty, product_id: $product_id, updated_by: $user_id}) {
    affected_rows
  }
}
`,
  deleteOrder: gql`
mutation deleteOrder($id: uuid) {
  delete_neo_skeleton_prod_order(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`,
  addWorkInitiations: gql`
mutation addWorkExec($order_id: uuid, $line_id: uuid, $start_dt: timestamptz, $end_dt: timestamptz, $operator_id: uuid $entity_id: uuid, $user_id: uuid) {
  insert_neo_skeleton_prod_exec_one(object: {order_id: $order_id, start_dt: $start_dt, end_dt: $end_dt, operator_id: $operator_id, entity_id: $entity_id, updated_by: $user_id, created_by: $user_id, line_id: $line_id}) {
    id
  }
}
`,
  editWorkInitiations: gql`
mutation editWorkExec($order_id: uuid, $start_dt: timestamptz, $end_dt: timestamptz, $operator_id: uuid $entity_id: uuid, $user_id: uuid, $id: uuid) {
  update_neo_skeleton_prod_exec(where: {id: {_eq: $id}}, _set: {order_id: $order_id, start_dt: $start_dt, end_dt: $end_dt, operator_id: $operator_id, entity_id: $entity_id, updated_by: $user_id}) {
    affected_rows
  }
}
`,
  updateWOExecution: gql`
mutation updateWOExecution( $end_dt: timestamptz, $id: uuid) {
  update_neo_skeleton_prod_exec(where: {id: {_eq: $id}}, _set: {end_dt: $end_dt}) {
    affected_rows
  }
}
`,
  deleteWorkInitiations: gql`
mutation deleteWorkExec($id: uuid) {
  delete_neo_skeleton_prod_exec(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`,
  addReasons: gql`
  mutation addReason($reason: String, $type_id: bigint, $user_id: uuid, $line_id: uuid, $include_in_oee: Boolean) {
    insert_neo_skeleton_prod_reasons_one(object: {reason: $reason, reason_type_id: $type_id, created_by: $user_id, updated_by: $user_id, line_id: $line_id, include_in_oee: $include_in_oee}) {
      id
    }
  }
`,
  editReasons: gql`
  mutation editReason($reason: String, $type_id: bigint, $user_id: uuid, $id: bigint, $include_in_oee: Boolean) {
    update_neo_skeleton_prod_reasons(where: {id: {_eq: $id}}, _set: {reason: $reason, reason_type_id: $type_id, updated_by: $user_id, include_in_oee: $include_in_oee}) {
      affected_rows
    }
  }
`,
  deleteReasons: gql`
mutation deleteReason($id: bigint) {
  delete_neo_skeleton_prod_reasons(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`,
  deleteDowntime: gql`
mutation deleteDowntime($id: bigint = "") {
  delete_neo_skeleton_prod_outage(where: {reason_id: {_eq: $id}}) {
    affected_rows
  }
}
`,
  deleteProQtyDefact: gql`
mutation deleteProQtyDefact($_eq: bigint = "") {
  delete_neo_skeleton_prod_quality_defects(where: {reason_id: {_eq: $_eq}}) {
    affected_rows
  }
}

`,

  addReasonType: gql`
mutation addReasonType($reason_type: String, $user_id: uuid, $line_id: uuid) {
  insert_neo_skeleton_prod_reason_types_one(object: {reason_type: $reason_type, created_by: $user_id, updated_by: $user_id, line_id: $line_id}) {
    id
  }
}
`,
  editReasonType: gql`
mutation editReasonType($reason_type: String, $user_id: uuid, $id: bigint) {
  update_neo_skeleton_prod_reason_types(where: {id: {_eq: $id}}, _set: {reason_type: $reason_type, updated_by: $user_id}) {
    affected_rows
  }
}
`,
  deleteReasonType: gql`
mutation deleteReasonType($id: bigint) {
  delete_neo_skeleton_prod_reason_types(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`,
  addQualityDefects: gql`
mutation addQualityDefects($order_id: uuid, $entity_id: uuid, $reason_id: bigint, $quantity: String, $user_id: uuid,$comments: String,$time: timestamptz,$line_id: uuid) {
  insert_neo_skeleton_prod_quality_defects_one(object: {order_id: $order_id, entity_id: $entity_id, quantity: $quantity, reason_id: $reason_id, created_by: $user_id, updated_by: $user_id,comments: $comments,marked_at:$time,line_id: $line_id,}) {
    id
  }
}

`,
  addQualityDefectsWithoutOrderID: gql`
  mutation addQualityDefectsWithoutOrderID($entity_id: uuid, $reason_id: bigint, $quantity: String, $user_id: uuid, $comments: String, $time: timestamptz, $line_id: uuid,$part_number: String) {
    insert_neo_skeleton_prod_quality_defects_one(object: {line_id: $line_id, entity_id: $entity_id, quantity: $quantity, reason_id: $reason_id, created_by: $user_id, updated_by: $user_id, comments: $comments, marked_at: $time,part_number: $part_number}, on_conflict: {constraint: prod_quality_defects_pk, update_columns: []}) {
      id
    }
  }

`,
  addPartComments: gql`
  mutation add_part_comments($asset_id: uuid, $comments: String, $param_comments: jsonb, $part_completed_time: timestamptz, $user_id: uuid, $line_id: uuid) {
    insert_neo_skeleton_prod_part_comments_one(object: {asset_id: $asset_id, comments: $comments, param_comments: $param_comments, created_by: $user_id, updated_by: $user_id, part_completed_time: $part_completed_time, line_id: $line_id}) {
      id
    }
  }
  
`,
  editQualityDefects: gql`
mutation editQualityDefects($id: uuid, $order_id: uuid, $entity_id: uuid, $reason_id: bigint, $quantity: String, $user_id: uuid) {
  update_neo_skeleton_prod_quality_defects(where: {id: {_eq: $id}}, _set: {order_id: $order_id, entity_id: $entity_id, quantity: $quantity, reason_id: $reason_id, updated_by: $user_id}) {
    affected_rows
  }
}
`,
  deleteQualityDefects: gql`
mutation deleteReasonType($id: uuid) {
  delete_neo_skeleton_prod_quality_defects(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`,
  addOutages: gql`
mutation addOutages($order_id: uuid, $start_dt: timestamptz, $end_dt: timestamptz, $entity_id: uuid, $reason_id: bigint,$comments: String, $user_id: uuid, $line_id: uuid) {
  insert_neo_skeleton_prod_outage_one(object: {order_id: $order_id, start_dt: $start_dt, end_dt: $end_dt, entity_id: $entity_id, reason_id: $reason_id,comments: $comments, created_by: $user_id, updated_by: $user_id, line_id: $line_id}) {
    id
  }
}`,
  addOutageWithoutOrderID: gql`
mutation addOutages($start_dt: timestamptz, $end_dt: timestamptz, $entity_id: uuid, $reason_id: bigint,$comments: String, $user_id: uuid, $line_id: uuid, $reason_tags: _uuid) {
insert_neo_skeleton_prod_outage_one(object: {start_dt: $start_dt, end_dt: $end_dt, entity_id: $entity_id, reason_id: $reason_id,comments: $comments, created_by: $user_id, updated_by: $user_id, line_id: $line_id, reason_tags: $reason_tags}) {
  id
}
}
`,
  editOutages: gql`
mutation editOutages($id: uuid, $order_id: uuid, $start_dt: timestamptz, $end_dt: timestamptz, $entity_id: uuid, $reason_id: bigint, $user_id: uuid) {
  update_neo_skeleton_prod_outage(where: {id: {_eq: $id}}, _set: {order_id: $order_id, start_dt: $start_dt, end_dt: $end_dt, entity_id: $entity_id, reason_id: $reason_id, updated_by: $user_id}) {
    affected_rows
  }
}
`,
  deleteOutages: gql`
mutation deleteOutages($id: uuid) {
  delete_neo_skeleton_prod_outage(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`,
  deleteInstrumentMetricswithoutMetric: gql`
mutation deleteInstrumentMetricswithoutMetric($instrumentid: String  ) {
  delete_neo_skeleton_instruments_metrics(where: {instruments_id: {_eq: $instrumentid}}) {
    affected_rows
  }
}
`,
  deleteInstrumentMetrics: gql`
  mutation deleteInstrumentMetrics($instruments_id: String , $metrics_id: [bigint!] ) {
    delete_neo_skeleton_instruments_metrics(where: {instruments_id: {_eq: $instruments_id}, metrics_id: {_in: $metrics_id}}) {
      affected_rows
    }
  }
`,
  delAlertsV2: gql`
mutation delete_neo_skeleton_alerts_v2( $insrument_metrics_id: [Int!] ) {
  delete_neo_skeleton_alerts_v2(where: {insrument_metrics_id: {_in: $insrument_metrics_id}}) {
    affected_rows
  }
}
`,
  deleteInstrumentMetricsbyinstrumentId: gql`
mutation deleteInstrumentMetricsbyinstrumentId($instruments_id: String = "", $metrics_id: [bigint!] = "") {
  delete_neo_skeleton_instruments_metrics(where: {instruments_id: {_eq: $instruments_id}, metrics_id: {_in: $metrics_id}}) {
    affected_rows
  }
}
`,
  addUsersRating: gql`
  mutation addUsersRating($description: String, $rating: Int, $user_id: uuid) {
    insert_neo_skeleton_users_rating_one(object: {user_id: $user_id, rating: $rating, description: $description}) {
      user_id
    }
  }
`,
  addUserHistory: gql`
  mutation addUserHistory($user_id: uuid, $info: json) {
    insert_neo_skeleton_user_access_history(objects: {user_id: $user_id, info: $info}) {
      affected_rows
    }
  }
`,
  alertAggregateFunction: gql`
query alertAggregateFunction {
  neo_skeleton_alert_check_aggregate_functions {
    aggregate_function
  }
}
`,
  alertList: gql`
  query MyQuery($_eq: uuid) {
    neo_skeleton_alerts(where: {id: {_eq: $_eq}}) {
     check_aggregate_window_function
      check_aggregate_window_time_range
      check_id
      check_start_time
      check_time
      check_time_offset
      critical_max_value
      critical_min_value
      critical_type
      critical_value
      delivery
      id
      instruments_metric {
        metric {
          name
          title
        }
        instrument {
          id
          name
        }
      }
      insrument_metrics_id
      name
      warn_max_value
      warn_min_value
      warn_type
      warn_value
      status
      userByUpdatedBy {
        name
      }
    }
  }
`,
  updateAlarmNameAndDelivery: gql`
mutation updateAlarmNameAndDelivery($alert_id: uuid, $name: String, $delivery: json ,$alert_channels: _text ,$alert_users: json, $check_aggregate_window_function: String, $check_aggregate_window_time_range: String, $insrument_metrics_id: Int = 10, $critical_type: String, $critical_value: String, $warn_type: String, $warn_value: String, $critical_max_value: String, $critical_min_value: String, $warn_max_value: String, $warn_min_value: String, $updated_by: uuid, $check_last_n: Int, $check_type: String, $message: String, $is_prod_id_available: Boolean, $product_id: uuid) {
  update_neo_skeleton_alerts_v2(where: {id: {_eq: $alert_id}}, _set: {name: $name, delivery: $delivery, alert_channels: $alert_channels, alert_users: $alert_users, check_aggregate_window_function: $check_aggregate_window_function, check_aggregate_window_time_range: $check_aggregate_window_time_range, insrument_metrics_id: $insrument_metrics_id, critical_type: $critical_type, critical_value: $critical_value, warn_type: $warn_type, warn_value: $warn_value, critical_max_value: $critical_max_value, critical_min_value: $critical_min_value, warn_max_value: $warn_max_value, warn_min_value: $warn_min_value, updated_by: $updated_by, check_last_n: $check_last_n, check_type: $check_type, message: $message, is_prod_id_available: $is_prod_id_available, product_id: $product_id}) {
    affected_rows
    returning {
      id
    }
  }
}
`,
  createAlarmNameAndDelivery: gql`
mutation createAlarmNameAndDelivery($alert_channels: _text , $alert_users: json, $delivery: json , $check_aggregate_window_function: String , $check_aggregate_window_time_range: String , $check_time: String , $check_time_offset: String , $check_start_time: String , $line_id: uuid , $insrument_metrics_id: Int , $critical_type: String , $critical_value: String, $warn_type: String, $warn_value: String,$critical_max_value: String, $critical_min_value: String, $warn_max_value: String, $warn_min_value: String, $name: String, $status: String, $updated_by: uuid , $created_by: uuid, $check_last_n: Int, $check_type: String, $message: String, $is_prod_id_available: Boolean, $product_id: uuid) {
  insert_neo_skeleton_alerts_v2(objects: {alert_channels: $alert_channels, alert_users: $alert_users, delivery: $delivery, check_aggregate_window_time_range: $check_aggregate_window_time_range, check_aggregate_window_function: $check_aggregate_window_function, check_time: $check_time, check_time_offset: $check_time_offset, check_start_time: $check_start_time, line_id: $line_id, insrument_metrics_id: $insrument_metrics_id, critical_type: $critical_type, critical_value: $critical_value, warn_type: $warn_type, warn_value: $warn_value, critical_max_value: $critical_max_value, critical_min_value: $critical_min_value, warn_max_value: $warn_max_value, warn_min_value: $warn_min_value, name: $name, status: $status, updated_by: $updated_by, created_by: $created_by, check_last_n: $check_last_n, check_type: $check_type, message: $message, is_prod_id_available: $is_prod_id_available, product_id: $product_id}) {
    affected_rows
    returning {
      id
    }
  }
}
`,
  deleteAlarmRule: gql`
mutation deleteAlarmRule($id: uuid) {
  delete_neo_skeleton_alerts_v2(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`,
  deleteDefects: gql`
mutation deleteDefects($defect_id: uuid) {
  update_neo_skeleton_prod_quality_defects(where: {id: {_eq: $defect_id}}, _set: {isdelete: true}) {
    affected_rows
  }
}
`,
  updateReason: gql`
  mutation updateReason($reason_id: bigint, $outage_id: uuid, $description: String) {
    update_neo_skeleton_prod_outage(where: {id: {_eq: $outage_id}}, _set: {reason_id: $reason_id, comments: $description}) {
      affected_rows
    }
  }
`,
  Addnewannotation: gql`
  mutation Addnewannotation($schema: String, $date: timestamptz, $value: String, $metric_key: String, $instrument_id: String, $comments: String, $line_id: uuid, $user_id: uuid) {
    insert_neo_skeleton_data_annotations(objects: {schema: $schema, date: $date, value: $value, metric_key: $metric_key, instrument_id: $instrument_id, comments: $comments, line_id: $line_id, updated_by: $user_id, created_by: $user_id}) {
      affected_rows
      returning {
        id
      }
    }
  }
  `,
  Updateannotation: gql`
  mutation Updateannotation($date: timestamptz, $metric_key: String, $instrument_id: String, $comments: String,$line_id:uuid,$schema:String) {
    update_neo_skeleton_data_annotations(where: {date: {_eq: $date}, _and: {metric_key: {_eq:$metric_key}, _and: {instrument_id: {_eq: $instrument_id},_and: {line_id: {_eq:$line_id},_and: {schema: {_eq:$schema}}}}}}, _set: {comments: $comments}){
      affected_rows
    }
  }
  `,
  UpdateShitTimings: gql`
  mutation MyMutation2($line_id: uuid, $shift: jsonb) {
    update_neo_skeleton_lines(where: {id: {_eq: $line_id}}, _set: {shift: $shift}) {
      affected_rows
    }
  }
  `,
  updateReportGeneration: gql`
  mutation updateReportGeneration($id: uuid) {
    update_neo_skeleton_report_generation(where: {id: {_eq: $id}}, _set: {disable: true}) {
      returning {
        id
      }
    }
  } 
  `,
  InsertQualityMetrics: gql`
  mutation InsertQualityMetrics($parameter: [neo_skeleton_quality_metrics_insert_input!]!) {
    insert_neo_skeleton_quality_metrics(objects: $parameter) {
      affected_rows
      returning {
        id
      }
    }
  }`,
  UpdateQualityMetrics: gql`
  mutation UpdateQualityMetrics($id : Int , $parameter : String , $line_id : uuid) {
    update_neo_skeleton_quality_metrics(where: {id: {_eq:$id  }}, _set: {line_id: $line_id, parameter:$parameter }) {
      affected_rows
    }
  }`,
  userNotificationAddRow: gql`
  mutation userNotificationAddRow($user_id: uuid) {
    insert_neo_skeleton_user_notification(objects: {user_id: $user_id}) {
      affected_rows
    }
  }
  `,
  DeleteQualityMetrics: gql`
  mutation DeleteQualityMetrics($parameter: String) {
    delete_neo_skeleton_quality_metrics(where: {parameter: {_eq: $parameter}}) {
      affected_rows
    }
  }
  `,
  addPartSteelData: gql`
  mutation AddPartSteelData($entity_id: uuid, $key: String, $value: json, $time: timestamptz) {
      insert_neo_skeleton_steel_data_one(object: {entity_id: $entity_id, key: $key, value: $value, time: $time}) {
        entity_id
      }
    } 
  `,
  editPartSteelData: gql`
  mutation editPartSteelData($entity_id: uuid, $key: String, $value: json, $time: timestamptz) {
      update_neo_skeleton_steel_data(where: {time: {_eq:$time  }}, _set: {entity_id: $entity_id, key:$key, value:$value }) {
        affected_rows
      }
    }
  `
};
if (import.meta.env.VITE_STAGE === 'prod') {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}
export default config;
