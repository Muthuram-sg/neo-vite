import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Navigate, Outlet } from "react-router-dom";
import { createPortal } from "react-dom";
import { RatingStar } from "rating-star";
import InputFieldNDL from "components/Core/InputFieldNDL";
import Grid from "components/Core/GridNDL";
import configParam from "../../config";
import { useMutation } from "@apollo/client";
import moment from "moment";
import { useRecoilState } from "recoil";
import gqlQueries from "../../components/layouts/Queries";
import {
  FullScreenmode, 
  selectedPlant,
  snackToggle,
  snackMessage,
  snackType,
  isFullView,
  themeMode,
  userData,
  ratingModal,
  currentPage,
  tasktablesearch,
  TaskTableCustomization,
  TaskColumnFilter,
  TaskHeadCells,
  AlarmSearch,
  SensorSearch,
  AlarmTableCustomization,
  LineHaveLicense,
  HistroyTable,
  AlarmHistroyColumnFilter,
  AlarmHistroyHeadCells,
  HistoryTableCustomization,
  onlineTrendsMetrArr,
  settingsLoader,
  labelInterval,
  snackDesc,
  VisibleModuleAccess,
  currentUserRole
} from "recoilStore/atoms";
import { useTranslation } from "react-i18next";
import SelectlineIlllight from '../../assets/Select Plant-light.svg?react';
import SelectlineIlldark from '../../assets/Select Plant - Dark.svg?react';
import ButtonNDL from "components/Core/ButtonNDL";
import Toast from "components/Core/Toast/ToastNDL";
import LoadingScreenNDL from "LoadingScreenNDL";
import ModalNDL from "components/Core/ModalNDL";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import useTheme from "TailwindTheme";
import useGetLicenceData from "Hooks/useGetLicenceData";
import useGetAlarmSMSUser from "./Alarms/hooks/useGetAlarmSMSUser";
import SprintView from "./SprintViewData";
import useReleaseNotes from "../../Hooks/HygraphContent/UseReleseNote";

import useGetModuleAccessList from "components/app/Hooks/useGetModules.jsx";
import useGetSubModules from "components/app/Hooks/useGetSubModules.jsx";
const Drawer = React.lazy(() => import("components/app/LeftDrawer.jsx"));


