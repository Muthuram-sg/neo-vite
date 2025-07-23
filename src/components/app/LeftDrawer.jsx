import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useTheme from 'TailwindTheme';
import Typography from 'components/Core/Typography/TypographyNDL.jsx';
import DrawerButton from '../ui/iotDrawerIcon.jsx'
import routes from "routes";
import routes_users from "../../routes_users.jsx";
import { useRecoilState } from "recoil";
import {defaultDashboard, themeMode, currentPage,dashboardEditMode, metricsArry, currentUserRole, selectedPlant, userData, settingsTabValue, productionTabValue,reportsList ,SelectedReportPage, pdmTabValue,VisibleModuleAccess,SelectedDashboardPage,dashboardDropdownState,currentDashboard, alarmTabValue,neonixTabValue, customIcon} from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import { AlarmMenuList } from 'components/layouts/Alarms/Menu.jsx';
import { MenuList } from 'components/layouts/Settings/SubMenu.jsx';
import { BIMenuList } from 'components/layouts/Settings/SubMenuBI.jsx'
import { SubMenuList } from 'components/layouts/Settings/Production/SubMenu.jsx';
import { PDMMenuList } from 'components/layouts/ManageInstruments/components/PDMMenuList.jsx';
import { NeonixSubmenu } from 'components/layouts/NeoNix/SubMenuOptions.jsx';
import 'components/style/customize.css';
import Grindsmart from 'assets/neo_icons/Logos/GrindSmart.svg'
import Neo from 'assets/neo_icons/Logos/Neo_Logo_new.svg'
import CheravonDown from 'assets/neo_icons/Logos/chevron_down_leftBar.svg?react';
import CheravonUp from 'assets/neo_icons/Logos/chevron-up_leftBar.svg?react';
import Cmsicon from 'assets/neo_icons/Logos/cmslogo.svg'
import CmsiconDark from 'assets/neo_icons/Logos/cmsDarkLogo.svg'
import Tooltip from 'components/Core/ToolTips/TooltipNDL';
import Logo from 'components/Core/Logo/LogoNDL';
import ProfileMenu from "components/app/ProfileMenu.jsx"
import LocationSelect from "components/app/LocationSelect.jsx"
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import ExpandLeft from 'assets/neo_icons/leftBar/Collapse.svg?react';
import CollapseLeft from 'assets/neo_icons/leftBar/expand.svg?react';
import ExpandLeftDark from 'assets/neo_icons/leftBar/collapseDark.svg?react';
import CollapseLeftDark from 'assets/neo_icons/leftBar/expandDark.svg?react';
import CmsVertical from 'assets/neo_icons/Menu/newMenuIcon/cmslogo_vert.svg?react';
import CmsVerticalDark from 'assets/neo_icons/Menu/newMenuIcon/cms_Vertical_dark.svg?react';

import NeoVertical from 'assets/neo_icons/Menu/newMenuIcon/NeoLogo_vert.svg?react';
import GrindSmartVertical from 'assets/neo_icons/Menu/newMenuIcon/GrindSmart_vert.svg?react';
import CrionVertical from 'assets/CRION_Logo_Rotate.svg?react';
import AnushamLightVertical from 'assets/Anusham_Logo_light_vertical.svg?react';
import AnushamDarkVertical from 'assets/Anusham_Logo_Dark_Vert.svg?react';

import Crion from 'assets/CRION_Logo.svg'
import useUpdateDashData from 'components/layouts/Dashboards/hooks/useUpdateDashData.jsx';
import useGetOptixAssertOption from 'components/layouts/Reports/hooks/useGetOptixAssertOption.jsx';
import configParam from 'config';
import gqlQueries from 'components/layouts/Queries.jsx'
import useDashboardList from "components/layouts/Dashboards/hooks/useGetDashboardList.jsx"
import useToolLife from "components/layouts/Settings/ToolLifeMonitoring/hooks/useToolLife.jsx"
import useGetPlantAsset from './Hooks/useGetAssets.jsx';
import axios from 'axios';









