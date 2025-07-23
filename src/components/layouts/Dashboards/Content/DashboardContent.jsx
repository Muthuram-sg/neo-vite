import React,{useEffect,forwardRef,useImperativeHandle, useState, useRef} from 'react';
import { Responsive, WidthProvider } from "react-grid-layout";  
import { useTranslation } from 'react-i18next';
import Typography from 'components/Core/Typography/TypographyNDL';
import { useRecoilState } from 'recoil';
import { dashboardEditMode,currentDashboardSkeleton,currentDashboard,themeMode,selectedPlant,InstrumentsMapList,
    CategoryGroup,YearOption,ProductName,averageType,NodeNames,EnergyRange,
    WaterfallNodes,
    ActivityNodes,
    ProductYear,
    userData,
    ActivityYear,
    SelectedDashboardPage,
    ProductNames,
    ActivityProductNames,
    EnergyProductNames,
    EnergyBtGroup, 
    defaultDashboard,
    currentUserRole,
    EnergySQMTBtGroup,
    metricsList,
    EnableRearrange, 
    user,DashBoardEditAccess,
    playOption,goLiveData,DashBoardHeaderFilter
} from 'recoilStore/atoms';

import DashboardCard from './DashboardCard';
import ProductionDashboard from './standard/ProductionDashboard';
import DryerDashboard from './standard/DryerDashboard';
import CmsDashboard from './standard/CmsDashboard';
import useDashboardList from "components/layouts/Dashboards/hooks/useGetDashboardList.jsx"
import OEEDashboard from './standard/OEEDashboard';
import EnergyTabs from './standard/EnergyDashboard/EnergyTabs';
import DowntimeDashboard from './standard/DowntimeDashboard';
import { useParams, useOutletContext } from "react-router-dom";

import QualityDashboard from './standard/QualityDashboard'; 
import useInstrmentMapList from "Hooks/useInstrumentMapList";
import DashConfigLight from "assets/Add Widget.svg?react"; 
import DashConfigDark from "assets/Add Widget - Dark.svg?react"; 
import "react-grid-layout/css/styles.css";

import SummaryDashboard from './standard/SummaryDashboard';

import ConnectivityDashboard from './standard/ConnectivityDashboard/index';
import ToolLife from 'components/layouts/Dashboards/ToolLife/index.jsx'
import DefectAnalytics from "components/layouts/Dashboards/DefectAnalytics/index.jsx"
import PowerDeliveryMonitoring from './standard/PowerDeliveryMonitoring';
import useAlertList from 'components/layouts/Dashboards/Content/standard/hooks/useAlertList'
import LoadingScreenNDL from "LoadingScreenNDL"

import CustomTileViewDashboard from './CustomTileviewDashboard';
import useGetStarDashBoard from 'components/layouts/Dashboards/Content/standard/hooks/starhooks/useGetStarDash.jsx';
import useIncertStarDashBoard from 'components/layouts/Dashboards/Content/standard/hooks/starhooks/useIncertStarDash';
import useDeleteStarDashBoard from 'components/layouts/Dashboards/Content/standard/hooks/starhooks/useDeleteStarDash';
import useUpdateLastOpened from 'components/layouts/Dashboards/Content/standard/hooks/starhooks/useUpdateLastOpened'
import DashboardForm from '../Headers/DashboardModal';
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine.jsx";


