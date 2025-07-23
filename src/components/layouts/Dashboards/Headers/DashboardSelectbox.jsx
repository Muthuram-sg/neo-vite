import React,{useState,useEffect,useRef,forwardRef,useImperativeHandle} from 'react';
import Standard from 'assets/neo_icons/Menu/Standard.svg?react';
import Custom from 'assets/neo_icons/Menu/Custom.svg?react';
import { useTranslation } from 'react-i18next';
import Typography from "components/Core/Typography/TypographyNDL";
import { useParams,useNavigate } from "react-router-dom";

// Icons
import Edit from 'assets/neo_icons/Menu/ActionEdit.svg?react'; 
// Recoil packages
import { useRecoilState } from 'recoil';
import { selectedPlant,userData,currentDashboard,dashboardEditMode,currentDashboardSkeleton,defaultDashboard,currentUserRole , ErrorPage,SelectedDashboardPage, goLiveData,VisibleModuleAccess} from "recoilStore/atoms"; // Recoil variables
// core component
import Button from 'components/Core/ButtonNDL';
// use hooks
import useDashboardList from '../hooks/useGetDashboardList';
import DashboardForm from './DashboardModal';
import useCurrentDashboard from '../hooks/useSetCurrentDashboard';
import useToolLife from "components/layouts/Settings/ToolLifeMonitoring/hooks/useToolLife.jsx"
// import useGetSubModules from "components/app/Hooks/useGetSubModules.jsx"
import useGetOptixAssertOption from 'components/layouts/Reports/hooks/useGetOptixAssertOption.jsx';
import Breadcrumbs from 'components/Core/Bredcrumbs/BredCrumbsNDL' 


