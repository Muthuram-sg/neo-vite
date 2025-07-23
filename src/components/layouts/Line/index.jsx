import React, { useState, useEffect } from "react";
import useTheme from "TailwindTheme";
import Typography from 'components/Core/Typography/TypographyNDL'
import Tooltip from "components/Core/ToolTips/TooltipNDL.jsx";
import Grid from 'components/Core/GridNDL'
import { useTranslation } from 'react-i18next'; 
import LinearProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import { useRecoilState } from "recoil";
import { currentPage,oeeAssets, dashBtnGrp, lineAssetArray, lineOption, themeMode,
   FullScreenmode,selectedPlant,drawerMode
} from "recoilStore/atoms";
import LineLight from 'assets/neo_icons/Illustrations/LineIll_light.svg?react';
import LineDark from 'assets/neo_icons/Illustrations/ReportIll_dark.svg?react';
import FullScreenLight from 'assets/neo_icons/Menu/fullscreen.svg?react'; 
import ExitFullScreenLight from 'assets/neo_icons/Menu/exit_fullscreen.svg?react'; 
import RefreshLight from 'assets/neo_icons/Menu/refresh.svg?react'; 
import Alarm from './components/Alarms';
import Production from './components/Production';
import Task from './components/Task'; 
import SelectBox from 'components/Core/DropdownList/DropdownListNDL';
import { FullScreen, useFullScreenHandle } from "react-full-screen"; 
import DatePickerNDL from 'components/Core/DatepickerNDL';  
import useGetAlertList from "./hooks/useGetAlertList";
import useGetOEEAssets from "components/layouts/Reports/hooks/useOEEAssets";