export default function NeoTemplate() {
  const theme = useTheme();
  const [curTheme] = useRecoilState(themeMode);
  const [isFullScreen] = useRecoilState(FullScreenmode); 
  const ratingRef = useRef();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
 

  const { releaseloading, releasedata } = useReleaseNotes();

  const classes = {
    root: {
      display: "flex",
      // backgroundColor: theme.colorPalette.backGround,
      height: "100%",
    },
  };
  let navigate = useNavigate();
  let location = useLocation();
  const { t } = useTranslation();
  const [headPlant] = useRecoilState(selectedPlant);
  const [headPlantSchema,setHeadPlantSchema] = useState('')
  const [currUser] = useRecoilState(userData);
  const [notesPopup, setNotesPopup] = useState(false);
  const [sidebaropen,setsidebaropen]= useState(false);

  const [openSnack, setOpenSnack] = useRecoilState(snackToggle);
  const [message, setSnackMessage] = useRecoilState(snackMessage);
  const [SnackDesc, setSnackDesc] = useRecoilState(snackDesc);
  const [type, setType] = useRecoilState(snackType);
  const [fullView] = useRecoilState(isFullView);
  const [rating, setRating] = useState(0);
  const [isRate, setIsRate] = useState({ value: "", isValid: true });
  const [isRatingModal, setRatingModal] = useRecoilState(ratingModal);
  const [ratingUpdateDays, setRatingUpdateDays] = useState(0);
  const [currPage, setCurPage] = useRecoilState(currentPage);
  const content1 = `flex-grow ${
    isFullScreen ? "max-w-full" : ""
  } mr-0 ${curTheme === "dark" ? "bg-dark" : "bg-light"}`;
  const contentShift1='max-w-[calc(100%-40px)]'
  // const topPadding1="mt-14"
  // const condition1 = open ? contentShift1 : "";
  // const condition2 = !fullView ? topPadding1 : "";
  const [, setTaskSearch] = useRecoilState(tasktablesearch);
  const [, setTaskheadCells] = useRecoilState(TaskHeadCells);
  const [, settaskTableCustomization] = useRecoilState(TaskTableCustomization);
  const [, setTaskselectedcolnames] = useRecoilState(TaskColumnFilter);
  // const [, setAlarmheadCells] = useRecoilState(AlarmHeadCells)
  // const [, setAlarmselectedcolnames] = useRecoilState(AlarmColumnFilter)
  const [, setAlarmTableCustomization] = useRecoilState(
    AlarmTableCustomization
  );
  const [, setAlarmSearch] = useRecoilState(AlarmSearch);
  const [, setSensorSearch] = useRecoilState(SensorSearch);
  const [, setHistroyselectedcolnames] = useRecoilState(
    AlarmHistroyColumnFilter
  );
  const [, setHistroyheadCells] = useRecoilState(AlarmHistroyHeadCells);
  const [, sethistroySortCustomization] = useRecoilState(
    HistoryTableCustomization
  );
  const [, setselectedMeterAndChip] = useRecoilState(onlineTrendsMetrArr);
  const [, setintervalLabel] = useRecoilState(labelInterval);
  const [moduleView, setModuleView] = useRecoilState(VisibleModuleAccess);
  const [, setHistroyTable] = useRecoilState(HistroyTable);
  const [description, setdescription] = useState("");
  const [iscreated, setcreated] = useState(false);
  const [IsLoading, setIsLoading] = useRecoilState(settingsLoader);
  const [belowtheRemainder, setbelowtheRemainder] = useState({
    remainingDays: "",
    isBelow: false,
    expiry_date: new Date(),
  });
  const {
    LicenseDataLoading,
    LicenseDataData,
    LicenseDataError,
    getGetLicenceData,
  } = useGetLicenceData();
  const [isLicenModelOpen, setisLicenModelOpen] = useState(false);
  const [, setisLineHaveLicense] = useRecoilState(LineHaveLicense);
  const {
    AlarmSMSUserLoading,
    AlarmSMSUserData,
    AlarmSMSUserError,
    getAlarmSMSUser,
  } = useGetAlarmSMSUser();
  const [superAdminList, setsuperAdminList] = useState([]);
  const [sprintModal, setSprintModal] = useState(false);
  const [currUserRole] = useRecoilState(currentUserRole); 
  let plantSchema = localStorage.getItem('plantid') ? localStorage.getItem('plantid') : 'plantschema'

const { ModuleAccessLoading, ModuleAccessData, ModuleAccessError, getModuleAccess } = useGetModuleAccessList();
  const { SubModuleAccessLoading, SubModuleAccessData, SubModuleAccessError, getSubModuleAccess } = useGetSubModules();

  useEffect(() => {
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [isOffline]);

  const handleOffline = () =>{
    setIsOffline(true);
    setType("Error");
    setOpenSnack(true);
    setSnackMessage(
      <>
        No Internet Connection <br />
        Looks like you're offline!  Check your internet connection to continue.
      </>
    );
    setSnackDesc("")
  }

  const handleOnline = () =>{
    setIsOffline(false);
    setType("success");
    setOpenSnack(true);
    setSnackMessage("Connection is back! You can continue working seamlessly")
    setSnackDesc("")
  } 
useEffect(()=>{
  if(headPlant.id){
    getModuleAccess(headPlant.id)
    getSubModuleAccess(headPlant.id)
  }
},[headPlant]);

useEffect(() => {
  if (!ModuleAccessLoading && ModuleAccessData && !ModuleAccessError) {
    setModuleView((prevState) => ({
      ...prevState, 
      mainModuleAccess: ModuleAccessData,
    }));
  }
}, [ModuleAccessLoading, ModuleAccessData, ModuleAccessError])

useEffect(() => {
  if (!SubModuleAccessLoading && SubModuleAccessData && !SubModuleAccessError) {
    setModuleView((prevState) => ({
      ...prevState, 
      reportSubmodelAccess: SubModuleAccessData,
    }));
  }
}, [SubModuleAccessLoading, SubModuleAccessData, SubModuleAccessError]);

  useEffect(() => {
    if (description && isRatingModal) {
      setTimeout(() => {
        ratingRef.current.value = description;
      }, 200);
    }
  }, [description, isRatingModal]);

  useEffect(() => {
    if (belowtheRemainder.isBelow) {
      setisLicenModelOpen(true);
    } else {
      setisLicenModelOpen(false);
    }
  }, [belowtheRemainder]);

  useEffect(() => {
    if (!AlarmSMSUserLoading && AlarmSMSUserData && !AlarmSMSUserError) {
      setsuperAdminList(AlarmSMSUserData.length > 0 ? AlarmSMSUserData : []);
    }
  }, [AlarmSMSUserLoading, AlarmSMSUserData, AlarmSMSUserError]);

  useEffect(() => {
    setHeadPlantSchema(headPlant.plant_name)
    setTaskSearch("");
    setTaskheadCells([]);
    settaskTableCustomization({
      page: 0,
      rowperpage: 10,
      order: "asc",
      orderby: "",
    });
    setTaskselectedcolnames([]);
    // setAlarmheadCells([])
    // setAlarmselectedcolnames([])
    setAlarmTableCustomization({
      page: 0,
      rowperpage: 10,
      order: "asc",
      orderby: "",
    });
    setAlarmSearch("");
    setSensorSearch("");
    setHistroyselectedcolnames([]);
    setHistroyheadCells([]);
    sethistroySortCustomization({ order: "asc", orderby: "" });
    setHistroyTable({
      page: 0,
      rowperpage: 10,
      columnFilter: {
        filterStatus: "",
        filterIntru: "",
        filterMetName: [],
        filterName: "",
        filterType: "",
        metricsList: [],
        alarmName: [],
      },
      typeFilter: [],
      searchOpen: false,
      search: "",
      typeFilterBy: [],
    });

    setselectedMeterAndChip([]);
    setintervalLabel("");
    if (!IsLoading) {
      setIsLoading(true);
    }

    getGetLicenceData();
    getAlarmSMSUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant]);

  useEffect(() => {
    const path_loc = location.pathname;
    let pathname = path_loc.split("/");
    if (pathname.length >= 3 && pathname[2] === "dashboard") {
      setCurPage("dashboard");
    } else if (pathname.length >= 3 && pathname[2] === "explore") {
      setCurPage("explore");
    } else if (pathname.length >= 3 && pathname[2] === "reports") {
      setCurPage("reports");
    } else if (pathname.length >= 3 && pathname[2] === "Alarms") {
      setCurPage("Alarms");
    } else if (pathname.length >= 3 && pathname[2] === "Tasks") {
      setCurPage("Tasks");
    } else if (pathname.length >= 3 && pathname[2] === "analytics") {
      setCurPage("analytics");
    } else if (pathname.length >= 3 && pathname[2] === "FaultAnalysis") {
      setCurPage("PdM");
    } else if (pathname.length >= 3 && pathname[2] === "ManageInstruments") {
      setCurPage("ManageInstruments");
    } else if (pathname.length >= 3 && pathname[2] === "offline") {
      setCurPage("offline");
    } else if (pathname.length >= 3 && pathname[2] === "production") {
      setCurPage("production");
    } else if (pathname.length >= 3 && pathname[2] === "settings") {
      setCurPage("settings");
    }
},[location])


useEffect(()=>{
  if(!LicenseDataLoading && LicenseDataData && !LicenseDataError && superAdminList.length > 0){

   let superAdmin =  superAdminList.filter(x=>x.user_id === currUser.id && x.is_enable)
  //  console.log(superAdmin,'superAdmin',superAdminList, currUser.id)
    if(LicenseDataData.length > 0 && superAdmin.length === 0  ){
      let validateLicence = [...LicenseDataData]
      let plantLicenseDetail = validateLicence.filter(x=>x.line_id === headPlant.id)
      // console.log(plantLicenseDetail,"plantLicenseDetail")
      if(plantLicenseDetail.length > 0){
        let licenseDateDifference = getDifferenceInDays(moment(new Date()),moment(plantLicenseDetail[0].expiry_date).format("YYYY-MM-DDT00:00:00"))
        let hour = getDifferenceInHours(moment(new Date()),moment(plantLicenseDetail[0].expiry_date).format("YYYY-MM-DDT00:00:00"))
        console.log(plantLicenseDetail[0].expiry_remainder,licenseDateDifference,licenseDateDifference >= plantLicenseDetail[0].expiry_remainder,"licenseDateDifference",hour)
        if(hour < 0 || Number(licenseDateDifference) < 0 ){
          setisLineHaveLicense(true)
          setbelowtheRemainder({isBelow:false,remainingDays:licenseDateDifference,expiry_date:plantLicenseDetail[0].expiry_date})
        }else if(licenseDateDifference <= plantLicenseDetail[0].expiry_remainder){
          setisLineHaveLicense(false)
          setbelowtheRemainder({isBelow:true,remainingDays:licenseDateDifference,expiry_date:plantLicenseDetail[0].expiry_date})
        }else{
          setisLineHaveLicense(false)
          setbelowtheRemainder({isBelow:false,remainingDays:licenseDateDifference,expiry_date:plantLicenseDetail[0].expiry_date})
        }
      }
      
    }else{
      setbelowtheRemainder({isBelow:false,remainingDays:'0',expiry_date:new Date()})
      setisLineHaveLicense(false)
    }

  }

},[LicenseDataLoading, LicenseDataData, LicenseDataError,superAdminList])


  useEffect(() => {
    if (
      !LicenseDataLoading &&
      LicenseDataData &&
      !LicenseDataError &&
      superAdminList.length > 0
    ) {
      // console.log(LicenseDataData, "LicenseDataData");

      let superAdmin = superAdminList.filter(
        (x) => x.user_id === currUser.id && x.is_enable
      );
      //  console.log(superAdmin,'superAdmin',superAdminList, currUser.id)
      if (LicenseDataData.length > 0 && superAdmin.length === 0) {
        let validateLicence = [...LicenseDataData];
        let plantLicenseDetail = validateLicence.filter(
          (x) => x.line_id === headPlant.id
        );
        // console.log(plantLicenseDetail,"plantLicenseDetail")
        if (plantLicenseDetail.length > 0) {
          let licenseDateDifference = getDifferenceInDays(
            moment(new Date()),
            moment(plantLicenseDetail[0].expiry_date)
          );
          // console.log(
          //   plantLicenseDetail[0].expiry_remainder,
          //   licenseDateDifference,
          //   licenseDateDifference >= plantLicenseDetail[0].expiry_remainder,
          //   "licenseDateDifference"
          // );
          if (
            Number(licenseDateDifference) === 0 ||
            Number(licenseDateDifference) <= 0
          ) {
            setisLineHaveLicense(true);
            setbelowtheRemainder({
              isBelow: false,
              remainingDays: licenseDateDifference,
              expiry_date: plantLicenseDetail[0].expiry_date,
            });
          } else if (
            licenseDateDifference <= plantLicenseDetail[0].expiry_remainder
          ) {
            setisLineHaveLicense(false);
            setbelowtheRemainder({
              isBelow: true,
              remainingDays: licenseDateDifference,
              expiry_date: plantLicenseDetail[0].expiry_date,
            });
          } else {
            setisLineHaveLicense(false);
            setbelowtheRemainder({
              isBelow: false,
              remainingDays: licenseDateDifference,
              expiry_date: plantLicenseDetail[0].expiry_date,
            });
          }
        }
      } else {
        setbelowtheRemainder({
          isBelow: false,
          remainingDays: "0",
          expiry_date: new Date(),
        });
        setisLineHaveLicense(false);
      }
    }
  }, [LicenseDataLoading, LicenseDataData, LicenseDataError, superAdminList]);

  useEffect(() => {
    // Get the matched route information
    // const { path } = match.route;
    const path_loc = location.pathname;
    let pathname = path_loc.split("/");

    if (pathname.length >= 3 && pathname[2] === "FaultAnalysis") {
      setCurPage("PdM");
    } else if (pathname.length >= 1) {
      setCurPage(pathname[2] ? pathname[2] : pathname[1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    configParam
      .RUN_GQL_API(gqlQueries.getUserRating, { user_id: currUser.id })
      .then((val) => {
        if (val && val.neo_skeleton_users_rating) {
          if (val.neo_skeleton_users_rating.length > 0) {
            const userrating = val.neo_skeleton_users_rating[0];
            var currentDate = moment(new Date()).format("YYY-MM-DD");
            var endDate = moment(userrating.created_ts).format("YYY-MM-DD");
            const updateddays = moment(currentDate).diff(endDate, "days");
            setRatingUpdateDays(updateddays);
            setRating(userrating.rating);
            setdescription(userrating.description);

            if (updateddays > 90) {
              setIsRate({ value: "", isValid: true });
            }
          } else {
            setIsRate({ value: "", isValid: true });
          }
        }
      });
    setcreated(false);
  }, [currUser, iscreated]);

  const [submitRating, { error: submitRatingReqErr }] = useMutation(
    // {refetchQueries: [{ query: getGaiaDet }]},
    configParam.addUsersRating,
    {
      update: (inMemoryCache, returnData) => {
        if (!submitRatingReqErr) {
          if (returnData.data.insert_neo_skeleton_users_rating_one) {
            setcreated(true);
            setOpenSnack(true);
            setSnackMessage(t("ratingSuccess"));
            setType("success");
            closeRating();
          }
        }
      },
    }
  );

  const onRatingChange = (val) => {
    setRating(val);
  };

  function getDifferenceInDays(date1, date2) {
    const firstDate = moment(date1);
    const secondDate = moment(date2);

    const differenceInDays = secondDate.diff(firstDate, 'days');
    return differenceInDays ? differenceInDays : '';
}

function getDifferenceInHours(date1, date2) {
  const firstDate = moment(date1);
  const secondDate = moment(date2);

  const differenceInDays = secondDate.diff(firstDate, 'hours');
  return differenceInDays ;
}

  const clickSubmit = () => {
    if (rating === 5) {
      submitRating({
        variables: { user_id: currUser.id, rating: rating, description: "" },
      });
    } else if (ratingRef.current.value !== "") {
      submitRating({
        variables: {
          user_id: currUser.id,
          rating: rating,
          description: ratingRef.current.value,
        },
      });
    }
  };

  const closeRating = () => {
    setIsRate({ value: "", isValid: true });
    setRatingModal(false);
  };
  const openRating = () => {
    setIsRate({ value: "", isValid: true });
    setRatingModal(true);
  };

  const remaindME = () => {
    setisLicenModelOpen(false);
  };

  const contactSupport = () => {
    let location = "/neo/support/" + headPlant.id;
    navigate(location);
    setisLicenModelOpen(false);
  };
  // console.log(location.pathname,'location.pathname')

  useEffect(() => {
    if (releasedata && releasedata.length > 0) {
      releasedata.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const latestReleaseDate = moment(releasedata[0].createdAt).format(
       ' MMMM DD, YYYY HH:mm'
      );
      const lastShownDate = localStorage.getItem("formattedDate");
      if (!latestReleaseDate || latestReleaseDate !== lastShownDate) {
        setSprintModal(true);
        localStorage.setItem("formattedDate", latestReleaseDate);
      } else {
        setSprintModal(false);
      }
    } else {
      setSprintModal(false);
    }
  }, [releasedata]);

  const handleClose = () => {
    setSprintModal(false);
    // To HELP RELOAD THE PAGE AFTER THE RELEASE NOTES TO UPDATE THE LEFT MENU WITH CUSTOM NAME DURING THE INITIAL STAGE
    if((headPlant.custom_name !== null && headPlant.custom_name !== undefined && headPlant.custom_name !== '')){
      window.location.reload()
    }
  };

  
  return (
    <div style={classes.root}>
      <ModalNDL open={isRatingModal} size="lg">
        <ModalHeaderNDL>
          <TypographyNDL variant="heading-02-xs" value={t("ratingTitle")} />
        </ModalHeaderNDL>
        <ModalContentNDL>
          <div className="space-y-6 text-center ">
            <RatingStar
              id="clickable"
              size={24}
              clickable
              rating={rating}
              onRatingChange={onRatingChange}
            />
          </div>
          <div className="flex justify-center text-center  mt-1">
            {/* <p className="text-[14px] text-secondary-text  leading-[18px] font-normal dark:text-white">
              Tap the number of stars you would <br></br>give us on a scale from
              1-5
            </p> */}
            <TypographyNDL  value="Tap the number of stars you would" variant="label-01-s"/>
            <TypographyNDL  value="give us on a scale from
              1-5"  variant="label-01-s"/>
          </div>
          {rating === 5 ? (
            <p className="text-sm text-secondary-text px-1 py-1">
              {t("ThankyouRating")}
            </p>
          ) : (
            <div>
              <div className="pt-4">
              <TypographyNDL    value="Feedback"
            variant="paragraph-xs"/>
              </div>
         
                
              <div className="mt-0.5">
              <InputFieldNDL
                id="rating"
                placeholder={t("ratingDesc")}
                inputRef={ratingRef}
                error={!isRate.isValid}
                multiline={true}
                maxRows={5}
                helperText={!isRate.isValid && "Please enter comments"}
              />
              </div>
           
            </div>
          )}
        </ModalContentNDL>
        <ModalFooterNDL>
          <ButtonNDL
          
          type='secondary'
            value={t("Close")}
            onClick={closeRating}
          />
          <ButtonNDL value={t("Submit")} onClick={clickSubmit}    />
        </ModalFooterNDL>
      </ModalNDL>

      <ModalNDL open={isLicenModelOpen} size="lg">
        <ModalHeaderNDL>
          <TypographyNDL
            variant="xl-heading-02"
            value={`Your license expires in ${belowtheRemainder.remainingDays} days!`}
          />
        </ModalHeaderNDL>
        <ModalContentNDL>
          <TypographyNDL
            value={`Your Neo license will expire on ${moment(
              belowtheRemainder.expiry_date
            ).format("DD-MM-YYYY")}`}
            variant="base-body-01"
          />
          <br></br>
          <TypographyNDL
            value="To avoid any disruption in using the application, and maintain continuous data monitoring, please renew your license before the expiration date"
            variant="base-body-01"
          />
          <br></br>
          <TypographyNDL
            value="For assistance, contact our support team."
            variant="base-body-01"
          />
        </ModalContentNDL>
        <ModalFooterNDL>
          <ButtonNDL
            varient="secondary"
            value={t("Remaind Me")}
            onClick={remaindME}
          />
          <ButtonNDL value={t("Contact Support")} onClick={contactSupport} />
        </ModalFooterNDL>
      </ModalNDL>

      <ModalNDL open={sprintModal}>
        <SprintView close={handleClose} releasedata={releasedata} />
      </ModalNDL>

     
      {
        !fullView ?
          (
            <>
              {/* <AppBar showRating={openRating} ratingDays={ratingUpdateDays} /> */}
              <Drawer fullView={fullView}  showRating={openRating} ratingDays={ratingUpdateDays} sidebaropen={(e)=>setsidebaropen(e)}/>
            </>
          ) :  (location.pathname !== '/'+headPlantSchema+'/dashboard/') && (location.pathname !== '/'+headPlantSchema+'/line')&&
                  <React.Fragment>
                    {/* <AppBar/> */}
                    <Drawer fullView={fullView} showRating={openRating} ratingDays={ratingUpdateDays} sidebaropen={(e)=>setsidebaropen(e)}/>
                  </React.Fragment>
                 
      }
 
      <main
        className={`${content1}`}
        id="MainComp-Div"
        style={{ width: 'calc(100% - 252px)',transition: 'width 1000ms' }}
      >
        {headPlant.id === 0 && (
          <Grid container justifyContent="center">
            <Grid item xs={12} style={{ textAlign: "center" }}>
              {curTheme === "light" ? (
                <SelectlineIlllight />
              ) : (
                <SelectlineIlldark />
              )}
              <TypographyNDL
                style={{
                  color: curTheme === "light" ? "#363636B8" : "#8F8F8F",
                }}
                value={t("Selectline")}
              />
            </Grid>
          </Grid>
        )}
        {headPlant.id !== 0 && (
          <React.Suspense fallback={<LoadingScreenNDL open={sidebaropen}/>}>
            <Outlet context={[
    sidebaropen
  ]}/>
            {currPage === "neo" ? <Navigate to={`/${headPlantSchema}/dashboard`} replace />
 : ""}
          </React.Suspense>
        )}
      </main>
      {createPortal(
            <React.Fragment>
                <div id='customTooltipbot' className="tooltiptext tooltip-bottom font-geist-sans dark:text-Neutral-neutral-text-alt-dark  dark:bg-Neutral-neutral-base-alt-dark" style={{position:'absolute',display:'none'}}></div>
                <div id='customTooltiptop' className="tooltiptext tooltip-top font-geist-sans dark:text-Neutral-neutral-text-alt-dark  dark:bg-Neutral-neutral-base-alt-dark" style={{position:'absolute',display:'none'}}></div>
                <div id='customTooltipright' className="tooltiptext tooltip-right font-geist-sans dark:text-Neutral-neutral-text-alt-dark  dark:bg-Neutral-neutral-base-alt-dark" style={{position:'absolute',display:'none'}}></div>
            </React.Fragment>        
             ,
             document.body
             )}
     
      <Toast type={type} discriptionText={SnackDesc} message={message} toastBar={openSnack}  handleSnackClose={() => setOpenSnack(false)} ></Toast>
    
      <Toast type={type}  WolrdIcon discriptionText={SnackDesc} timer={6000} message={message} toastBar={openSnack}  handleSnackClose={() => setOpenSnack(false)} ></Toast>
      
    </div>
  );
}