const DashboardSelectbox= forwardRef((props, ref) => {
    // state variables
    const [headPlant] = useRecoilState(selectedPlant);
    const navigate = useNavigate();
    const [userDetails] = useRecoilState(userData);  
    const [selectedDashboard,setSelectedDashboard] = useRecoilState(currentDashboard)  
    const [matchingSubModules, setMatchingSubModules] = useState([]);
    const [,setSelectedDashboardSkeleton] = useRecoilState(currentDashboardSkeleton);
    

    const [DashboardSelectlist,setDashboardSelectlist] = useState([]);
    const [editMode,setEditMode] = useRecoilState(dashboardEditMode);
    const [selectedDashboardPage,setSelectedDashboardPage] = useRecoilState(SelectedDashboardPage)
    const [DefaultDashboardID, setDefaultDashboard] = useRecoilState(defaultDashboard);
    const [currUserRole] = useRecoilState(currentUserRole);
    const [currAccessDashBoard] = useRecoilState(VisibleModuleAccess);
    const [OptixAssertOption, setOptixAssertOption] = useState([])
    const { GetOptixAssertOptionLoading, GetOptixAssertOptionData, GetOptixAssertOptionError, getGetOptixAssertOption } = useGetOptixAssertOption()
    const [,setEnabledelete]=useState()
    const { ToolLifeLoading, ToolLifeData, ToolLifeError, getToolLife } = useToolLife(); 
    const {  DashboardListLoading, DashboardListData, DashboardListError, getDashboardList } = useDashboardList();
    const {  CurrentDashboardLoading, CurrentDashboardData, CurrentDashboardError, getCurrentDashboard } = useCurrentDashboard();
    const [ newDashBoardId,setnewDashBoardId] = useState('')
    const [,setErrorPage] = useRecoilState(ErrorPage)
    const  {moduleName,subModule1} = useParams();

    const [,setdashboardlistloader] = useState(true)
    const formRef = useRef()
    const {t} = useTranslation(); 
    const [currentDashName,setcurrentDashName] = useState('')

  const listArr = [{ index: 0, name: "Dashboard" }, { index: 1, name:currentDashName }]

    



    useEffect(() => {
        const subModules = currAccessDashBoard.reportSubmodelAccess
          .filter((x) => x.sub_module_id && x.is_visible)
          .map((x) => x.sub_module_id); 
      
        setMatchingSubModules(subModules);
      }, [currAccessDashBoard]);


     // It triggers while changing line
     useEffect(()=>{ 
       
            getDashboardList(headPlant.id,userDetails.id)
            setnewDashBoardId('')
        
       
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[headPlant.id ])

    useEffect(() => {
        if (!GetOptixAssertOptionLoading && GetOptixAssertOptionData && !GetOptixAssertOptionError) {
          setOptixAssertOption(GetOptixAssertOptionData)
 
        }
    
      }, [GetOptixAssertOptionLoading, GetOptixAssertOptionData, GetOptixAssertOptionError])

      useEffect(() => {
        getGetOptixAssertOption(21, headPlant.id)
      
      }, [headPlant])
    useEffect(()=>{
        if(moduleName !== 'production' && moduleName !== 'dryer' && moduleName !== 'cms' && moduleName !== 'connectivity' && moduleName !== 'contract' && moduleName !== 'oee' && moduleName !== 'custom' && moduleName !== 'energy' && moduleName !== 'BI'){
            let selectedDashboard = localStorage.getItem("selectedDashboard")
            if (selectedDashboard) {
                let data = JSON.parse(selectedDashboard)
        // console.log(data && data[0].id,"default3")
            if(data && data[0].id){
                setDefaultDashboard(data && data[0].id)
                setSelectedDashboard(data)

            }
        }
        }
      
    },[DefaultDashboardID,moduleName])
    
    // It triggers whild dashboard list updates
    useEffect(()=>{
        try{
            if(!DashboardListError && !DashboardListLoading && DashboardListData){ 
                    let standard = [];
                    let custom = [];
                    if(headPlant.type === '2'){
                        standard = DashboardListData.length > 0 && DashboardListData[0].dashboardList ?DashboardListData[0].dashboardList.filter(x=>!x.custome_dashboard && x.id !== '7e68b1cc-d842-4ea1-ab97-c425f4ac7be2'):[];
              
                        custom = DashboardListData.length > 0 && DashboardListData[0].dashboardList?DashboardListData[0].dashboardList.filter(x=>x.custome_dashboard && (x.userByCreatedBy.id === userDetails.id || (x.standard === true?x.user_access_list&&x.user_access_list.length>0?x.user_access_list.includes(userDetails.id):true:false))):[]; 
                    }else{
                        standard = (DashboardListData.length > 0 && DashboardListData[0].dashboardList) ? (DashboardListData[0].dashboardList.filter(x=>x.id === '7e68b1cc-d842-4ea1-ab97-c425f4ac7be2')) : [];
                        custom = [];
                    }
                    
              
                    const currentDashboards = DashboardListData[1]?DashboardListData[1].currentDashboard[0]:null;
                      
                    if(currentDashboards?.dashboard || moduleName){
                        let dashboardid = ""; 
                        if(moduleName){
                            // console.log(moduleName,"moduleName",subModule1)
                            if(moduleName === 'Electricity Price' || moduleName === 'Co2 Emission' || moduleName === 'Energy Consumption'){
                                dashboardid = "cc5b58c2-7f8d-4183-9a8a-26ce1d7754cf"
                            }else if(moduleName === 'oee'){
                                dashboardid = "0cb34336-2431-44fd-94b1-cc8d85dec537"
                            }else if(moduleName === 'production'){
                                dashboardid = "cdf940e6-9445-4d3d-a175-22caa159d7a0"
                            } else if (moduleName === 'dryer'){
                                dashboardid = "8c1bf778-c689-4bd4-a577-8008eb3a0547"
                            }
                            else if(moduleName === 'contract'){
                                dashboardid = "85b5b3c1-476b-4a4d-95a4-67631c2ea013"
                            }
                            else if(moduleName === 'connectivity'){
                                dashboardid = "a01c23c0-2fbb-4a32-b42a-a84b01b302cb"
                            }
                            else if(moduleName === 'cms'){
                                dashboardid = "00e6ca54-8a94-414a-80e4-69cd3752647c"
                            }
                            else if(moduleName === 'energy'){
                                dashboardid = "cc5b58c2-7f8d-4183-9a8a-26ce1d7754cf"
                            }
                            else if(moduleName === 'BI'){
                                dashboardid = "7e68b1cc-d842-4ea1-ab97-c425f4ac7be2"
                            }
                            else if(moduleName === 'tool monitoring'){
                                dashboardid = "f53f8175-96f4-4eb7-a7d3-5c15185b47e9"
                            }
                            else if(moduleName === 'custom'){
                                 if(subModule1){
                                    let filteredCustomID = custom.filter(obj => obj.id === subModule1)
                                    if(filteredCustomID.length > 0){
                                      
                                        dashboardid = filteredCustomID[0].id
                                    }
                                    else{
                                          navigate('/AccessCard')
                                    }
                                   
                                 }
                            }

                            else if(moduleName){
                                setErrorPage(true)
                            }
                           else{
                                dashboardid = currentDashboards.dashboard.id
                            } 
                        }else { 
                            dashboardid =newDashBoardId ? newDashBoardId : currentDashboards.dashboard.id  
                            
                        }
                        // console.log(dashboardid,"dashboardid")
                        const dashboard = DashboardListData[0].dashboardList.filter(x=>x.id === dashboardid);
                        let editAccess  = false
                        if((dashboard[0].userByCreatedBy.id === userDetails.id )||( currUserRole.id === 2)){
                            editAccess = true
                        }
                        props.editAccess(editAccess) 
                        if((dashboardid && dashboardid === "85b5b3c1-476b-4a4d-95a4-67631c2ea013" && headPlant && headPlant.node &&  headPlant.node.energy_contract)){
                            if(headPlant.node.energy_contract.IsContract === false){
        // console.log("default4")

                                setDefaultDashboard('')
                                // console.log("dashboardDefaultIDclean1")
                                setSelectedDashboard([])  
                            }else{
        // console.log(dashboardid,"default5")

                                setDefaultDashboard(dashboardid)
                                // setSelectedDashboardPage({dashboard[0]})
                                // console.log(dashboard,"dashboardid1stElse")
                                if(moduleName){
                                    setSelectedDashboardPage({
                                        id: dashboard[0].id,       
                                        name: dashboard[0].name,
                                        custome_dashboard: dashboard[0].custome_dashboard,
                                        title: dashboard[0].name,
                                        isStandard:!dashboard[0].custome_dashboard
                                      });
                                    //   setSelectedDashboard(dashboard)
                                }
                                changeDashboard(dashboard);
                            }
    
                        }else{
        // console.log(dashboardid,"default6")

                            setDefaultDashboard(dashboardid)
                         
                                if(moduleName){
                        
                                    setSelectedDashboardPage({
                                        id: dashboard[0].id,       
                                        name: dashboard[0].name,
                                        custome_dashboard: dashboard[0].custome_dashboard,
                                        title: dashboard[0].name,
                                        isStandard:!dashboard[0].custome_dashboard
                                      });
                                  
                                }
                                  changeDashboard(dashboard);
                           
                        }
                        
                    } else{
                        const dashboard = DashboardListData[0].dashboardList.filter(x=>x.id === newDashBoardId); 
                        if(dashboard.length > 0){
                            let iscurrUserRole = currUserRole.id === 2 ? true : false
                            const editAccess = dashboard[0].userByCreatedBy.id === userDetails.id ?true:iscurrUserRole;
                            props.editAccess(editAccess)
              

                            changeDashboard(dashboard)
                        }else{
                    
                            setSelectedDashboard([])
                        }
                    }
                    if(OptixAssertOption.length > 0){
                        standard=standard
                    }
                    else{
                        standard = standard.filter(x=>x.id !== "3e0cd86a-191c-4b69-b467-22c3ff433419")
                    }
                     
                    if (matchingSubModules.length > 0) {
                        standard = standard
                          .filter((val) => matchingSubModules.includes(val.id))
                          .map((val) => {
                            if (!val.custome_dashboard) {
                              return {
                                ...val,
                                updated_by: '',
                                updated_ts: '',
                                icon: Standard,
                                RightIcon: true,
                              };
                            }
                            return val;
                          });
                      }

                  
                      if (headPlant?.node?.energy_contract) {
                        if (headPlant.node.energy_contract.IsContract === false) {
                            standard = standard.filter(x => x.id !== "85b5b3c1-476b-4a4d-95a4-67631c2ea013");
                        }
                    }else{
                        standard = standard.filter(x=>x.id !== "85b5b3c1-476b-4a4d-95a4-67631c2ea013")
                        
                    }

                    let DashboardDropdown = [...standard,...custom.map(m=>{return{...m,icon: Custom,RightIcon:true,updated_by:t("UpdatedBy")+' '+m.updated_by}})]
                    setDashboardSelectlist(DashboardDropdown)
                    // console.log(selectedDashboardPage,'selectedDashboardPage')
                    getToolLife(headPlant.id)

                    // console.log(DashboardDropdown,"DashboardDropdownDashboardDropdown")
                  
            }        
        }catch(err){
            console.log('error',err);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[DashboardListData,OptixAssertOption,matchingSubModules])
    useEffect(() => {
        if (
            selectedDashboardPage &&
            selectedDashboardPage.id &&
            DashboardSelectlist.length > 0 &&
            selectedDashboardPage.name !== 'Dashboard'
        ) {
            const selectedDashboard = DashboardSelectlist.find(x => x.id === selectedDashboardPage.id);
            if (selectedDashboard && selectedDashboard.name) {
                setcurrentDashName(selectedDashboard.name);
            }
        }
    }, [selectedDashboardPage, DashboardSelectlist]);



    useEffect(()=>{
        if(!ToolLifeLoading && ToolLifeData && !ToolLifeError ){
            if((ToolLifeData.length === 0) && DashboardSelectlist.length > 0 ){

                setDashboardSelectlist(DashboardSelectlist.filter(f=>  f.id !== 'f53f8175-96f4-4eb7-a7d3-5c15185b47e9'))
                setdashboardlistloader(false)
 
                if(DefaultDashboardID === 'f53f8175-96f4-4eb7-a7d3-5c15185b47e9'){
                    setDefaultDashboard('')
   

                    setSelectedDashboard([])  
                }
            }
               setdashboardlistloader(false)


        }
    },[ToolLifeLoading, ToolLifeData, ToolLifeError])


    useEffect(()=>{
        if(!CurrentDashboardLoading && !CurrentDashboardError && CurrentDashboardData){ 
 

            let obj = {layout:{},dashboard:{}};
            if(CurrentDashboardData.dashboard){ 
                if(DashboardSelectlist.findIndex(das=>das.id === CurrentDashboardData.dashboard.id)>=0){
                    obj = {layout: CurrentDashboardData.dashboard.layout,dashboard: CurrentDashboardData.dashboard.dashboard}; 

                   
                    setDefaultDashboard(CurrentDashboardData.dashboard.id)

                }                
            }

            setSelectedDashboardSkeleton(obj); 
            localStorage.setItem('actual_layout',JSON.stringify(obj));
        }else{

            setSelectedDashboardSkeleton({});  
            if(selectedDashboard && selectedDashboard.length === 0 && !moduleName){


                setSelectedDashboard([]) 

            }
            
            localStorage.setItem('actual_layout',JSON.stringify({}));
        }

    },[CurrentDashboardData,CurrentDashboardError])

    useEffect(()=>{
        if(selectedDashboard && selectedDashboard.length > 0){               
            setSelectedDashboardSkeleton({});
            let selectedDashObj = {
                line_id: headPlant.id,
                user_id: userDetails.id,
                dash_id: selectedDashboard[0].id
            }
            
            getCurrentDashboard(selectedDashObj)
        }

    },[selectedDashboard])

    const changeDashboard = (dashboard) =>{
        let editAccess  = false
        if((dashboard[0].userByCreatedBy.id === userDetails.id) ||(currUserRole.id === 2)){
            editAccess = true
        }
        const enableDelete =dashboard[0].userByCreatedBy.id===userDetails.id ?true:false
        setEnabledelete(enableDelete)
        props.editAccess(editAccess)
        setSelectedDashboard(dashboard);
        setEditMode(false); 
        // console.log(dashboard[0].id,"default9")

        setDefaultDashboard(dashboard[0].id)
    }
   


    
    // enables a create dashboard modal
  
    const editDashboard = () =>{ formRef.current.openDialog('edit') }
  

    useImperativeHandle(ref, () => ({

        updateSelectedDashboard:(headplant,userid,id)=>{ 
            getDashboardList(headplant,userid);
            setnewDashBoardId(id)
        }
      }));


      const handleActiveIndex=(index)=>{
        if(index === 0 && !editMode){
            // console.log("homePage")
            setSelectedDashboardPage({id:'My Dashboard',custome_dashboard:false,name:"Dashboard",title:"Dashboard"})
            props.handleTriggerDashboard()
            if(props.isFullScreen){
                props.toggleFullScreen()
            }
        }

      }
    return(
    <React.Fragment>
                <div className='flex items-center gap-4'>
                
{
    selectedDashboardPage.custome_dashboard && !editMode  ? 
<Breadcrumbs breadcrump={listArr} onActive={handleActiveIndex} />
:
<Typography variant="heading-02-xs">
                     {selectedDashboardPage.name === 'Dashboard' ? "My Dashboard" : selectedDashboardPage.name}
                   </Typography>

}
{
                    editMode && (
                        <Button id='dashboard-edit' type={"ghost"} icon={Edit} onClick={editDashboard}></Button>                
                    )
                } 

    
                    

           
              
                </div>
               
               
            
        <DashboardForm UserOption={props.UserOption} handleSnackbar={props.handleSnackbar} ref={formRef} 
        getDashboardList={(headplant,userid,id)=>{getDashboardList(headplant,userid);setnewDashBoardId(id)}}
        />
    </React.Fragment>
    )
});
export default DashboardSelectbox;