export default function Line() {

    const { t } = useTranslation();
    const [, setCurPage] = useRecoilState(currentPage);
    const [curTheme] = useRecoilState(themeMode);
    const [curLineOption, setCurLineOption] = useRecoilState(lineOption);
    const [Draweropen] = useRecoilState(drawerMode);
    const [, setAssetArray] = useRecoilState(lineAssetArray);
    const [assetArrayName, setAssetArrayName] = useState('');
    const [oeeAssetsArray] = useRecoilState(oeeAssets);
    const [assetMap, setAssetMap] = useState([]);
    const [timeRange, setTimeRange] = useRecoilState(dashBtnGrp);
    const [isFullScreen, setIsFullScreen] = useRecoilState(FullScreenmode);
    const handle = useFullScreenHandle();
    const [headPlant] = useRecoilState(selectedPlant); 
    const [selectedDateStart, setSelectedDateStart] = useState(new Date());
    const [selectedDateEnd, setSelectedDateEnd] = useState(new Date()); 
    const mainTheme = useTheme() 
    const [RefreshData,setRefreshData] = useState(false);
    const [progress,setprogress] = useState(false);
    const { outGetAlertListLoading, outGetAlertListData, outGetAlertListError, getAlertList } = useGetAlertList()
    // const { OEEAssetsLoading, OEEAssetsData, OEEAssetsError, getOEEAssets } = useGetOEEAssets() 
    const Selectline = [
        { id: "Production", title: t('Production') },
        { id: "Alarm", title: t('Alarm') },
        { id: "Tasks", title: t('Tasks') }, 
      ] 

    useEffect(() => {
        if (!outGetAlertListLoading && !outGetAlertListError && outGetAlertListData) {
            if (outGetAlertListData) {
              getAlertList(outGetAlertListData)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outGetAlertListLoading, outGetAlertListData, outGetAlertListLoading])  
    // useEffect(() => {
    //   if (!OEEAssetsLoading && OEEAssetsData && !OEEAssetsError) {
    //     if (OEEAssetsData.length > 0) {
    //       setOEEAssets(OEEAssetsData)
    //     } else {
    //       setOEEAssets([]);
    //       console.log("returndata is undefined for getAssetOEEConfigs");
    //     }
    //   }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [OEEAssetsLoading, OEEAssetsData, OEEAssetsError]) 
      

    useEffect(()=>{
        setCurPage("line")
        setAssetArray([]);
        setAssetArrayName('');
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[])

    useEffect(()=>{
        setAssetArray([]);
        setAssetArrayName('');
        if(headPlant.id){
            // getOEEAssets(headPlant.id)
          }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[headPlant]);
    useEffect(()=>{
      setAssetArray([]);
      setAssetArrayName('');
      if(headPlant.id){
        if(curLineOption){
          // getOEEAssets(headPlant.id)
          getContent(curLineOption)
        }
         
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[headPlant,curLineOption]);
  useEffect(() => {
    if(RefreshData){
      setRefreshData(false)
    }
  },[RefreshData])
    
    useEffect(() => { 
        let assetArr = JSON.parse(JSON.stringify(oeeAssetsArray));
        let assetMapData = assetArr.map((asset) => {
            let obj = { "value": false }
            let tmpObj = asset.entity
            tmpObj = { ...tmpObj, ...obj }
            return tmpObj
        }) 
        setAssetMap(assetMapData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oeeAssetsArray]);

   
  useEffect(() => {
    if (document.addEventListener) {
      document.addEventListener('webkitfullscreenchange', exitHandler, false);
      document.addEventListener('mozfullscreenchange', exitHandler, false);
      document.addEventListener('fullscreenchange', exitHandler, false);
      document.addEventListener('MSFullscreenChange', exitHandler, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function exitHandler() {
    if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
      setIsFullScreen(false);
    }
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
        setIsFullScreen(true)
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        setIsFullScreen(false)
        document.exitFullscreen();
      }
    }
}
   

    const selectLineOption = (e,val) => {
        if(e.target.value === 'Production'|| e.target.value === "Alarm" ){
            setTimeRange(6);
        }
        setCurLineOption(e.target.value);
        
    }
   

    const selectOEEAsset = (e,val) => {
          
        let selectedAsset = assetMap.filter(v=> v.name === e.target.value).map(v=> {return v.id});
        setAssetArray(selectedAsset);
        setAssetArrayName(e.target.value)
    }
    function getContent(curLine) {
        switch (curLine) {
            case 'Alarm':
                return <Alarm refresh={RefreshData} refreshOff={(e=>setRefreshData(e))} headPlant={headPlant} timeRange={timeRange} progress={(e=>setprogress(e))}/>
            case 'Tasks':
                return <Task refresh={RefreshData} refreshOff={(e=>setRefreshData(e))} headPlant={headPlant} timeRange={timeRange}/>
            case 'Production':
                return <Production /> 
            default: break
        }
    }
    
     
 return (
   <>
         
        
        <Grid container style={{background: curTheme === 'light' ? '#ffff' : '#000000'}}>
                {/* TOPBAR */}
                <Grid item xs={12} sm={12} style={{background: curTheme==='dark' ? '#000000' : '#ffff',position:"fixed",zIndex:2,width:`calc(100% - ${Draweropen ? "252px" : "40px"})`,padding:'8px',borderBottom: '1px solid rgb(232, 232, 232)'}}>
                    <Grid container spacing={1}>
                      <Grid item xs={3} lg={3} style={{ display: 'flex', alignItems: 'center' }}>
                          
                              <SelectBox
                                          labelId="dashboardSelectLbl"
                                          id="line-option-Select"
                                          auto={false}
                                          multiple={false}
                                          options={Selectline}
                                          onChange={selectLineOption}
                                          value={curLineOption}
                                          isMArray={true}
                                          checkbox={false}
                                          keyValue="title"
                                          keyId="id"
                                         placeholder={t("selectLine")}
                                      />
                                  
                              {/* </FormControl> */}
                      </Grid>
                      <Grid item xs={9} style={{display: 'flex',gap:4,justifyContent:'end',marginLeft:curLineOption === 'Connectivity'? '-19px':'0px' }}>
                    {(curLineOption === 'Alarm' || curLineOption === 'Connectivity') &&
                        <div style={{paddingTop:"6px"}} onClick={() => {setRefreshData(true)}}><Tooltip title={t('refreshDashboard')} placement="bottom" arrow   >
                                <div style={{ minWidth: 30,display:'flex',alignItems:'center' }} >  
                                  <RefreshLight fontSize='small' stroke={mainTheme.colorPalette.primary}/> 
                                </div>
                                </Tooltip></div>}
                            {!isFullScreen ?
                            <div onClick={() => toggleFullScreen()} style={{paddingTop:"6px"}}>
                                <Tooltip title={t('fullscreen')} placement="bottom" arrow   >
                                <div style={{ minWidth: 30,display:'flex',alignItems:'center' }} > 
                                  <FullScreenLight fontSize='small' stroke={mainTheme.colorPalette.primary}/>
                                </div>
                                </Tooltip></div>
                                :
                                <div onClick={()=>toggleFullScreen()} style={{paddingTop:"6px"}}>
                                <Tooltip title={t('exitfullscreen')} placement="bottom" arrow   >
                                <div style={{ minWidth: 30,display:'flex',alignItems:'center' }} > 
                                  <ExitFullScreenLight fontSize='small' stroke={mainTheme.colorPalette.primary}/>
                                </div>
                                </Tooltip></div>
                                
                            }
                            {/* TIMERANGE SELECT */} 
                            {curLineOption !== 'Alarm' && curLineOption !== 'Connectivity' &&
                            < div style={{ marginRight: 15, marginLeft: 10, width: 300 }}> 
                                <SelectBox
                                    labelId="dashboardSelectLbl"
                                    id="line-asset-Select"
                                    auto={false}
                                    // multiple={true}
                                    options={assetMap}
                                    isMArray={true}
                                    // checkbox={true}
                                    value={assetArrayName}
                                    keyValue="name"
                                    keyId="name"
                                    placeholder={t("SelectAsset")}
                                    onChange={selectOEEAsset}
                                   
                            
                                /> 
                              
                            </div>}
                            { curLineOption !== 'Connectivity' &&
                            <div  style={{marginLeft: 10, float: 'right', width: "386px" }}>
                               
                                     
                                    <DatePickerNDL
                                            id="Line-Module-picker"
                                            onChange={(dates) => {
                                              const [start, end] = dates; 
                                              setSelectedDateStart(start);
                                              setSelectedDateEnd(end);
                                            }} 
                                            startDate={selectedDateStart}
                                            endDate={selectedDateEnd}
                                            disabled={true}
                                             dateFormat="dd/MM/yyyy HH:mm:ss"
                                            selectsRange={true}
                                            timeFormat="HH:mm:ss"
                                            customRange={true}
                                            defaultDate={timeRange} 
                                            Dropdowndefine={curLineOption === 'Alarm' ? "AlarmsLine" : undefined}
                                    />  
                                
                            </div>
}
                     {/* ASSET SELECT */}
                           
                      </Grid>
                    </Grid>
                    {progress &&
                    <Grid item xs={12} sm={12} style={{display:'flex',justifyContent:'center'}}>
                      <LinearProgress />
                    </Grid>}
                </Grid>
                
                <Grid item xs={12} style={{background: curTheme === 'light' ? '#ffff' : '#000000',height:"100%",width:"100%"}}>
                    <FullScreen handle={handle} >
                
                        {curLineOption &&  
                            getContent(curLineOption)
                        }
                        {!curLineOption &&  
                            <Grid container justify="center" style={{ height: 'auto',background: curTheme === 'light' ? '#ffff' : '#000000' }}>
                                <Grid item xs={12} style={{ textAlign: "center" }}>
                                    {curTheme === 'light' ? <LineLight /> : <LineDark />}
                                <Typography style={{ color: curTheme === 'light' ? "#363636B8" : "#8F8F8F" }}> {t('Please select from dropdown to view')}</Typography>

                                </Grid>
                            </Grid>
                        }
                    </FullScreen>
                    

                </Grid>
        </Grid>
        
    </>
    );
}