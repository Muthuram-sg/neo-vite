import React, { useEffect, useState } from "react";
import useTheme from "TailwindTheme";
import Grid from "components/Core/GridNDL";  
import RequestAccessTopBar from "./components/RequestAccessTopBar"; 
import configParam from "config";
import { useRecoilState } from "recoil";
import { userData, selectedPlant, currentPage,snackToggle, snackMessage, snackType ,themeMode,userDefaultLines} from "recoilStore/atoms";
import { useTranslation } from "react-i18next";
import gqlQueries from "components/layouts/Queries"; 
import RequestContainer from "./components/RequestContainer";
import useGetLinecount from "./hooks/useGetLineCount";
import useSubmitAccessReq from "./hooks/useSubmitAccessReq";
import useDeleteAccessReq from "./hooks/useDeleteReq";
import useReviewAccessReq from "./hooks/useReviewRequest";
import usePendingReqList from "./hooks/useGetPendingList";
import useGetAccessHistory from "./hooks/useGetAccesHistory";
import useGetGiaDetails from "./hooks/useGetGiaDetails";
import useRolesDetails from "./hooks/useGetRoles";
import useCreateUserRoleLine from "./hooks/useCreateUserRoleLine";
import useRejectReq from "./hooks/useRejectRequest";
import useGetRequestAccessCount from "./hooks/useGetRequestAccesscount";
import useGetRejectCount from "./hooks/useGetRejectCount";
import moment from "moment";
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import ButtonNDL from "components/Core/ButtonNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 