import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);
const DashboardContent = forwardRef((props,ref)=>{
    const [sidebaropen] = useOutletContext();
      const [curruser] = useRecoilState(user);  
    const [rearrange] = useRecoilState(EnableRearrange);
    const [selectedDashboardSkeleton,setSelectedDashboard] = useRecoilState(currentDashboardSkeleton);
    const [,setselectedDashboard] = useRecoilState(currentDashboard)   
    const [curTheme] = useRecoilState(themeMode);
    const [headPlant] = useRecoilState(selectedPlant);
    const [dashboardDropdown,setdashboardDropdown] = useState([])
    const [editMode,setEditMode] = useRecoilState(dashboardEditMode);
   
    const [,setEnabledelete]=useState()
    const [DashboardHeaderFilter] = useRecoilState(DashBoardHeaderFilter)
    
    const { t } = useTranslation() 
    const [selectedDashboardPage,setselectedDashboardPage] = useRecoilState(SelectedDashboardPage)
    const { DashboardListLoading, DashboardListData, DashboardListError, getDashboardList } = useDashboardList();
    const [userdetails] = useRecoilState(userData);
    const [, setDefaultDashboard] = useRecoilState(defaultDashboard);
    const  {moduleName} = useParams();
    const [cardrefresh,setcardrefresh] = useState(false);
    const [,setMapInstrument] = useRecoilState(InstrumentsMapList); 
    const { InstrmentMapListLoading, InstrmentMapListdata, InstrmentMapListerror, getInstrmentMapList } = useInstrmentMapList();
    const { alertlistLoading, alertlistdata, alertlisterror, getAlertList } = useAlertList();
    const {InsertStarDashboardLoading, InsertStarDashboardData, InsertStarDashboardError, getInsertStarDashboard }=useIncertStarDashBoard()
    const {  DeleteStarDashboardLoading, DeleteStarDashboardData, DeleteStarDashboardError, getDeleteStarDashboard } = useDeleteStarDashBoard();
    const { StarDashboardLoading, StarDashboardData, StarDashboardError, getStarDashboard } = useGetStarDashBoard();
   const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
    
    const {getLastOpened} = useUpdateLastOpened()
    const [starLoaderId, setstarLoaderId] = useState(null)
    const  [starDashdetails,setStarDashdetails] = useState([])
    const [AlertList,setAlertList] = useState([])
    const [MetricList] = useRecoilState(metricsList);
    const [ ,setnewDashBoardId] = useState('') 
    const [typelist, setTypelist] = useState([])
    const [currUserRole] = useRecoilState(currentUserRole);
    const [prodnames] = useRecoilState(ProductName) 
    const [year] = useRecoilState(YearOption)
    const [averagetype] = useRecoilState(averageType)
    const [category] = useRecoilState(CategoryGroup) 
 
    const [nodenames] = useRecoilState(NodeNames)   
    const [energyrange] = useRecoilState(EnergyRange) 
    const [matchingSubModules] = useState([]);
    const [waterfallnodenames, ] = useRecoilState(WaterfallNodes)
    const [activitynodenames, ] = useRecoilState(ActivityNodes)
    const [productyear] = useRecoilState(ProductYear)
    const [activityyear] = useRecoilState(ActivityYear)
    const [productprodnames ] = useRecoilState(ProductNames)
    const [activityprodnames] = useRecoilState(ActivityProductNames)
    const [energyprodnames ] = useRecoilState(EnergyProductNames)
    const [energybtGroupValue] = useRecoilState(EnergyBtGroup);
    const [energysqmtbtGroupValue] = useRecoilState(EnergySQMTBtGroup);

    const [,setEditAccess] = useRecoilState(DashBoardEditAccess)
     const [,setPlayMode]  = useRecoilState(playOption);
        const [ ,setLive] = useRecoilState(goLiveData);
        const formRef = useRef()

        

    // const dashboardcard = useRef()
    const [loader] = useState(false) 
    const [layoutShow,setlayoutShow] = useState(true)
    const [userDefaultCustomDashBoard,setuserDefaultCustomDashBoard] = useState([])
    const [isCustomDashId,setisCustomDashId] = useState([])
        const [UserOption, setUserOption] = useState([])
    
    const [customLoader,setcustomLoader] = useState(false)


    const categories = [{ "id": 1, "category": "Hourly" }, { "id": 2, "category": "Daily" }, { "id": 3, "category": "Weekly" }, { "id": 4, "category": "Monthly" }]
    useImperativeHandle(ref,()=>({
        Refresh: (e)=>setcardrefresh(true),
        getUpdatedDashBoard:()=> getDashboardList(headPlant.id,userdetails.id)
        // goLive: (e)=>dashboardcard.current.goLive()
    }))
    useEffect(()=>{
      // setLoader(true)
        setcustomLoader(true)
        getInstrmentMapList(headPlant.id)
        getAlertList(headPlant.id)
        getDashboardList(headPlant.id,userdetails.id,true)
        getStarDashboard({line_id:headPlant.id,user_id:curruser.id})
        getUsersListForLine(headPlant.id)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[headPlant])

    useEffect(() => {
      if( !StarDashboardLoading &&  StarDashboardData && !StarDashboardError){
        if(StarDashboardData.length > 0){
          setStarDashdetails(StarDashboardData.map(x=>x.dashboard_id))
        } else {
          setStarDashdetails([])
        }

      }
    },[ StarDashboardLoading, StarDashboardData, StarDashboardError])

    useEffect(()=>{
      if(!InsertStarDashboardLoading &&  InsertStarDashboardData &&  !InsertStarDashboardError){
        getStarDashboard({line_id:headPlant.id,user_id:curruser.id})
      }
    },[InsertStarDashboardLoading, InsertStarDashboardData, InsertStarDashboardError])

    useEffect(()=>{
      if(!DeleteStarDashboardLoading &&  DeleteStarDashboardData &&  !DeleteStarDashboardError){
        getStarDashboard({line_id:headPlant.id,user_id:curruser.id})
        // getDashboardList(headPlant.id,userdetails.id,true)
      }
    },[DeleteStarDashboardLoading, DeleteStarDashboardData, DeleteStarDashboardError])

  useEffect(() => {
    try {
        if (!DashboardListError && !DashboardListLoading && DashboardListData) {
          // console.log(DashboardListData,"DashboardListData")
            let custom = [];
            if (headPlant.type === '2') {
                custom = DashboardListData.length > 0 && DashboardListData[0].dashboardList
                    ? DashboardListData[0].dashboardList.filter(
                        x => x.custome_dashboard && 
                        (x.userByCreatedBy.id === userdetails.id || 
                        (x.standard === true 
                            ? x.user_access_list && x.user_access_list.length > 0 
                                ? x.user_access_list.includes(userdetails.id) 
                                : true 
                            : false))
                    ) 
                    : [];
                    if(custom.length> 0){
                      custom = custom.map((val) => {
                        return ({
                          ...val,
                          accessType:val.standard === true && val.custome_dashboard === true && !val.user_access_list ? "Public" : val.standard === false && val.custome_dashboard === true ? "Private" :"Shared",
                          stared:starDashdetails.includes(val.id)
                        })
                      })
                      // console.log('tilelist',custom)

                    }
            }


               if (DashboardHeaderFilter.filter === 'stared') {
                    custom = custom.filter(x => x.stared === true);
                  } else if (DashboardHeaderFilter.filter === 'onlyme') {
                    custom = custom.filter(x => x.userByCreatedBy.id === curruser.id);
                  }
              
                  // Apply sorting
                  if (DashboardHeaderFilter.Sort === 'a-z') {
                    custom = custom.sort((a, b) => a.name.localeCompare(b.name));
                  } else if (DashboardHeaderFilter.Sort === 'z-a') {
                    custom = custom.sort((a, b) => b.name.localeCompare(a.name));
                  } else if (DashboardHeaderFilter.Sort === 'frequently') {
                    custom = custom.sort((a, b) => new Date(b.last_opened) - new Date(a.last_opened));
                  } else if (DashboardHeaderFilter.Sort === 'rarely') {
                    custom = custom.sort((a, b) => new Date(a.last_opened) - new Date(b.last_opened));
                  }
            
                  if(DashboardHeaderFilter.Search && DashboardHeaderFilter.Search.length > 0){
                    custom = custom.filter((content) =>
                      content.name.toLowerCase().includes(DashboardHeaderFilter.Search.toLowerCase())
                    )
                  }
            // Debugging `custom`
             setdashboardDropdown(custom)
             setisCustomDashId(custom.map(x=>x.id))
            //  console.log(DashboardListData.length > 1 ? DashboardListData[1].currentDashboard : [],"DashboardListData.length > 1 ? DashboardListData[1].currentDashboard : []")
             if(DashboardListData.length > 1 && DashboardListData[1].isinitial){
              setuserDefaultCustomDashBoard(DashboardListData.length > 1 ? DashboardListData[1].currentDashboard : [])
             }
              setcustomLoader(false)
             

        }
    } catch (err) {
        console.log('error', err);
        setcustomLoader(false)
        
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [DashboardListData, matchingSubModules,starDashdetails,DashboardHeaderFilter]);

useEffect(()=>{
  if(userDefaultCustomDashBoard.length > 0  && dashboardDropdown.length > 0 && !moduleName){
    if(isCustomDashId.includes(userDefaultCustomDashBoard[0].dashboard.id)){
    handleCustomDashboardOpen(userDefaultCustomDashBoard[0].dashboard.id)
    }
  }
},[userDefaultCustomDashBoard])

    useEffect(()=>{
      setlayoutShow(false)
      setTimeout(()=>{
        setlayoutShow(true)
      },300)
    },[sidebaropen])

    useEffect(() => {
        if ((MetricList)) {
          let typelistArr = []
            // eslint-disable-next-line array-callback-return
            MetricList.map((val) => {
                typelistArr.push({ "metric_name": val.name, "type": val.metric_type.type, "id": val.metric_type.id })
            }) 
            setTypelist(typelistArr)   
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [MetricList])

    useEffect(()=>{
        if(!alertlistLoading && !alertlisterror && alertlistdata ){
          setAlertList(alertlistdata)
        } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[alertlistdata])
    useEffect(()=>{
        if(!InstrmentMapListLoading && !InstrmentMapListerror && InstrmentMapListdata ){
            setMapInstrument(InstrmentMapListdata)
        }
        else{
            setMapInstrument([])
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[InstrmentMapListdata])




     useEffect(() => {
            if (!UsersListForLineLoading && UsersListForLineData && !UsersListForLineError) {
              let userOption = []
                userOption = UsersListForLineData.map(x => {
                    let id = x.user_id
                    let format = x.userByUserId.name + " (" + x.userByUserId.sgid + ")"
                    return Object.assign(x, { "id": id, "name": format });
                })
                // console.log(userOption,"userOption")
                setUserOption(userOption)
            }
        }, [UsersListForLineLoading, UsersListForLineData, UsersListForLineError])
    const overallStandardDashboardList = {
        "0cb34336-2431-44fd-94b1-cc8d85dec537": <OEEDashboard />,
        "cdf940e6-9445-4d3d-a175-22caa159d7a0": <ProductionDashboard />,
        "8c1bf778-c689-4bd4-a577-8008eb3a0547": <DryerDashboard />,
        "cc5b58c2-7f8d-4183-9a8a-26ce1d7754cf": 
        <EnergyTabs 
            year={year}
            productyear={productyear}
            activityyear={activityyear}
            products={prodnames.map(val => val.id)}
            date={energyrange.date} 
            datetocompare={energyrange.compare}
            nodes={nodenames.map(val => val.id)}
            selectedproducts={prodnames}
            headPlant={headPlant}
            selectedcategory={category}
            categories={categories}
            averagetype={averagetype}
            prodproducts={productprodnames.map(val => val.id)}
            activityproducts={activityprodnames.map(val => val.id)}
            selectedprodproducts={productprodnames}
            selectedactivityproducts={activityprodnames}
            energyproducts={energyprodnames.map(val => val.id)}
            selectedenergyproducts={energyprodnames}
            energybtGroupValue={energybtGroupValue}
            energysqmtbtGroupValue={energysqmtbtGroupValue}
            activitynodes={activitynodenames.map(val => val.id)}
            waterfallnodes={waterfallnodenames.map(val => val.id)}
        />,
        "ab0cb71d-36b0-4ac2-9e3d-43e01f55714d" : <DowntimeDashboard />,
        "6f3173c7-f884-4535-b0b0-4d6a4b97f863" : <QualityDashboard />,
        "7e68b1cc-d842-4ea1-ab97-c425f4ac7be2" : <SummaryDashboard/>,
        "00e6ca54-8a94-414a-80e4-69cd3752647c" : <CmsDashboard selectedOfflineType={props.selectedOfflineType} />,
        "a01c23c0-2fbb-4a32-b42a-a84b01b302cb" : <ConnectivityDashboard/>,
        "85b5b3c1-476b-4a4d-95a4-67631c2ea013"  : <PowerDeliveryMonitoring/>,
       "f53f8175-96f4-4eb7-a7d3-5c15185b47e9"  : <ToolLife/>,
        "3e0cd86a-191c-4b69-b467-22c3ff433419" : <DefectAnalytics/>,
      }
   
      const changeDashboard = (dashboard) =>{
        let editAccess  = false
        if((dashboard[0].userByCreatedBy.id === userdetails.id) ||(currUserRole.id === 2)){
            editAccess = true
        }
        const enableDelete =dashboard[0].userByCreatedBy.id===userdetails.id ?true:false
        setEnabledelete(enableDelete)
        setEditAccess(editAccess)
        setSelectedDashboard(dashboard[0]);
        setEditMode(false); 
        // console.log(dashboard[0].id,"default2")

        setDefaultDashboard(dashboard[0].id)
        setselectedDashboardPage(dashboard[0])
    }

    const onLayoutChange = (layout,layouts) =>{ 

        try{

            // let dellayout = layout.map((val,e)=>{
            //     if(selectedDashboardSkeleton.layout){
            //         return {...val, 
            //             h: selectedDashboardSkeleton.layout.lg[e].h,
            //             w: selectedDashboardSkeleton.layout.lg[e].w,
            //             x: selectedDashboardSkeleton.layout.lg[e].x,
            //             y: selectedDashboardSkeleton.layout.lg[e].y,
            //             i: selectedDashboardSkeleton.layout.lg[e].i,

            //         }
            //     }else{
            //         return val
            //     }
                
            // })
            const altered = layout.map(x=>{
                return x;
            })
            let newlayout = {
                "lg": altered, 
                "md": altered,
                "sm": altered,
                "xs": altered,
            }
            let obj = {layout: newlayout,dashboard:selectedDashboardSkeleton.dashboard};
            localStorage.setItem('currentLayout',JSON.stringify(newlayout));
            setSelectedDashboard(obj)
        }catch(err){
            console.log('err',err);
        }
    }
  
      
      
  const handleTrigerStar=(id,isStar)=>{
    let body={
      line_id:headPlant.id,
      user_id:curruser.id,
      dashboard_id:id
    }
    setstarLoaderId(id)
    if(isStar){
      getDeleteStarDashboard({id:id})
      // getDashboardList(headPlant.id,userdetails.id,true)
    }else{
      getInsertStarDashboard(body)
    }


  }


  const handleCustomDashboardOpen = (id) => {
    getLastOpened(id)
    handleDashboardChange(id)
    setcustomLoader(false)
  }

  const handleDashboardChange = (e) =>{
    localStorage.setItem('selectedDashboard', '');

    try{ 
        const id =  e; 
        const dashboard = DashboardListData[0].dashboardList.filter(x=>x.id === id);  
        setDefaultDashboard(id) 
        setlayoutShow(true)
        if(dashboard && dashboard.length > 0){ 

           changeDashboard(dashboard)
           setselectedDashboard(dashboard)
        }
        setLive(false)
        setPlayMode(false)
    }catch(err){
        console.log('dashboard select error',err)
    }        
   
}





 const handleEditDashboard=(obj)=>{
  formRef.current.openDialog('edit',obj)
 }
 const handleDeleteDashboard=(obj)=>{
  // console.log("triggerDelete")
  formRef.current.openDialog("delete",obj)
  setDefaultDashboard(obj.id)
 }

//  console.log(selectedDashboardSkeleton,"selectedDashboardSkeleton2",selectedDashboardPage)


 
function renderDashboard() {

  if (selectedDashboardPage?.name === "Dashboard") {

    return (
      <div>
        <CustomTileViewDashboard
          DashboardList={dashboardDropdown}
          handleEditOpen={handleEditDashboard}
          InsertStarDashboardLoading={InsertStarDashboardLoading}
          starLoaderId={starLoaderId}
          handleTrigerStar={handleTrigerStar}
          handleCustomDashboardOpen={handleCustomDashboardOpen}
          handleDetele={handleDeleteDashboard}
        
        />
      </div>
    );
  }

  if (selectedDashboardPage?.custome_dashboard ) {


    if (
      selectedDashboardSkeleton &&
      selectedDashboardSkeleton?.dashboard &&
      selectedDashboardSkeleton?.dashboard?.data &&
      Object.keys(selectedDashboardSkeleton?.dashboard?.data)?.length > 0
    ){
          
    
      return (
        <React.Fragment>
        {layoutShow && 
        <ResponsiveGridLayout 
          className="layout"
          layouts={selectedDashboardSkeleton && selectedDashboardSkeleton.layout ? selectedDashboardSkeleton.layout : {}}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} 
          isDraggable={rearrange ? false : editMode}
          // isDraggable={true}

          isResizable={editMode}
          onLayoutChange={onLayoutChange}
          // draggableHandle=".custom-drag-handle"
        >
          
          {selectedDashboardSkeleton && selectedDashboardSkeleton.dashboard && selectedDashboardSkeleton.dashboard.data ? 
         
            Object.keys(selectedDashboardSkeleton.dashboard.data).map((item, i) => 
              <DashboardCard 
                // ref={dashboardcard}
                cardrefresh={cardrefresh} 
                dictkey={item} 
                // key={item} 
                key={i}
                DelKey={i} 
                details={selectedDashboardSkeleton.dashboard.data[item]} 
                cardrefreshoff={() => setcardrefresh(false)} 
                MetricListType={typelist}
                AlertList={AlertList}
                modalOpen={props.modalOpen}
              />
            ) : 
            <></> 
          }
        </ResponsiveGridLayout> }
        </React.Fragment>
      );
    } else if(loader === true) {
      return (
       
          <LoadingScreenNDL />
      
      );
    } else if(selectedDashboardSkeleton && selectedDashboardSkeleton.dashboard && selectedDashboardSkeleton.dashboard.data && Object.keys(selectedDashboardSkeleton.dashboard.data).length === 0) {
      return (
        <React.Fragment>
          <div  style={{ textAlign: "center" }}>
            {curTheme === 'dark' ?  <DashConfigDark />  :  <DashConfigLight />  }
          </div>
          <div style={{ textAlign: "center" }}>                                
            <Typography value={t('Fresh')} variant="heading-02-xs" />
            <br />
            <Typography value={t('ConfigDash')} variant="heading-02-xs" />
          </div>
        </React.Fragment>
      );
    }
  } else if (loader) {
      return (
     
          <LoadingScreenNDL />
     
      );
    } else if (!selectedDashboardPage.isStandard) {
      return (
        <React.Fragment>
          <div  style={{ textAlign: "center" }}>
          {curTheme === 'dark' ?  <DashConfigDark />  :  <DashConfigLight />  }
          </div>
          <div style={{ textAlign: "center" }}>
            <Typography value={t("Fresh")} variant="heading-02-xs" />
            <br />
            <Typography value={t("ConfigDash")} variant="heading-02-xs" />
          </div>
        </React.Fragment>
      );
    }
  

  if (selectedDashboardPage?.id in overallStandardDashboardList) {
 
    return (
      <React.Fragment>
        {overallStandardDashboardList[selectedDashboardPage.id]}
      </React.Fragment>
    );
  }

  return null;
}

              
     
      
      return (
      <React.Fragment>
        {
          customLoader && <LoadingScreenNDL />
        }
      <div className='bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark  min-h-[93vh] h-auto   '>{renderDashboard()}</div>
         <DashboardForm UserOption={UserOption} handleSnackbar={props.handleSnackbar} ref={formRef} 
        getDashboardList={(headplant,userid,id)=>{getDashboardList(headplant,userid);setnewDashBoardId(id)}} />
      </React.Fragment>
    );

})
export default DashboardContent;