export default function LeftDrawer(props) {
  const { t } = useTranslation();
  const baseUrl = window.location.hostname;
 
  const [curTheme] = useRecoilState(themeMode);
  const [curPage, setCurPage] = useRecoilState(currentPage);
  const [headPlant] = useRecoilState(selectedPlant); 
  const theme = useTheme();
  const [currUserRole] = useRecoilState(currentUserRole);
  const {  DashboardListLoading, DashboardListData, DashboardListError, getDashboardList } = useDashboardList();
  const [userdetails] = useRecoilState(userData);
 const [,setselectedDashboard] = useRecoilState(currentDashboard);
  const [moduleView] = useRecoilState(VisibleModuleAccess);
  const [, setProdTabValue] = useRecoilState(productionTabValue);
  const [, setPdmTabValue] = useRecoilState(pdmTabValue)
  const [, setNeonixTabValue] = useRecoilState(neonixTabValue)
  const [selectedReportPage,setSelectedReportPage] = useRecoilState(SelectedReportPage)
  const [,setSelectedDashboardPage] = useRecoilState(SelectedDashboardPage)
  const [,setEditMode] = useRecoilState(dashboardEditMode);

  const [ customLogo, setCustomIcon ] = useRecoilState(customIcon)


  const navigate = useNavigate();
  let routesDecider = currUserRole && currUserRole.id === 3 ? routes_users : routes
  const [RoutesDecider,setRoutesDecider]= useState(routesDecider.mainRoutes);
  const [windowSize, setWindowSize] = useState(
    window.innerWidth *
    window.innerHeight
  );

 
  const [open, setIsCollapsed] = useState(false);
  const [pin,setpin] = useState(true);
  const [, setalarmTabValue] = useRecoilState(alarmTabValue)
  const [savedReports] = useRecoilState(reportsList);
  const [reportList,setreportList] = useState([])
  const [dashboardDropdown,setdashboardDropdown] = useState([])
  const [OptixAssertOption, setOptixAssertOption] = useState([])
  const { GetOptixAssertOptionLoading, GetOptixAssertOptionData, GetOptixAssertOptionError, getGetOptixAssertOption } = useGetOptixAssertOption()
 const [selectedSubPage,setselectedSubPage] = useState('My Report')
 const [selectedDashboardSubpage,setselectedDashboardSubpage] = useState('My Dashboard')
 const [,setMetricList] = useRecoilState(metricsArry); 
 const [,setDefaultDashboardID] = useRecoilState(defaultDashboard);
const { ToolLifeLoading, ToolLifeData, ToolLifeError, getToolLife } = useToolLife(); 
const { plantAssetLoading, plantAssetData, plantAssetError, getPlantAssets } = useGetPlantAsset();
const [userDefaultDashBoard,setuserDefaultDashBoard] = useState([])
const [standardDashId,setstandardDashId] = useState([])
const location = useLocation()


  let matchingModules = moduleView.mainModuleAccess.map( x=>{
    if(x.module_id && x.is_visible){
      return x.module_id
    }
  } );

  matchingModules = [...matchingModules,...[17,18,19]]


  const matchingSubModules = moduleView.reportSubmodelAccess.map( x=>{
    if(x.sub_module_id && x.is_visible){
      return x.sub_module_id
    }
  } );

  const NeoNIxOptionChnage=(e)=>{
    if (curPage !== 'Neonix') {
      let SchemaName = headPlant.plant_name
      navigate({
        pathname: '/'+SchemaName+'/Neonix'
      });
    }
    setTimeout(()=>{
      localStorage.setItem('setNeonixTabValue', e)
      setNeonixTabValue(e)
    }, 100)
  }
  const handleOptionChange = (menu,textName) => {
    if (textName === "reports") {
      optionChange(menu);
    } else if (textName === "PdM") {
      pdmOptionChange(menu.tabValue);
    } else if (textName === "Alarms") {
      alarmOptionChange(menu.tabValue);
    } else if (textName === "Neonix") {
      NeoNIxOptionChnage(menu.tabValue);
    } else {
      prodOptionChange(menu.tabValue);
    }
  };

 


  useEffect(() => {
      if (!GetOptixAssertOptionLoading && GetOptixAssertOptionData && !GetOptixAssertOptionError) {
        setOptixAssertOption(GetOptixAssertOptionData)
      }
  
    }, [GetOptixAssertOptionLoading, GetOptixAssertOptionData, GetOptixAssertOptionError])

  useEffect(() => {
      getGetOptixAssertOption(21, headPlant.id)
      getParameterList()
      getDashboardList(headPlant.id,userdetails.id)
      // changeFavIcon()
      console.clear()
      console.log(headPlant, "headPlant in LeftDrawer");
      getPlantAssets(headPlant.id)
    }, [headPlant])

    const changeLogo = async (type, logo) => {
      try {
        if(type === 'svg'){
          let light_logo_svg = await axios.get(configParam.API_URL+`/settings/downloadLogo?category=${logo}&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
          let blob =  light_logo_svg?.data ? new Blob([light_logo_svg?.data], { type: "image/svg+xml" }) : null;
          // localStorage.setItem('logo', URL.createObjectURL(blob))
          setCustomIcon(URL.createObjectURL(blob))
        }
        else if(type === 'png'){
          let blob = configParam.API_URL+`/settings/downloadLogo?category=${logo}&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`
          // localStorage.setItem('logo', blob)
          setCustomIcon(blob)
        }
      } catch (error) {
        console.error("Error changing logo:", error);
      }
    }

    useEffect(() => {
      if (!plantAssetLoading && plantAssetData && !plantAssetError) {
        
        console.log(plantAssetData, headPlant, "plantAssetData");
        try {

        if(localStorage.getItem('theme') === 'dark'){
          if(plantAssetData?.dark_logo !== null) {
            // alert('Dark Logo - DARK')
            changeLogo(plantAssetData?.dark_logo?.split('.')[1], 'dark_logo')
          }
          else if (plantAssetData?.light_logo !== null) {
            // alert('Light Logo - DARK')
            changeLogo(plantAssetData?.light_logo?.split('.')[1], 'light_logo')
          } else {
            setCustomIcon(null)
          } 
        } else {
          if(plantAssetData?.light_logo !== null) {
            // alert('Light Logo - LIGHT')
            changeLogo(plantAssetData?.light_logo?.split('.')[1], 'light_logo')
          }
          else if (plantAssetData?.dark_logo !== null) {
            // alert('Dark Logo - LIGHT')
            changeLogo(plantAssetData?.dark_logo?.split('.')[1], 'dark_logo')
          } else {
            setCustomIcon(null)
          } 
        }
        }
        catch (error) {
          setCustomIcon(null)
        }

      } else {
        setCustomIcon(null)
      }
    }, [plantAssetLoading, plantAssetData, plantAssetError]);

  useEffect(() => {
      let reportArr = []
      if (savedReports.length > 0) {
        // eslint-disable-next-line array-callback-return
        savedReports.map(val => {
          reportArr.push({
            id: val.id, name: val.name, custome_reports: val.custome_reports, timestamp: val.updated_ts,
            subtext: t("UpdatedBy") + ' ' + val.userByUpdatedBy.name, created_by: val.created_by, public_access: val.public_access
          })
        })

        let standRpt = reportArr.filter(e => !e.custome_reports === true).map(x=>{
          return{
            id:x.id,
            title:x.name,
            custome_reports:x.custome_reports
          }
        })

        standRpt = standRpt.filter(x => matchingSubModules.includes(x.id));
        let ReportsDropdown = []
        if (OptixAssertOption.length > 0) {
          ReportsDropdown = standRpt
        } else {
          ReportsDropdown = standRpt.filter(x => x.id !== "5ae212e5-b818-4fa4-9496-575f188955e2")
        }
 
        setreportList(ReportsDropdown)
      }
  
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedReports, userdetails, headPlant, OptixAssertOption])

     useEffect(()=>{
            if(!ToolLifeLoading && ToolLifeData && !ToolLifeError ){
                if((ToolLifeData.length === 0) && dashboardDropdown.length > 0 ){
                setdashboardDropdown(dashboardDropdown.filter(f=>  f.id !== 'f53f8175-96f4-4eb7-a7d3-5c15185b47e9'))
                }
    
    
            }
        },[ToolLifeLoading, ToolLifeData, ToolLifeError])

        useEffect(()=>{
          if(userDefaultDashBoard.length > 0 && dashboardDropdown.length > 0 && location.pathname.split("/").length === 3){
            if(standardDashId.includes(userDefaultDashBoard[0].dashboard.id)){
              setSelectedDashboardPage({
                id: userDefaultDashBoard[0].dashboard.id,       
                name: userDefaultDashBoard[0].dashboard.name,
                custome_dashboard: false,
                title: userDefaultDashBoard[0].dashboard.name,
                isStandard:true
              });
              setselectedDashboard(userDefaultDashBoard)
              setDefaultDashboardID(userDefaultDashBoard[0].dashboard.id)
              setselectedDashboardSubpage(userDefaultDashBoard[0].dashboard.name);
            }else{
              if(headPlant.type !== "2"){
                setSelectedDashboardPage({id:'7e68b1cc-d842-4ea1-ab97-c425f4ac7be2',custome_dashboard:false,name:"Summary Dashboard",title:"Summary Dashboard",isStandard:true})
                setselectedDashboardSubpage("Summary Dashboard")
              }else{
              setselectedDashboardSubpage('My Dashboard');
              }
            }
          }else if(location.pathname.split("/").length > 3){
            let dashboardid = 'My Dashboard' 
            if(location.pathname.split("/")[3] === 'oee'){
              dashboardid ="OEE Dashboard" 
          }else if(location.pathname.split("/")[3] === 'production'){
              dashboardid = "Production Dashboard"
          }
          else if(location.pathname.split("/")[3] === 'contract'){
              dashboardid = "Power Delivery Monitoring"
          }
          else if(location.pathname.split("/")[3] === 'connectivity'){
              dashboardid = "Connectivity Dashboard"
          }
          else if(location.pathname.split("/")[3] === 'cms'){
              dashboardid = "CMS Dashboard"
          }
          else if(location.pathname.split("/")[3] === "Energy%20Consumption"){
              dashboardid = "Energy Dashboard"
          }
          setselectedDashboardSubpage(dashboardid);

          }

        },[dashboardDropdown])
        
 
   useEffect(()=>{
          try{
              if(!DashboardListError && !DashboardListLoading && DashboardListData ){ 
                      let standard = [];
                      let custom = [];
                      if(headPlant.type === '2'){
                          standard = DashboardListData.length > 0 && DashboardListData[0].dashboardList ?DashboardListData[0].dashboardList.filter(x=>!x.custome_dashboard && x.id !== '7e68b1cc-d842-4ea1-ab97-c425f4ac7be2'):[];
                          custom = DashboardListData.length > 0 && DashboardListData[0].dashboardList?DashboardListData[0].dashboardList.filter(x=>x.custome_dashboard && (x.userByCreatedBy.id === userdetails.id || (x.standard === true?x.user_access_list&&x.user_access_list.length>0?x.user_access_list.includes(userdetails.id):true:false))):[]; 
                      }else{
                          standard = (DashboardListData.length > 0 && DashboardListData[0].dashboardList) ? (DashboardListData[0].dashboardList.filter(x=>x.id === '7e68b1cc-d842-4ea1-ab97-c425f4ac7be2')) : [];
                          custom = [];
                      }

                      

                      if(OptixAssertOption.length > 0){
                        standard=standard
                    }
                    else{
                        standard = standard.filter(x=>x.id !== "3e0cd86a-191c-4b69-b467-22c3ff433419")
                    }

                      if((headPlant && headPlant.node &&  headPlant.node.energy_contract)){
                        if(headPlant.node.energy_contract.IsContract === false){
                            standard = standard.filter(x=>x.id !== "85b5b3c1-476b-4a4d-95a4-67631c2ea013")
                        }

                    }else{
                        standard = standard.filter(x=>x.id !== "85b5b3c1-476b-4a4d-95a4-67631c2ea013")
                        
                    }
                    const matchingSubModules = moduleView.reportSubmodelAccess.map( x=>{
                      if(x.sub_module_id && x.is_visible){
                        return x.sub_module_id
                      }
                    } );
                      standard = standard.filter(x => matchingSubModules.includes(x.id))
                      setuserDefaultDashBoard(DashboardListData.length > 1 ? DashboardListData[1].currentDashboard : [] )
                      setdashboardDropdown(standard)
                      setstandardDashId(standard.map(x=>x.id))
                      getToolLife(headPlant.id)

              }        
          }catch(err){
              console.log('standardstandarderror',err);
          }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[DashboardListData,DashboardListError,DashboardListLoading,moduleView])
          
  // Toggle function to open/close the sidebar
  const toggleSidebar = () => {
      setpin(!pin); // Toggle pinned state
      if (!pin) {
        // setIsCollapsed(false); // Expand the sidebar when pinned
        document.getElementById('MainComp-Div').style.width = 'calc(100% - 252px)' 
      } else {
         document.getElementById('MainComp-Div').style.width ='calc(100% - 40px)' 
      }
    
  };
  
  // eslint-disable-next-line no-unused-vars
  

  let menuOption = MenuList;
  let prodMenuOption = SubMenuList;
  let PDMMenuLists = PDMMenuList;
  let NeoNixMenuLists = NeonixSubmenu;
  let AlarmsMenuLists = AlarmMenuList;
  let BIMenuOption = BIMenuList;

  const areMatching = prodMenuOption.some(value => matchingSubModules.includes(value.id));  


if(areMatching){
  prodMenuOption = SubMenuList;
}
else{
  prodMenuOption= SubMenuList.filter(value => !["c3eb619f-37ef-4f9b-9b13-e6b2c13bbe70"].includes(value.id));
}

function alarmOptionChange(e) {
  if (curPage !== 'Alarms') {
    let SchemaName = headPlant.plant_name
    navigate({
      pathname: '/'+SchemaName+'/Alarms'
    });
  }
  setTimeout(()=>{
    localStorage.setItem('alarmstabValue', e)
    setalarmTabValue(e)
  }, 100)
}


  useEffect(()=>{
    let routesDecider = currUserRole && currUserRole.id === 3 ? routes_users : routes; 
   let fildata= routesDecider.mainRoutes.filter(x => matchingModules.includes(x.moduleId) );
   fildata= fildata.map(x=>{
      if((curPage === "reports" && x.name === "reports") || (curPage === "dashboard" && x.name === "dashboard") || (curPage === "PdM" && x.name === "PdM") || (curPage === "Neonix" && x.name === "Neonix") || (curPage === "Alarms" && x.name === "Alarms") || (curPage === "production" && x.name === "production")){
        return {...x,AccordianOpen:!x.AccordianOpen}
      }else{
        return x
      }
    })

 setRoutesDecider(fildata)

  },[currUserRole,curPage,moduleView])

  function dashboardOptionChange(e) {
    let SchemaName = headPlant.plant_name
    if (curPage !== 'dashboard') {
      navigate({
        pathname: '/' + SchemaName + '/dashboard',
      });
    }
    if (e === 'My Dashboard') {
      setSelectedDashboardPage({
        id: 'My Dashboard',
        custome_dashboard: false,
        title: 'Dashboard',
        name: 'Dashboard',
      });
      setselectedDashboardSubpage(e);
    } else {
      setSelectedDashboardPage({
        id: e.id,       
        name: e.name,
        custome_dashboard: false,
        title: e.name,
        isStandard:true
      });
      setselectedDashboard([e])
      setDefaultDashboardID(e.id)
      setselectedDashboardSubpage(e.name);
      // setselectedDashboard([1])
    }
    setEditMode(false)
  }
  
 

  function optionChange(e) {

    if (curPage !== 'reports') {
      let SchemaName = headPlant.plant_name
      navigate({
        pathname: '/'+SchemaName+'/reports'
      });
    }
   
      if(e === 'My Report'){ 
        setSelectedReportPage({id:'My Report',custome_reports:false,title:"My Report"})
        setselectedSubPage(e)
      }
      else{
        setSelectedReportPage({id:e.id,custome_reports:false,title:e.title})
        setselectedSubPage(e.title)
      }
     
  }
  useEffect(()=>{
    setselectedSubPage(selectedReportPage.title)
  },[selectedReportPage])

  function prodOptionChange(e) {

    if (curPage !== 'production') {
      let SchemaName = headPlant.plant_name
      navigate({
        pathname: '/'+SchemaName+'/production'
      });
    }
    setTimeout(()=>{
      localStorage.setItem('prodtabValue', e)
      setProdTabValue(e)
    }, 100)
  }

  function pdmOptionChange(e) {

    if (curPage !== 'PdM') {
      let SchemaName = headPlant.plant_name
      navigate({
        pathname: '/'+SchemaName+'/PdM'
      });
    }
    setTimeout(()=>{
      localStorage.setItem('pdmtabValue', e)
      setPdmTabValue(e)
    }, 100)
  }


useEffect(()=>{
    if(curPage === "reports"){
      let fildata= routesDecider.mainRoutes.filter(x => matchingModules.includes(x.moduleId));
      const filterMiddle =fildata.map(x=>{
        if(x.name === "reports"){
          return {...x,AccordianOpen:!x.AccordianOpen}
        }else{
          return x
        }
      })
      setRoutesDecider(filterMiddle)
    }
  
},[curPage])


function getParameterList() {
  configParam.RUN_GQL_API(gqlQueries.getParameterList)
      .then((returnData) => {
          if (returnData !== undefined && returnData.neo_skeleton_metrics && returnData.neo_skeleton_metrics.length > 0) {
              setMetricList(returnData.neo_skeleton_metrics);
          } else {
              setMetricList([])
          }
      });
} 

  const handleAccordianOpen=(type,open)=>{
    if(type === "reports"){
      let fildata= routesDecider.mainRoutes.filter(x => matchingModules.includes(x.moduleId));
      const filterMiddle = fildata.map(x=>{
        if(x.name === "reports"){
          return {...x,AccordianOpen:!open}
  
        }else{
          return x
        }
      })
 
      setRoutesDecider(filterMiddle)
      setSelectedReportPage({id:'My Report',custome_reports:false,title:"My Report"})
      setselectedSubPage('My Report')

    }
    else if (type === "PdM"){
      let fildata= routesDecider.mainRoutes.filter(x => matchingModules.includes(x.moduleId));
      const filterMiddle =fildata.map(x=>{
        if(x.name === "PdM"){
          return {...x,AccordianOpen:!open}
        }else{
          return x
        }
      })
       setPdmTabValue(0)
       setRoutesDecider(filterMiddle)


    } else if (type === "dashboard"){
      let fildata= routesDecider.mainRoutes.filter(x => matchingModules.includes(x.moduleId));
      const filterMiddle =fildata.map(x=>{
        if(x.name === "dashboard"){
          return {...x,AccordianOpen:!open}
        }else{
          return x
        }
      })
      if(headPlant.type !== "2"){
        setSelectedDashboardPage({id:'7e68b1cc-d842-4ea1-ab97-c425f4ac7be2',custome_dashboard:false,name:"Summary Dashboard",title:"Summary Dashboard",isStandard:true})
        setselectedDashboardSubpage("Summary Dashboard")
      }else{
        setSelectedDashboardPage({id:'My Dashboard',custome_dashboard:false,name:"Dashboard",title:"Dashboard"})
        setselectedDashboardSubpage("My Dashboard")
      }
      setRoutesDecider(filterMiddle)

       
      } else if (type === "Alarms"){
        let fildata= routesDecider.mainRoutes.filter(x => matchingModules.includes(x.moduleId));
        const filterMiddle =fildata.map(x=>{
          if(x.name === "Alarms"){
            return {...x,AccordianOpen:!open}
          }else{
            return x
          }
        })
         setalarmTabValue(0)
         setRoutesDecider(filterMiddle)  
      }else if(type === "Neonix"){
        let fildata= routesDecider.mainRoutes.filter(x => matchingModules.includes(x.moduleId));
        const filterMiddle =fildata.map(x=>{
          if(x.name === "Neonix"){
            return {...x,AccordianOpen:!open}
          }else{
            return x
          }
        })
        let tabValue = NeonixSubmenu.filter(x => matchingSubModules.includes(x.id))
        setNeonixTabValue(tabValue.length > 0 ? tabValue[0].tabValue : null)
        setRoutesDecider(filterMiddle)  
      }
    else{
      let fildata= routesDecider.mainRoutes.filter(x => matchingModules.includes(x.moduleId));
      const filterMiddle =fildata.map(x=>{
        if(x.name === "production"){
          return {...x,AccordianOpen:!open}
        }else{
          return x
        }
      })
       setRoutesDecider(filterMiddle)
    }

  }

  function getListItem(text,data) {



   

    if (text.name === "dashboard" ||text.name === "production" || text.name === "reports" || text.name === "PdM" || text.name === "Alarms" ||  text.name === "Neonix") {
      let suboptions;

      if (text.name === "reports") {
          suboptions = reportList.sort((a, b) => a.title.localeCompare(b.title));
      } else if (text.name === "PdM") {
          suboptions = PDMMenuLists;
      } else if (text.name === "dashboard") {
          suboptions = dashboardDropdown.sort((a, b) => a.name.localeCompare(b.name));
      } else if (text.name === "Alarms") {
          suboptions = AlarmsMenuLists;
      }  else if (text.name === "Neonix") {
        suboptions = NeonixSubmenu.filter(x => matchingSubModules.includes(x.id));
      } else {
          suboptions = prodMenuOption;
      }
      return (
          <li id={text.name} disableGutters key={text.name} onClick={() => { localStorage.setItem('currpage', text.name); localStorage.setItem('currpath', text.path); setCurPage(text.name); }}
            style={{
              width: "100%",
              position: " relative",
              boxSizing: "border-box",
              textAlign: "left",
              alignItems: "center",
              textDecoration: "none"
            }} >
            {!open ? (
              <React.Fragment>
              <li style={{ width: "100%" }} onClick={()=>handleAccordianOpen(text.name, text.AccordianOpen)}>
                    <div className='flex  capitalize p-2 items-center h-[32px] rounded-md justify-between' >
                       <div className='flex items-center gap-2'>
                       {curTheme === 'dark' ? <text.iconDark /> : <text.iconLight  /> }
                    <Typography  style={{marginBottom:"0px"}} variant={ text.name === curPage ? "label-02-s" :"lable-01-s"} value={t(text.name)} />
                    </div>
                     { 
                      text.AccordianOpen  ?
                      <CheravonUp  stroke={curTheme === 'dark'   ? '#e8e8e8'  : '#646464'} />
                      :
                    <CheravonDown stroke={curTheme === 'dark'   ? '#e8e8e8'  : '#646464'} /> 
                      }
                   
                    </div>
              </li>
                 {
                  text.AccordianOpen  && text.name !== "dashboard" && 
                   <div className='w-full '>
                   <ul className='text-center  '>
                   {
                      text.name === "reports" && 
                     <button class={`${selectedSubPage === "My Report" ?'bg-Secondary_Interaction-secondary-active dark:bg-Secondary_Interaction-secondary-active-dark' : ''}  py-1 pl-10 pr-2 h-[32px] text-left justify-center  text-[14px] leading-[16px] font-normal font-geist-sans   hover:bg-Secondary_Interaction-secondary-active active:bg-Secondary_Interaction-secondary-active dark:hover:bg-Secondary_Interaction-secondary-active-dark dark:active:bg-Secondary_Interaction-secondary-active-dark focus:bg-Secondary_Interaction-secondary-active
                     dark:focus:bg-Secondary_Interaction-secondary-active-dark  flex  flex-col w-full rounded-md`} onClick={() =>optionChange("My Report")} >{"My Report"}</button>
                    }
                   {
                    
                    suboptions.map(
                     ( menu, _index ) => ( 
                     <button  key={menu.id || menu.title || _index} class={`${selectedSubPage === menu.title ?'bg-Secondary_Interaction-secondary-active dark:bg-Secondary_Interaction-secondary-active-dark' : ''}  py-1 mt-0.5 pl-10 pr-2 h-[32px] text-left justify-center text-[14px] leading-[16px] font-normal font-geist-sans   hover:bg-Secondary_Interaction-secondary-active active:bg-Secondary_Interaction-secondary-active dark:hover:bg-Secondary_Interaction-secondary-active-dark dark:active:bg-Secondary_Interaction-secondary-active-dark focus:bg-Secondary_Interaction-secondary-active
                     dark:focus:bg-Secondary_Interaction-secondary-active-dark  flex  flex-col w-full rounded-md`}  onClick={() => handleOptionChange(menu,text.name)} >{menu.title}</button>
                   ) )
                 }
                   </ul>
                   </div>
                   
                 }
                  {
                  text.AccordianOpen  && text.name === "dashboard" &&
                   <div className='w-full '>
                   <ul className='text-center  '>
                    {
                      text.name === "dashboard" && headPlant.type === "2" && 
                     <button class={`${selectedDashboardSubpage === "My Dashboard" ? 'bg-Secondary_Interaction-secondary-active dark:bg-Secondary_Interaction-secondary-active-dark' : ''}  py-1 pl-10 pr-2 h-[32px] text-left justify-center  text-[14px] leading-[16px] font-normal font-geist-sans   hover:bg-Secondary_Interaction-secondary-active active:bg-Secondary_Interaction-secondary-active dark:hover:bg-Secondary_Interaction-secondary-active-dark dark:active:bg-Secondary_Interaction-secondary-active-dark focus:bg-Secondary_Interaction-secondary-active
                     dark:focus:bg-Secondary_Interaction-secondary-active-dark  flex  flex-col w-full rounded-md`} onClick={() =>dashboardOptionChange("My Dashboard")} >{"My Dashboards"}</button>

                    }
                   {
                   text.name === "dashboard" &&  
                   dashboardDropdown.map(
                     ( menu, _index ) => (  
                     <button key={_index} class={`${selectedDashboardSubpage === menu.name ? 'bg-Secondary_Interaction-secondary-active dark:bg-Secondary_Interaction-secondary-active-dark' : ''}  py-1 pl-10 pr-2 h-[32px] text-left justify-center text-[14px] leading-[16px] font-normal font-geist-sans   hover:bg-Secondary_Interaction-secondary-active active:bg-Secondary_Interaction-secondary-active dark:hover:bg-Secondary_Interaction-secondary-active-dark dark:active:bg-Secondary_Interaction-secondary-active-dark focus:bg-Secondary_Interaction-secondary-active
                     dark:focus:bg-Secondary_Interaction-secondary-active-dark  flex  flex-col w-full rounded-md`} onClick={() => dashboardOptionChange(menu) } >{menu.name}</button>
                   ) )
                 } 
                   </ul>
                   </div>
                   
                 }
             </React.Fragment>
            ) : (
                <li style={{ width: "100%" }} >


                  <DrawerButton style={{ width: "100%"}} selected={text.name === curPage ? true : false} size="small" 
                  >
                   {curTheme === 'dark' ? <text.iconDark /> : <text.iconLight  /> }
                  </DrawerButton>
                  <div class='drop-shadow-lg'>
                    <ul class="sub-menu rounded-lg  px-3 pb-2 pt-2  font-geist-sans overflow-y-auto text-sm text-gray-700 dark:text-gray-200 mb-0 submenu-div">
                      <li class="suubmenu-li" >
                        <div class="flex items-center rounded bg-gray-100  hover:bg-gray-100 border-b border-neutral-200   ">
                          <label class="w-full cursor-pointer  py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300 font-geist-sans">
                            <div style={{display: 'flex', justifyContent: 'center', color: 'rgb(0, 0, 0)'}}>
                              <span>{t(text.name)}</span>
                            </div>
                          </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                </li>
            )}
          </li>)
    }
    else {
      return (
        <li id={text.name} disableGutters key={text.name} onClick={() => { localStorage.setItem('currpage', text.name); localStorage.setItem('currpath', text.path); setCurPage(text.name); }}
          style={{
            width: "100%",
            display: "flex",
            position: " relative",
            boxSizing: "border-box",
            textAlign: "left",
            alignItems: "center",
            justifyContent: "flex-start",
            textDecoration: "none"
          }} >
          <li style={{ width: "100%"}}>
            <DrawerButton style={{ width: "100%",  display: "flex",alignItems:'center',height:"32px", justifyContent: "flex-start",gap:"8px" }} selected={text.name.replace(/\s+/g, '') === curPage ? true : false} size="small">
            {curTheme === 'dark' ? <text.iconDark /> : <text.iconLight  /> }
              <Typography style={{marginBottom:"0px"}} variant={ text.name === curPage ? "label-02-s" :"lable-01-s"} value={t(text.name)} />
              {
              text.badge &&
              <div className='ml-auto'>
              <text.badge />
              </div>
            }
             
            </DrawerButton>
            
          </li>
        </li>)
    }
  }
  

  function getListItemSet(text, index,data) {
    if (headPlant.id && headPlant.schema) {
      let SchemaName = headPlant.plant_name
      if (headPlant.type === '2') {
        if ((text.name === 'FaultAnalysis' && userdetails.faulthistory_access) || text.name !== 'FaultAnalysis') {
          return (
            <NavLink id={text.path} key={index} style={{ textDecoration: "none", color: theme.colorPalette.primary }} to={ "/" + SchemaName + text.path}>
              <>
                {getListItem(text,data)}
              </>
            </NavLink>)
        }

      } else {
        if (text.name === 'dashboard' || text.name === 'settings') {
          return (
            <NavLink id={text.path} key={index} style={{ textDecoration: "none", color: theme.colorPalette.primary }} to={"/" + SchemaName + text.path}>
              <>
                {getListItem(text)}
              </>

            </NavLink>
          )
        }
      }
    }

  }
  function getCustomName(headPlant, isCMS) {
    const name = headPlant?.custom_name?.toString().trim();
    
    return name && name.toLowerCase() !== 'undefined'
    ? `${name} AI`
    : isCMS
    ? 'CMS AI'
    : 'Neo AI';
    }

  const monitorView = RoutesDecider.filter(x => x.type === "monitor")
  let Analyzise = RoutesDecider.filter(x => x.type === "analyze")
    if(Array.isArray(Analyzise) && Analyzise.length > 0){
      Analyzise = Analyzise.map(x => {
        if (x.name === "Neo AI") {
          return { ...x, name: getCustomName(headPlant) }
        } else if (x.name === "CMS AI") {
          return { ...x, name: getCustomName(headPlant,true) }
        } else {
          return x
        }
      })
    }
 
  if(headPlant?.appTypeByAppType?.id === 3){
    Analyzise = Analyzise.filter(item => item.path !== "/NeoAI");
  } else {
    Analyzise = Analyzise.filter(item => item.path !== "/CMSAI");
  }
  const TrackView = RoutesDecider.filter(x => x.type === "track")
  const actView = RoutesDecider.filter(x => x.type === "act")
  const footerView = RoutesDecider.filter(x => x.type === "footer");

  

  const handleMouseEnter = () => {
    if(!pin && open){
        setIsCollapsed(false); // Expand on hover
        props.sidebaropen(false)  
        document.getElementById('MainComp-Div').style.width = 'calc(100% - 252px)'
     

    }
  };

  const handleMouseLeave = () => {
    if(!pin && !open){
      props.sidebaropen(true) 
      setIsCollapsed(true); // Collapse when hover ends 
      document.getElementById('MainComp-Div').style.width = 'calc(100% - 40px)'

    }
  };

// const changeFavIcon = async () => {
//   try{
//     if(headPlant.id){
//       if(localStorage.getItem('mode') === 'dark'){
        

//           try {
//             let dark_logo = await fetch(configParam.API_URL+`/settings/downloadLogo?category=dark_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)

//             if(dark_logo.status === 404){
//               let light_logo = await fetch(configParam.API_URL+`/settings/downloadLogo?category=light_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
//               const sblob = await light_logo.blob();
//               const contentType = sblob.type || light_logo.headers.get("content-type");
//               // console.clear()
//               console.log(light_logo, contentType)
//               if(contentType === 'image/png'){
//                 let blob = configParam.API_URL+`/settings/downloadLogo?category=light_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`
//                 localStorage.setItem('logo', blob)
//               } else {
//                 let light_logo_svg = await axios.get(configParam.API_URL+`/settings/downloadLogo?category=light_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
//                 let blob =  light_logo_svg?.data ? new Blob([light_logo_svg?.data], { type: "image/svg+xml" }) : null;
//                 localStorage.setItem('logo', URL.createObjectURL(blob))
//               }
//             }
//             else {
//               const blob = await dark_logo.blob();
//               const contentType = blob.type || dark_logo.headers.get("content-type");
//               if(contentType === 'image/png'){
//                 let dark_blob = configParam.API_URL+`/settings/downloadLogo?category=dark_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`
//                 // localStorage.setItem('logo', URL.createObjectURL(dark_blob))
//                 localStorage.setItem('logo', dark_blob)
//               } else {
//                   let dark_logo_svg = await axios.get(configParam.API_URL+`/settings/downloadLogo?category=dark_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
//                   console.log(dark_logo_svg)
//                   let dark_blob =  dark_logo_svg.data ? new Blob([dark_logo_svg?.data], { type: "image/svg+xml" }) : null;
//                   localStorage.setItem('logo', URL.createObjectURL(dark_blob))
//               }
//             }

//             // dark_blob = configParam.API_URL+`/settings/downloadLogo?category=dark_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`

//           }
//           catch(e){
//             console.log("ERROR__", e)
//           }
        
        
//       }
//       else {

//           try {
//             let light_logo = await fetch(configParam.API_URL+`/settings/downloadLogo?category=light_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
//             if(light_logo.status === 404){

//               try {
//                 let dark_logo = await fetch(configParam.API_URL+`/settings/downloadLogo?category=dark_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
//                 const blob = await dark_logo.blob();
//                 const contentType = blob.type || dark_logo.headers.get("content-type");
//                 if(contentType === 'image/png'){
//                   let dark_blob = configParam.API_URL+`/settings/downloadLogo?category=dark_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`
//                   // localStorage.setItem('logo', URL.createObjectURL(dark_blob))
//                   localStorage.setItem('logo', dark_blob)
//                 } else {
//                     let dark_logo_svg = await axios.get(configParam.API_URL+`/settings/downloadLogo?category=dark_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
//                     console.log(dark_logo_svg)
//                     let dark_blob =  dark_logo_svg.data ? new Blob([dark_logo_svg?.data], { type: "image/svg+xml" }) : null;
//                     localStorage.setItem('logo', URL.createObjectURL(dark_blob))
//                 }
    
//                 // dark_blob = configParam.API_URL+`/settings/downloadLogo?category=dark_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`
    
//               }
//               catch(e){
//                 console.log("ERROR__", e)
//               }

//             }
//             else {
//               const sblob = await light_logo.blob();
//               const contentType = sblob.type || light_logo.headers.get("content-type");
//               if(contentType === 'image/png'){
//                 let blob = configParam.API_URL+`/settings/downloadLogo?category=light_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`
//                 localStorage.setItem('logo', blob)
//               } else {
//                 let light_logo_svg = await axios.get(configParam.API_URL+`/settings/downloadLogo?category=light_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
//                 let blob =  light_logo_svg?.data ? new Blob([light_logo_svg?.data], { type: "image/svg+xml" }) : null;
//                 localStorage.setItem('logo', URL.createObjectURL(blob))
//               }
//             }
//           }
//           catch(e){
//             console.log("ERROR__", e)
//           }
//       }
//     }
//   }
//   catch(e){
//     // console.log("(((")
//     return null
//   }
  
// }


useEffect(() => {
  // console.clear()
  // alert("HI")

  // changeFavIcon()
  
  // let logo = getLogoSrc()
  // localStorage.setItem('logo', logo)

}, [headPlant])
 


const getLogoSrc = () => {
  // if(icon !== null && icon !== undefined) {
  //   return URL.createObjectURL(icon)
  // } else {
  if (baseUrl?.toLowerCase().includes("cms")) {
    return Cmsicon;
  } 
  if (headPlant.appTypeByAppType) {
    if (baseUrl===configParam.CMSURL) {
      return Cmsicon;
    } else {
      if (headPlant.appTypeByAppType.id === 1) {
        return headPlant.id === 'ec1ec116-457e-4346-ab3b-ad53807afc93' ? Crion : Neo;
      } else if (headPlant.appTypeByAppType.id === 2) {
        return Grindsmart;
      } 
      else if(headPlant.appTypeByAppType.id === 3){
        if(curTheme === 'dark') {
          return CmsiconDark;
        }else{
          return Cmsicon;
        }        
      }
      
      else {
        return headPlant.id === 'ec1ec116-457e-4346-ab3b-ad53807afc93' ? Crion : Neo;
      }
    }
  }
  return Neo;
  // }
};
 
useEffect(() => {
  const handleResize = () => {
    setWindowSize(
      window.innerWidth*
      window.innerHeight
    );
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


  return (

 <div 
      className={`w-56 min-h-screen  bg-Background-bg-tertiary  dark:bg-Background-bg-tertiary-dark   relative transition-all duration-225 ease-in-out border border-gray-300 flex-shrink-0 whitespace-nowrap block box-border`} 
      style={{ width: open ? "40px" : "250px", transition: 'width 1000ms ease',  zIndex: 21 }}
      onMouseEnter={handleMouseEnter} // Detect hover
      onMouseLeave={handleMouseLeave} // Detect hover end
     
    >
      <div 
        className={"sidebar h-screen close fixed top-0 left-0 w-56  bg-Background-bg-tertiary  dark:bg-Background-bg-tertiary-dark border-r border-Border-border-50 dark:border-Border-border-dark-50 transition-width duration-225 ease-in-out"} 
        style={{ 
          width: open ? "40px" : "250px", 
          transition: 'width 1000ms ease',
        }}
      >
     

        {/* <div className={`${toolbar1}`}></div> */}
        
        {/* Logo and ProfileMenu */}
        <div 
  className="p-2" 
  style={{ display: open ? 'block' : 'none' }}
>
  <div className="w-full h-screen flex flex-col items-center py-4 justify-between ">
  {/* Top Section (GrindSmartVertical) */}
  <div>
    {
      (headPlant.id !== '7b9ad765-bfa7-480e-9be4-1c0fe010d11a' && customLogo) ? <Logo id='Src_Logo' src={ customLogo } alt="IIOT Platform" style={{ transform: 'rotate(270deg)', transformOrigin: 'center' }}/> :
      headPlant.appTypeByAppType ? 
        (headPlant.appTypeByAppType.id === 1 ? 
          headPlant.id === '7b9ad765-bfa7-480e-9be4-1c0fe010d11a' ? curTheme  === 'dark' ? <AnushamDarkVertical /> : <AnushamLightVertical /> :
          (headPlant.id === 'ec1ec116-457e-4346-ab3b-ad53807afc93' ? 
            <CrionVertical /> : 
            <NeoVertical />
          ) : 
          headPlant.appTypeByAppType.id === 2 ? 
            <GrindSmartVertical /> : // Always on top
          headPlant.appTypeByAppType.id === 3 ? 
            (curTheme === 'dark' ? <CmsVerticalDark /> : <CmsVertical />) : 
            (headPlant.id === 'ec1ec116-457e-4346-ab3b-ad53807afc93' ? 
              <CrionVertical /> : 
              headPlant.id === '7b9ad765-bfa7-480e-9be4-1c0fe010d11a' ? curTheme  === 'dark' ? <AnushamDarkVertical /> : <AnushamLightVertical /> : <NeoVertical />
            )
        ) : 
        (headPlant.id === 'ec1ec116-457e-4346-ab3b-ad53807afc93' ? 
          <CrionVertical /> : 
          headPlant.id === '7b9ad765-bfa7-480e-9be4-1c0fe010d11a' ? curTheme  === 'dark' ? <AnushamDarkVertical /> : <AnushamLightVertical /> :  <NeoVertical />
        )
    }
  </div>
  <div className='pb-2'>
    <Tooltip title="Show Sidebar" placement="right" arrow>
    <button className='hover:bg-Secondary_Button-secondary-button-hover  cursor-pointer text-center   focus:bg-Secondary_Button-secondary-button-hover dark:focus:bg-Secondary_Button-secondary-button-hover-dark dark:hover:bg-Secondary_Button-secondary-button-hover-dark  active:bg-Secondary_Button-secondary-button-active dark:active:bg-Secondary_Button-secondary-button-active-dark bg-Secondary_Button-secondary-button-default dark:bg-Secondary_Button-secondary-button-default-dark text-Secondary_Button-secondary-button-text dark:text-Secondary_Button-secondary-button-text-dark  rounded-md font-normal w-8  h-8  ' >
    {curTheme === 'dark' ? (
      <CollapseLeftDark 
        onClick={toggleSidebar} 
        width={20} 
        height={20} 
        className="cursor-pointer"
      />
    ) : (
      <CollapseLeft 
        onClick={toggleSidebar} 
        width={20} 
        height={20} 
        className="cursor-pointer"
      />
    )}
   </button>
    </Tooltip>
  </div>
</div>


  {/* CollapseLeft Component at the Bottom Center */}
  
</div>

        <div style={{display:!open ? 'block' : 'none'}} >
        <div className='py-2 px-4 h-[48px] gap-4 flex justify-between items-center'>
          {/* <Logo src={getLogoSrc()} alt="IIOT Platform" /> */}
          {/* <Logo id='Src_Logo' src={ localStorage.getItem('logo')  || getLogoSrc()} alt="IIOT Platform" /> */}
          <Logo id='Src_Logo' src={customLogo || getLogoSrc()} alt="IIOT Platform" />
          <ProfileMenu id='profile' showRating={props.showRating} noLicense={props.noLicense} isLicense={props.isLicense} />
        </div>
        </div>
      
        {/* LocationSelect */}
        <div   style={{ 
    width: !open ? "218px" : "0px", 
    display:!open ? "block" : "none",
    opacity: !open ? 1 : 0, 
    visibility: !open ? 'visible' : 'hidden', 
    transition: 'width 500ms ease, opacity 300ms ease 200ms', 
  }} >
        <LocationSelect id='location'  open={open}/>

        </div>
          {
            !props.noLicense
            && !open && 
            <ul style={{display:!open ? 'block' : 'none'}} className='h-full'>
            
              {(headPlant.id && !open) && (
                <div className={`flex flex-col  justify-between h-full `} >
                <div id='mainnavs' className=' overflow-y-auto  p-4'>
          
                 {
                  monitorView.length !== 0&&
                  <div className='h-[18px] mb-1  px-2 py-0.5'>
                   <Typography value="Monitor"  color="tertiary" variant="lable-01-xs" />
                   </div>
                 }  
                 
                  {Array.isArray(monitorView) && monitorView.length > 0  &&  monitorView.map((text, index) => (
                     !text.footer && text.iconFlag ? (
                       <li key={text.name} onClick={() => { localStorage.setItem('currpage', text.name); localStorage.setItem('currpath', text.path); setCurPage(text.name); }}>
                         {getListItemSet(text, index,dashboardDropdown)}
                       </li>
                     ) : null
                   ))
                 }
                 {
                  headPlant.type === '2' &&
                  <div>
                  <div className='m-4'></div>
                {
                   Analyzise.length !== 0&&
                  <div  className='h-[18px]  mb-1 px-2 py-0.5'>
                      <Typography value="Analyze"  color="tertiary" variant="lable-01-xs" />
                 </div>
                } 
                  {
                   Array.isArray(Analyzise) &&Analyzise.length > 0 &&  Analyzise.map((text, index) => (
                      !text.footer && text.iconFlag ? (
                        <li key={text.name}  onClick={() => { localStorage.setItem('currpage', text.name); localStorage.setItem('currpath', text.path); setCurPage(text.name); }}>
                          {getListItemSet(text, index)}
                        </li>
                      ) : null
                    ))
                  }
                    <div className='m-4'></div>
                   {
                     TrackView.length !== 0&&
                    <div  className='h-[18px]  px-2 mb-1 py-0.5'>
                  <Typography value="Track"  color="tertiary" variant="lable-01-xs" />
                  </div>
                   } 
                  {
                    Array.isArray(TrackView) && TrackView.length> 0 &&  TrackView.map((text, index) => (
                      !text.footer && text.iconFlag ? (
                        <li key={text.name}  onClick={() => { localStorage.setItem('currpage', text.name); localStorage.setItem('currpath', text.path); setCurPage(text.name); }}>
                          {getListItemSet(text, index)}
                        </li>
                      ) : null
                    ))
                  }
                    <div className='m-4'></div>
                  {
                       actView.length !== 0&&
                    <div  className='h-[18px] px-2 py-0.5 mb-1 '>
                    <Typography value="Act"  color="tertiary" variant="lable-01-xs" />
           
                      </div>
                  }  
                  {
                     Array.isArray(actView) && actView.length > 0 &&  actView.map((text, index) => (
                      !text.footer && text.iconFlag ? (
                        <li key={text.name}  onClick={() => { localStorage.setItem('currpage', text.name); localStorage.setItem('currpath', text.path); setCurPage(text.name); }}>
                          {getListItemSet(text, index)}
                        </li>
                      ) : null
                    ))
                  }
                  <br></br>
                  <br></br>
                   </div>
  
  
                 }
                
                
                 
          
                
         </div>
         <div className='flex flex-col w-full  pt-0 pb-[116px] px-4 mt-auto border-t border-Border-border-50   dark:border-Border-border-dark-50 '>
    {/* Footer View Items */}
      {Array.isArray(footerView) && footerView.length > 0 &&
        footerView.map((text, index) => (
          <li key={text.name} onClick={() => { 
            localStorage.setItem('currpage', text.name); 
            localStorage.setItem('currpath', text.path); 
            setCurPage(text.name); 
          }}>
            {getListItemSet(text, index)}
          </li>
        ))
      }
      <li className='flex item-center justify-end mt-4 '>
      <Tooltip title="Hide Sidebar" placement="right" arrow>
        <button id={'hidesidebar'} className='hover:bg-Secondary_Button-secondary-button-hover text-center cursor-pointer  focus:bg-Secondary_Button-secondary-button-hover dark:focus:bg-Secondary_Button-secondary-button-hover-dark dark:hover:bg-Secondary_Button-secondary-button-hover-dark  active:bg-Secondary_Button-secondary-button-active dark:active:bg-Secondary_Button-secondary-button-active-dark bg-Secondary_Button-secondary-button-default dark:bg-Secondary_Button-secondary-button-default-dark text-Secondary_Button-secondary-button-text dark:text-Secondary_Button-secondary-button-text-dark  rounded-md font-normal w-8  h-8  ' >
        {curTheme === 'dark' ? (
              <ExpandLeftDark  
                width={20} 
                height={20} 
                fill={pin ? "#303030" : '#202020'} 
                onClick={toggleSidebar} 
              />
            ) : (
              <ExpandLeft  
                width={20} 
                height={20} 
                fill={pin ? "#e0e0e0" : '#FCFCFC'} 
                onClick={toggleSidebar} 
              />
            )}
        </button>
       </Tooltip>

</li>
    

    {/* Sidebar Toggle Button */}
    
  </div>
</div>

              )}
              {(!headPlant.id && !open)&& (
                <div>
                  <span className="Skeleton-root Skeleton-text Skeleton-pulse" style={{ height: '58px', margin: '0px 8px' }}></span>
                  <span className="Skeleton-root Skeleton-text Skeleton-pulse" style={{ height: '58px', margin: '0px 8px' }}></span>
                  <span className="Skeleton-root Skeleton-text Skeleton-pulse" style={{ height: '58px', margin: '0px 8px' }}></span>
                  <br></br>
                  <br></br>
                  <span className="Skeleton-root Skeleton-text Skeleton-pulse" style={{ height: '58px', margin: '0px 8px' }}></span>
                  <span className="Skeleton-root Skeleton-text Skeleton-pulse" style={{ height: '58px', margin: '0px 8px' }}></span>
                  <span className="Skeleton-root Skeleton-text Skeleton-pulse" style={{ height: '58px', margin: '0px 8px' }}></span>
                  <br></br>
                  <br></br>
                  <span className="Skeleton-root Skeleton-text Skeleton-pulse" style={{ height: '58px', margin: '0px 8px' }}></span>
                  <span className="Skeleton-root Skeleton-text Skeleton-pulse" style={{ height: '58px', margin: '0px 8px' }}></span>
                  <span className="Skeleton-root Skeleton-text Skeleton-pulse" style={{ height: '58px', margin: '0px 8px' }}></span>
                </div>
              )}
            
          </ul>
          }
       
      </div>
    </div>
  
  );

}