export default function RequestAccess() {
  const theme =useTheme()
  const { t } = useTranslation();
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setSnackType] = useRecoilState(snackType);
  const [gaiaDet, setGaiaDet] = useState([]);
  const [activity, setActivity] = useState([]);
  const [businessName, setBusinessName] = useState([]);
  const [countryName, setCountryName] = useState([]);
  const [plantName, setPlantName] = useState([]);
  const [, setLineName] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userDetails] = useRecoilState(userData);
  const [headPlant] = useRecoilState(selectedPlant);
  const [ARList, SetARList] = useState([]);
  const [refreshList] = useState(false);
  const [submitStatus] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pendingReqList, setPendingReqList] = useState([]);
  const [selectedLine] = useState({ id: "", name: "" });
  const [curTheme] = useRecoilState(themeMode);
  const [approvedLines] = useRecoilState(userDefaultLines);
  const [lineList, setLineList] = useState([]);
  const [lineId, setLineId] = React.useState("");
  const [isValueClear, setIsValueClear] = React.useState(false);
  const [, setPlantCode] = useState();
  const [requestData, setRequest] = useState({
    activity_name: "",
    business_name: "",
    country_name: "",
    gaia_plant_name: "",
    line_name: "",
    created_by: userDetails.id,
    role_id: 0,
    approve: false,
  });
  
  const [open, setOpen] = useState(false);
  const [, setAutoClear] = useState(false);
  const [userRole, setUserRole] = useState();
  const [modalContent, setModalData] = useState({ title: "", content: "" });
  const [, setRequestCount] = useState(0);

  const {
    outLineCountLoading,
    outLineCountData,
    outLineCountError,
    GetLinecount,
  } = useGetLinecount();
  const {
    outReqUpdateLoading,
    outReqUpdateData,
    outReqUpdateError,
    getSubmitAccessReq,
  } = useSubmitAccessReq();
  const {
    outDeleteReqLoading,
    outDeleteReqData,
    outDeleteReqError,
    getDeleteAccessReq,
  } = useDeleteAccessReq();
  const {
    outReviewReqLoading,
    outReviewReqData,
    outReviewReqError,
    getReviewAccessReq,
  } = useReviewAccessReq();
  const {
    outPendingReqLoading,
    outPendingReqData,
    outPendingReqError,
    GetPendingReqList,
  } = usePendingReqList();
  const {
    outAccessHistoryLoading,
    outAccessHistoryData,
    outAccessHistoryError,
    getAccessHistory,
  } = useGetAccessHistory();
  const {
    outGiaDetailsLoading,
    outGiaDetailsData,
    outGiaDetailsError,
    getGiaDetailsList,
  } = useGetGiaDetails();
  const {
    outCreateUserRoleLineLoading,
    outCreateUserRoleLineData,
    outCreateUserRoleLineError,
    getCreateUserRoleLine,
  } = useCreateUserRoleLine();
  const {
    outRejectReqLoading,
    outRejectReqData,
    outRejectReqError,
    getRejctReq,
  } = useRejectReq();
  const {
    outRejectCountLoading,
    outRejectCountData,
    outRejectCountError,
    GetRejectCount,
  } = useGetRejectCount();
  const {
    outRequestAccessCountLoading,
    outRequestAccessCountData,
    outRequestAccessCountError,
    GetRequestAccessCount,
  } = useGetRequestAccessCount();
  const { outRolesLoading, outRolesData, outRolesError, getRolesList } =
    useRolesDetails();
  const [
    { business_name_valid, country_name_valid, gaia_plant_name_valid },
    setState,
  ] = useState({
    business_name_valid: 0,
    country_name_valid: 0,
    gaia_plant_name_valid: 0,
  });

  useEffect(() => {
    setInterval(setAutoClear(false), 500);
  }, []);

  const [, setCurPage] = useRecoilState(currentPage);
  useEffect(() => {
    setCurPage("access");
    getGaiaDet();
    getGiaDetailsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (outGiaDetailsData && !outGiaDetailsLoading && !outGiaDetailsError) {
      let LinData=outGiaDetailsData.map(v=> {
       
        return {
            ...v,
            id: v.gaia_plant_name, 
           
            name: (v.lines && v.lines[0] && v.lines[0].name) ? v.lines[0].name : v.gaia_plant_name,
            subtext: `${v.activity_name} > ${v.business_name} > ${v.gaia_plant_name} `
        }
      })
      // console.log(LinData,"LinData")
      setLineList(LinData); 
      getGaiaDet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outGiaDetailsData]);
// console.log(outGiaDetailsData,"outGiaDetailsData")
  const classes = {
    cardContent: {
      
    },
    leftCard: {
      borderRight: `1px solid ${theme.colorPalette.divider}`,
      border: "0px",
      borderRadius: 0,
      boxShadow: "none",
      background: theme.colorPalette.foreGround,
    },
    lineForm: {
        padding: 4, 
    },
    lineSetTitle: {
      marginTop: 10,
      fontSize: "14px",
      // lineHeight: '24px',
      color: theme.colorPalette.primary,
      fontWeight: 600,
    },
    formControlMargin: {
      margin: 0,
    },
    list: theme.list,
    paper: theme.menuPaper,
  }


  const sortData = (data) => {
    return data.sort(function (a, b) {
      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      }
      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      }
      return 0;
    }); 
  }
  
  useEffect(() => {
    if (lineList && lineList.length > 0) {
      setRequest({
        activity_name: "",
        business_name: "",
        country_name: "",
        gaia_plant_name: "",
        line_name: "",
        created_by: userDetails.id,
        role_id: 0,
        approve: false,
      });
      setGaiaDet(lineList);
      const activitylinedata = [...new Set(lineList.map((item) => item.activity_name))];
      const finalActivityArr = sortData(activitylinedata);
      setActivity(finalActivityArr.map((e)=> {return {id: e,name:e}}));
    }
    getRolesList();

    getAccessHistory(userDetails.id);
    if (
      outAccessHistoryData &&
      !outAccessHistoryLoading &&
      !outAccessHistoryError
    ) {
      const tempARListArr = outAccessHistoryData.map((y) => ({
        ...y,
        isDelete: false,
      }));
      SetARList(tempARListArr);
    } else {
      SetARList([]);
    }

    GetPendingReqList(userDetails.id, headPlant.id);
    if (!outPendingReqLoading && outPendingReqData && !outPendingReqError) {
      const approvedlineid = approvedLines.map((x) => x.line.id);
      const allrequest = outPendingReqData.filter((x) =>
        approvedlineid.includes(x.line.id)
      );

      setPendingReqList(allrequest);
      const tempARListArr = outPendingReqData.map((y) => ({
        ...y,
        isDelete: false,
      }));
      SetARList(tempARListArr);
    } else {
      setPendingReqList([]);
      SetARList([]);
    }

    getGiaDetailsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getGaiaDet() {
    if (outGiaDetailsData && outGiaDetailsData.length > 0) {
      setRequest({
        activity_name: "",
        business_name: "",
        country_name: "",
        gaia_plant_name: "",
        line_name: "",
        created_by: userDetails.id,
        role_id: 0,
        approve: false,
      });
      setIsValueClear(true);
      setGaiaDet(outGiaDetailsData);
      const activityoutGiaDetailsData = [
        ...new Set(outGiaDetailsData.map((item) => item.activity_name)),
      ];
      const finalActivityArr = sortData(activityoutGiaDetailsData); 
      setActivity(finalActivityArr.map((e)=> {return {id: e,name:e}}));
    }
  }
  useEffect(() => {
    if (!outRejectCountLoading && outRejectCountData && !outRejectCountError) {
      if (outRejectCountData.neo_skeleton_user_request_access.length === 0) {
        getAccesscount(userDetails.id, lineId);
      } else {
        let data = outRejectCountData.neo_skeleton_user_request_access[0].reviewed_ts;
        let tDate = new Date(moment(data).subtract(15, "days").format("MM/DD/YYYY"));
        let fromDate = new Date(moment(new Date()).format("MM/DD/YYYY"));
        let Difference_In_Time = fromDate.getTime() - tDate.getTime() ;
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        let rejectDate = moment(data).format('DD/MM/YYYY HH:mm:ss')
        

        setModalData({
          title: "Warning",
          content: "Your request was rejected on "+rejectDate +". You can request again after "+Difference_In_Days+" days",
        });
        setRequest({
          activity_name: "",
          business_name: "",
          country_name: "",
          gaia_plant_name: "",
          line_name: "",
          created_by: userDetails.id,
          role_id: 0,
          approve: false,
        });
        setIsValueClear(true);
        setOpen(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outRejectCountData]);
  useEffect(() => {
    if (
      outRequestAccessCountData &&
      !outRequestAccessCountLoading &&
      !outRequestAccessCountError
    ) {
      setRequestCount(
        outRequestAccessCountData.neo_skeleton_user_request_access_aggregate
          .aggregate.count
      );
      if (
        outRequestAccessCountData.neo_skeleton_user_request_access_aggregate
          .aggregate.count === 0
      ) {
        GetRejectCount(
          userDetails.id,
          lineId,
          moment(new Date()).subtract(15, "days").format("YYYY-MM-DD")
        );
      } else {
        setModalData({
          title: "Worning",
          content: "You have already submitted request to "+ requestData.line_name,
        });
        setRequest({
          activity_name: "",
          business_name: "",
          country_name: "",
          gaia_plant_name: "",
          line_name: "",
          created_by: userDetails.id,
          role_id: 0,
          approve: false,
        });
        setIsValueClear(true);
        setOpen(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outRequestAccessCountData]);
  const getAccesscount = (userId, lineid) => {
    configParam
      .RUN_GQL_API(gqlQueries.checkIfAccessExists, {
        userId: userId,
        lineId: lineid,
      })
      .then((res) => {
        let data = res.neo_skeleton_user_role_line_aggregate.aggregate;
        if (data && data.count === 0) {
          getSubmitAccessReq(
            requestData.role_id,
            false,
            userDetails.id,
            lineid,
            false
          );

          getGaiaDet();
        } else {
          setModalData({
            title: t("AccessAlready"),
            content:
              t("AlreadyHaveAccess") +
              requestData.gaia_plant_name +
              t("ListedLine") +
              selectedLine.name +
              t("PlantLine"),
          });
          setOpen(true);
          setRequest({
            activity_name: "",
            business_name: "",
            country_name: "",
            gaia_plant_name: "",
            line_name: "",
            created_by: userDetails.id,
            role_id: 0,
            approve: false,
          });
          setIsValueClear(true);
        }
      });
  };
  useEffect(() => {
    if (outRolesData && !outRolesLoading && !outRolesError) { 
      setRoles(outRolesData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outRolesData]);

  const handleSelect = (e, name ,next) => {
    setShowError(false);
    setErrorMsg("");
    
    var tempdata = {...requestData};

    tempdata[name] = e.target.value;

    setShowError(false);
    setRequest(tempdata);
    if (name === "gaia_plant_name") {
      var plant_code = gaiaDet.find(
        (x) => x.gaia_plant_name === e.target.value
      ).gaia_plant_code;

      checkLinecount(plant_code);
    }
    if (next !== "") {
      var test_arr_temp = [];
      gaiaDet.forEach((item) => {
        if (
          item[name] === e.target.value &&
          !test_arr_temp.includes(item[next])
        ) {
          return test_arr_temp.push(item[next]);
        } 
      });
      const test_arr = sortData(test_arr_temp);
      if (next === "business_name") { 
        setBusinessName(test_arr.map((item)=> {return {id: item,name:item}}));
        setCountryName([]);
        setPlantName([]);
         tempdata.business_name = "";
         tempdata.country_name = "";
         tempdata.gaia_plant_name = "";
        setRequest(tempdata);
      } else if (next === "country_name") {
        setCountryName(test_arr.map((item)=> {return {id: item,name:item}}));
        setPlantName([]);
        tempdata.country_name = "";
        tempdata.gaia_plant_name = "";
        setRequest(tempdata);
      } else if (next === "gaia_plant_name") {
        setRequest(tempdata);
      }
    }
  };
  const checkLinecount = async (plant_id) => {
    await configParam
      .RUN_GQL_API(gqlQueries.checkIfLineExists, {
        plant_id: plant_id,
      })
      .then((returnLine) => {
        let data = returnLine.neo_skeleton_lines; 
        if (data.length > 0) {
          setShowError(false);
          setErrorMsg("");
          setLineName(outLineCountData);
        } else {
          setShowError(true);
          setErrorMsg(
            t("The") + requestData.gaia_plant_name + t("NEOMonitoringIIOT")
          );
        }
      });
  };

  useEffect(() => {
    if (outLineCountData && !outLineCountError && !outLineCountLoading) {
      if (outLineCountData.length === 0) {
        setShowError(true);
        setErrorMsg(
          t("The") + requestData.gaia_plant_name + t("NEOMonitoringIIOT")
        );
       
      } else {
        setShowError(false);
        setErrorMsg("");
        setLineName(outLineCountData);
        if (outLineCountError) {
          GetLinecount();
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outLineCountData]);
  useEffect(() => {
    GetPendingReqList(userDetails.id, headPlant.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleChange = (e) => {
    var tempdata = requestData;
    setUserRole(tempdata);
    tempdata.role_id = e.target.value;
    setRequest({...requestData,role_id:e.target.value});
  };

  const handleClick = (e, name, dependsOn) => {
    setState({
      business_name_valid: 0,
      country_name_valid: 0,  
      gaia_plant_name_valid: 0,
    });
    let selectName = name + "_err";
    if (dependsOn !== "" && requestData[dependsOn] === "") {
      setState((prevState) => ({ ...prevState, [selectName]: 1 }));
    } else {
      setState((prevState) => ({ ...prevState, [selectName]: 0 }));
    }
  };
  useEffect(() => {
    if (outReqUpdateData && !outReqUpdateLoading && !outReqUpdateError) {
      if (
        outReqUpdateData.insert_neo_skeleton_user_request_access.affected_rows >
        0
      ) {
        handleSnackOpen();
        setSnackMessage(t("AccessRequestSubmit"));
        setSnackType("success");
      
        setRequest({
          activity_name: "",
          business_name: "",
          country_name: "",
          gaia_plant_name: "",
          line_name: "",
          created_by: userDetails.id,
          role_id: 0,
          approve: false,
        });
        setAutoClear(true);
        setBusinessName([]);
        setActivity([]);
        setPlantName([]);
        setCountryName([]);
        setLineName([]);
        setRoles([]);
        getRolesList();
        getAccessHistory(userDetails.id);
        setUserRole("");
        setIsValueClear(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outReqUpdateData]);

  const submitAccessReq = (e) => { 
    if(errorMsg){
      // console.log("errormsg")
      return false;
    }
    if (!requestData.role_id) {
      handleSnackOpen();
      setSnackMessage(t("SelectAllfields"));
      setSnackType("error");
      handleSnackOpen();
      return false;
    }
    for (let key in requestData) {
      if (requestData[key] === "") {
        // console.log("emptyfeild")
        handleSnackOpen();
        setSnackMessage(t("SelectAllfields"));
        setSnackType("error");
      
        return false;
      }
    }
    // console.log(userDetails.id, lineId,"testOnclick")
    GetRequestAccessCount(userDetails.id, lineId);
  };

  const handleSnackOpen = () => {
    setOpenSnack(true);
  };

  const deleteReq = (id) => {
    getDeleteAccessReq(id);
  };

  const approveReq = (id) => {
    getReviewAccessReq(true, false, new Date(), userDetails.id, "NA", id);
  };

  const rejectReq = (id, reason) => {
    getRejctReq(false, true, new Date(), userDetails.id, reason, id);
  };
  useEffect(() => {
    if (!outRejectReqLoading && outRejectReqData && !outRejectReqError) {
      if (
        outRejectReqData.update_neo_skeleton_user_request_access.affected_rows >
        0
      ) {
        handleSnackOpen();
        setSnackMessage(t("RequestRejected"));
        setSnackType("success");
        
        let id =
          outRejectReqData.update_neo_skeleton_user_request_access.returning[0]
            .id;
        getAccessHistory(userDetails.id);
        let data = pendingReqList.filter((x) => x.id !== id);
        setPendingReqList(data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outRejectReqData]);
  useEffect(() => {
    if (outDeleteReqData && !outDeleteReqLoading && !outDeleteReqError) {
      if (
        outDeleteReqData.delete_neo_skeleton_user_request_access.affected_rows >
        0
      ) {
        handleSnackOpen();
        setSnackMessage(t("RequestDeletedSuccess"));
        setSnackType("success");
      
        getAccessHistory(userDetails.id);
        GetPendingReqList(userDetails.id, headPlant.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outDeleteReqData]);

  // eslint-disable-next-line
  useEffect(() => {
    if (outReviewReqData && !outReviewReqLoading && !outReviewReqError) {
      if (
        outReviewReqData.update_neo_skeleton_user_request_access.affected_rows >
        0
      ) {
        let id =
          outReviewReqData.update_neo_skeleton_user_request_access.returning[0]
            .id;
        getAccessHistory(userDetails.id);
        let data = pendingReqList.filter((x) => x.id !== id);
        setPendingReqList(data);
        getCreateUserRoleLine(
          outReviewReqData.update_neo_skeleton_user_request_access.returning[0]
            .created_by,
          outReviewReqData.update_neo_skeleton_user_request_access.returning[0]
            .role_id,
          outReviewReqData.update_neo_skeleton_user_request_access.returning[0]
            .line_id,
          userDetails.id
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outReviewReqData]);

  // eslint-disable-next-line
  useEffect(() => {
    if (
      outCreateUserRoleLineData &&
      !outCreateUserRoleLineLoading &&
      !outCreateUserRoleLineError
    ) {
      setSnackMessage(t("UserAccessAdded"));
      setSnackType("success");
      handleSnackOpen();
      GetPendingReqList(userDetails.id, headPlant.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outCreateUserRoleLineData]);

  useEffect(() => {
    if (
      outAccessHistoryData &&
      !outAccessHistoryLoading &&
      !outAccessHistoryError
    ) {
      const tempARListArr = outAccessHistoryData.map((y) => ({
        ...y,
        isDelete: false,
      }));

      SetARList(tempARListArr);
    } else {
      SetARList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outAccessHistoryData]);
  useEffect(() => {
    GetPendingReqList(userDetails.id, headPlant.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snackMessage]);

  useEffect(() => {
    if (!outPendingReqLoading && outPendingReqData && !outPendingReqError) {
      const approvedlineid = approvedLines.map((x) => x.line.id);
      const allrequest = outPendingReqData.filter((x) =>
        approvedlineid.includes(x.line.id)
      );

      setPendingReqList(allrequest);
    } else {
      setPendingReqList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outPendingReqData]);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getGaiaDet();
    getRolesList();
    // eslint-disable-next-line
  }, [refreshList]);

  const handleLine = (event) => {
    setShowError(false);
    setErrorMsg("");
    let plant_code = event.lines[0] ? event.lines[0].id : 0;
    let giaPlantCode = event ? event.gaia_plant_code : 0;

    checkLinecount(giaPlantCode);

    if (event) {
      let lineName = event.lines[0] ? event.lines[0].name : "";
      let lineid = event.lines[0] ? event.lines[0].id : "";
      // console.log(lineName,lineid,"line ")
      setLineId(lineid);
      let data = {
        activity_name: event.activity_name,
        business_name: event.business_name,
        country_name: event.country_name,
        gaia_plant_name: event.gaia_plant_name,
        line_name: lineName,
        role_id: 0,
      };
      
      setRequest(data);

      setPlantCode(plant_code);

      const filterData = getListData(event.activity_name, "activity_name");
      let businessNameList = filterData.map((val) => val.business_name);
      let business_name = removeDuplicate(businessNameList);
      setBusinessName(business_name.map((e)=> {return {id: e,name:e}}));

      const filtercountryName = getListData(
        event.business_name,
        "business_name"
      );
      let countrylist = filtercountryName.map((val) => val.country_name);
      let countryNameList = removeDuplicate(countrylist);
      setCountryName(countryNameList.map((e)=> {return {id: e,name:e}}));

      const filterPlantName = getListData(event.country_name, "country_name");
      let PlantName = filterPlantName.map((val) => val.gaia_plant_name);
      let PlantNameList = removeDuplicate(PlantName);
      setPlantName(PlantNameList.map((e)=> {return {id: e,name:e}}));
      setShowError(false);
      setErrorMsg("");
    } else {
      let data = {
        activity_name: "",
        business_name: "",
        country_name: "",
        gaia_plant_name: "",
        line_name: "",
        role_id: 0,
      };
      setIsValueClear(true);
      setRequest(data);
    }
  };
  

  const getListData = (value, key) =>
  {
   return  lineList.filter((val) =>  val[key].toLowerCase().toLowerCase().includes(value.toLowerCase())
  );}



  const removeDuplicate = (value) => {
    const uniqueValue = [];
  
    return value.filter((element) => {
      const isDuplicate = uniqueValue.includes(element);
      if (!isDuplicate) {
        uniqueValue.push(element);
        return true;
      }
  
      return false;
    });
  };
  
  const onclear = () => {
    
    let data = {
      activity_name: "",
      business_name: "",
      country_name: "",
      gaia_plant_name: "",
      line_name: "",
      role_id: 0,
    };
    setIsValueClear(true);
    setRequest(data);
    setShowError(false);
    setErrorMsg("");
    
  };

  
  return (
    <Grid container spacing={0} style={{padding:"8px"}} >
      <RequestContainer
        leftCard={classes.leftCard}
        curTheme={curTheme}
        cardContent={{}}
        lineForm={classes.lineForm}
        lineSetTitle={classes.lineSetTitle}
        formControlMargin={classes.formControlMargin}
        menuList={classes.menuList}
        list={classes.list}
        paper={classes.paper}
        lineList={lineList}
        onHandleLine={handleLine} 
        userRole={userRole}
        roles={roles}
        activity={activity}
        handleRoleChange={handleRoleChange}
        showError={showError}
        colortheme={''}
        errorMsg={errorMsg}
        handleClick={handleClick}
        handleSelect={handleSelect}
        requestData={requestData}
        businessName={businessName}
        business_name_valid={business_name_valid}
        countryName={countryName}
        plantName={plantName}
        country_name_valid={country_name_valid}
        gaia_plant_name_valid={gaia_plant_name_valid}
        submitAccessReq={submitAccessReq}
        submitStatus={submitStatus}
        onclose={onclear}
        isValueClear={isValueClear}
      />

      <Grid item xs={9} sm={9} style={{marginLeft:"8px"}}>
        <RequestAccessTopBar
          refreshList={refreshList}
          deleteReq={deleteReq}
          approveReq={approveReq}
          rejectReq={rejectReq}
          ARList={ARList}
          pendingReqList={pendingReqList}
        />
      </Grid>

      

      <ModalNDL
        size="lg" 
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title">
        <ModalHeaderNDL id="responsive-dialog-title">
          <TypographyNDL  variant="heading-02-m" value={modalContent.title}/>
        </ModalHeaderNDL>
        <ModalContentNDL>
          <TypographyNDL  variant="lable-01-s" value={modalContent.content}/>
          </ModalContentNDL>
        <ModalFooterNDL>
          <ButtonNDL onClick={handleClose} color="primary"  value= {t("OK")} />
            
          
        </ModalFooterNDL>
      </ModalNDL>
    </Grid>
  );
}
