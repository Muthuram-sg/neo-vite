import React, { useEffect, useState,forwardRef,useImperativeHandle, useRef } from "react";
import useTheme from 'TailwindTheme';
import Typography from "components/Core/Typography/TypographyNDL";
import Button from 'components/Core/ButtonNDL';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import { useRecoilState } from "recoil";
import { dashboardEditMode ,Duplicatecopy, currEditGraphKey,
        currentDashboardSkeleton,InstrumentsMapList,NewGridWidget, snackToggle, snackMessage, snackType,playOption,selectedPlant, EnableRearrange,currentDashboard
} from "recoilStore/atoms";
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import { useTranslation } from 'react-i18next';
import EditSetting from "./EditSettings/ModelEditDash";
import RefreshLight from 'assets/neo_icons/Menu/refresh.svg?react';
import PencilLight from 'assets/neo_icons/Menu/pencil.svg?react';
import DeleteLight from 'assets/neo_icons/Menu/delete.svg?react';
import CheckLight from 'assets/neo_icons/Menu/checkbox_tick.svg?react';
import CloseLight from 'assets/neo_icons/Menu/close.svg?react';
import MoreVertLight from 'assets/neo_icons/Menu/3_dot_vertical.svg?react';
import HideChart from 'assets/neo_icons/Dashboard/HideCharts.svg?react';
import TableIcon from 'assets/neo_icons/Dashboard/Table.svg?react';
import ChartIcon from 'assets/neo_icons/Dashboard/Charts.svg?react';
import ShowChart from 'assets/neo_icons/Dashboard/ShowCharts.svg?react';
import LocationMark from 'assets/neo_icons/Menu/location.svg?react';
import Tooltip from 'components/Core/ToolTips/TooltipNDL';
import FileCopyIcon from 'assets/neo_icons/Equipments/document-duplicate.svg?react';
import Calendar from 'assets/calendar.svg?react';

import moment from "moment";
import configParam from 'config'
import  Popover from 'components/Core/DropdownList/Poper';




const DashboardCardHeader = forwardRef((props,ref)=>{
    const mainTheme = useTheme();
     
    const { t } = useTranslation();    
    const [showChart,setShowChart] = useState(false);
    const [showTable,setShowTable] = useState(false);
    const [markers,setMarkers] = useState([]);
    const [open,setOpen] = useState(false);
    const [headPlant] =useRecoilState(selectedPlant)
    const [selectedDashboard] = useRecoilState(currentDashboard);

    
    const [openmap,setopenmap] = useState(false);
    const [openmenu,setopenmenu] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorPopEl,setAnchorPopEl]= React.useState(null);
    const [dashEdit,setDashEdit] = useRecoilState(dashboardEditMode);
    const [IndividualLoading, setIndividualLoading] = useState(false);
    const [deleteGraph, setDeleteGraph] = useState(false);
    const [, setDuplicate] = useRecoilState(Duplicatecopy);
    const [, setGraphKey] = useRecoilState(currEditGraphKey);
    const [cardColor,setcardColor] = useState(undefined);
    const [Header,setHeader] = useState(true);
    const [InstrumentsMap] = useRecoilState(InstrumentsMapList); 
    const [SelectedDashboard,setSelectedDashboardSkeleton] = useRecoilState(currentDashboardSkeleton);
    const [,setPlayMode] = useRecoilState(playOption);
    
    const editRef = useRef();
    const [,setNewGrid] = useRecoilState(NewGridWidget)
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, setEnableRearrange] = useRecoilState(EnableRearrange)
  const [isBulkOpen,setisBulkOpen]=useState(false)


    // const [live, setLive] = useState(false)
    
    useEffect(()=>{ 
      if(props.cardColor === '#f35151'){
        setcardColor('#fff')
        setHeader(false)
      }else{
        setcardColor(undefined)
      } 
      setTimeout(()=>{
        setHeader(true) 
      },500) 
    },[props.cardColor,props.details])
    
    useEffect(()=>{ 
      // eslint-disable-next-line array-callback-return
       
    let data=[]
          // eslint-disable-next-line array-callback-return
          InstrumentsMap.map(val=>{
            data.push({
              name:val.name,id:val.id,visible: true
            })
          })  
      setMarkers(data) 
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[InstrumentsMap])
    useImperativeHandle(ref,()=>({
      startRefresh: ()=>setIndividualLoading(true),
      endRefresh: ()=>setIndividualLoading(false)
    }))

    // chart Refresh 
    const clickedRefresh = () => {
        setIndividualLoading(true);
        props.refreshcard()
        setPlayMode(false)
        handleClose()
      }

   


    const clickedEdit = () => {
        setOpenSnack(false)
        editRef.current.openDialog(props.detail)
        setDashEdit(false);
        setGraphKey(props.dictkey)
        handleClose()
    };

    
    const copyDuplicate = () => {
        setDuplicate(true)
        setGraphKey(props.dictkey)
        handleGridCopy({ Data: JSON.stringify(props.detail, null, 2), dictkey: props.dictkey })
        SetMessage(t("Duplicate Widget Created"))
        SetType("success")
        setOpenSnack(true)
    }

    const handleGridCopy = (graph) => {

      let data = JSON.parse(graph.Data);
      let tempData = JSON.parse(JSON.stringify(SelectedDashboard.dashboard))
      let tempLayout = JSON.parse(JSON.stringify(SelectedDashboard.layout))
      let heigth = 2
      let width = 2
      // eslint-disable-next-line array-callback-return
      Object.keys(tempData.data).forEach((val, i) => {
        if (tempData.data[val].title === data.title) {
            heigth = tempLayout.lg[i].h;
            width = tempLayout.lg[i].w;
        }
    });
    
      const keys = Object.keys(tempData.data)
      let len = 0
      if (keys.length !== 0) {
        len = parseInt(keys[keys.length - 1])
      }
      tempData.data[(len + 1).toString()] = {
        type: data.type,
        title: data.title+" - copy",
        graphQL: data.graphQL,
        meta: data.meta
      }
      tempLayout.lg.push({
        x: (len * 2) % (tempData.cols || 12),
        y: Infinity,
        w: width,
        h: heigth,
        i: (len).toString()
      })
      tempLayout.sm.push({
        x: (len * 2) % (tempData.cols || 12),
        y: Infinity,
        w: width,
        h: heigth,
        i: (len).toString()
      })
      tempLayout.md.push({
        x: (len * 2) % (tempData.cols || 12),
        y: Infinity,
        w: width,
        h: heigth,
  
        i: (len).toString()
      })
      tempLayout.xs.push({
        x: (len * 2) % (tempData.cols || 12),
        y: Infinity,
        w: width,
        h: heigth,
        i: (len).toString()
      })

    
      let obj = {layout:tempLayout,dashboard: tempData};
      setSelectedDashboardSkeleton(obj)
      handleClose()
    };

    const clickedDelete = () => {
      setNewGrid(props.DelKey);
      let defDash = JSON.parse(JSON.stringify(SelectedDashboard.dashboard));
      let defLayout = JSON.parse(JSON.stringify(SelectedDashboard.layout));
    
      defLayout.lg = defLayout.lg.filter(objp => objp.i !== (Number(props.DelKey)).toString()).map((obj, index) => ({ ...obj, i: index.toString() }));
      defLayout.sm = defLayout.sm.filter(objp => objp.i !== (Number(props.DelKey)).toString()).map((obj, index) => ({ ...obj, i: index.toString() }));
      defLayout.md = defLayout.md.filter(objp => objp.i !== (Number(props.DelKey)).toString()).map((obj, index) => ({ ...obj, i: index.toString() }));
      defLayout.xs = defLayout.xs.filter(objp => objp.i !== (Number(props.DelKey)).toString()).map((obj, index) => ({ ...obj, i: index.toString() }));     

      delete defDash.data[props.dictkey];
      localStorage.setItem('currentLayout', JSON.stringify(defLayout));
    
      let obj = { layout: defLayout, dashboard: defDash };
    
      setSelectedDashboardSkeleton(obj);
      setDeleteGraph(false);
      handleClose();
    };
    
    const handleClick = (event) => {
        setopenmenu(!openmenu)
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setopenmenu(false)
        setAnchorEl(null);
    };

    const togglePopper = (e) =>{
        setopenmap(!openmap)
        setOpen(e.currentTarget);
    }
    const filterMarker = (e,id)=>{ 
        const cloned = [...markers];
        const filteredIndex = cloned.findIndex(x=>x.id===id);
        cloned[filteredIndex].visible = e.target.checked;
        props.markers(cloned)
        setMarkers(cloned);
    }
    const type = props.detail.type
    const isstring =props.detail?.meta?.isText ? props.detail.meta?.isText : false
    const value = props.detail  

    let menuOption=[{id:"EditPanel",name:t('EditPanel'),icon:PencilLight,stroke:mainTheme.colorPalette.primary,isEdit: true,isDel:false},
    {id:"Duplicate",name:t('Duplicate Panel'),icon:FileCopyIcon,stroke:mainTheme.colorPalette.primary,isEdit: true,isDel:false},
    {id:"RefreshData",name:t('RefreshData'),icon:RefreshLight,stroke:mainTheme.colorPalette.primary,isEdit: true,isDel:false},
    {id:"ConfirmDelete",name:t('ConfirmDelete'),icon:CheckLight,stroke:mainTheme.colorPalette.primary,isEdit: true,isDel:true},
    {id:"CancelDelete",name:t('CancelDelete'),icon:CloseLight,stroke:mainTheme.colorPalette.primary,isEdit: true,isDel:true},
    {id:"DeletePanel",name:t('DeletePanel'),icon:DeleteLight,stroke:mainTheme.colorPalette.primary,isEdit: false,isDel:false},
    {id:"Rearrange", name: 'Rearrange',icon:PencilLight,stroke:mainTheme.colorPalette.primary,isEdit: true,isDel:false },
  ]

  if(type === 'Text' || type === 'Image'){ 
    if(deleteGraph){
      menuOption=  menuOption.filter(e=>e.isEdit && e.id !== "RefreshData")
    }else{
      menuOption =menuOption.filter(e=>!e.isDel && e.id !== "RefreshData")
    }
  }else if(dashEdit){
    if(deleteGraph){
      menuOption=  menuOption.filter(e=>e.isEdit)
    }else{
  
        menuOption =menuOption.filter(e=>!e.isDel)
    
    }
  }else{

    menuOption = menuOption.filter(e=>e.id === "RefreshData")
  }
  function optionChange(e){
    if(e === "EditPanel"){
      clickedEdit()
    }else if(e === 'Duplicate'){
      copyDuplicate()
    }else if(e === 'RefreshData'){
      clickedRefresh()
    }else if(e === 'ConfirmDelete'){
      clickedDelete()
    }else if(e === 'CancelDelete'){
      setDeleteGraph(false)
    }else if(e === 'Rearrange'){
      setEnableRearrange(true)
      handleClose()
    }else{
      setDeleteGraph(true)
    }  
  }
  function changeCurrentDate(e,onChange){
    //console.log('showtextvalue',e)
    let startrange;
    let endrange;
    startrange = configParam.DATE_ARR(e, headPlant); 
     if(e === 7){
        endrange = moment(moment().subtract(1, 'day')).endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
    }else if (e === 20) {
      endrange = configParam.DATE_ARR(22, headPlant)
    } else if (e === 21) {
      endrange = configParam.DATE_ARR(23, headPlant)
    } else if (e === 16) {
      endrange =  moment().subtract(1, 'month').endOf('month').endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
    } else { 
      endrange = moment().format("YYYY-MM-DDTHH:mm:ssZ")
    }


    //console.log(startrange,endrange,"startrange,endrange")
    if(startrange && endrange){
        return [startrange,endrange]
    }else{
        return []
    }
  }

  // //console.log(props.detail,"props.detail")
  const dateRange=changeCurrentDate(props.detail.meta  && props.detail.meta.selectedRange ? props.detail.meta.selectedRange : 1)

  const fromtime = dateRange.length > 1  ?moment(dateRange[0]).format("DD-MM-YYYY HH:mm:ss") : moment().subtract(5,'minutes').format("DD-MM-YYYY HH:mm:ss") 
  const totime = dateRange.length > 1  ?moment(dateRange[1]).format("DD-MM-YYYY HH:mm:ss") : moment().format("DD-MM-YYYY HH:mm:ss") 
  const handleBulkClose=()=>{
    //console.log("toggle")
    setisBulkOpen(false)
    setAnchorPopEl(null)
  }


  const handleVisibleChange = (e) => {

    if(e){
      setAnchorPopEl(e.currentTarget)
    }
    setisBulkOpen(true)
 
  };

const getDynamicWidth = () => {
  const width = props.width - 100
 if(width > 0 ){
  return width + "px";
 }else{
  return '30px';

 }
};


console.log(props.width ,"props.width")
    return(
        <div style={{paddingBottom:'12px',display:'flex',justifyContent:type==='Text'||type==='Image'?'flex-end':'space-between',alignItems: 'center'}}>
            {
                (type !== 'Text' && type !== 'Image')&&(
                <React.Fragment> 

                    {Header && 
                    <Tooltip type={'dashboard'} style={{width: '80%'}} title={value.title} placement="bottom" arrow>
                      <div>
                        <Typography variant="heading-02-xs" color='secondary' value={value.title} style={{color: cardColor,  width:getDynamicWidth(),textOverflow: 'ellipsis',whiteSpace: 'nowrap',overflow: 'hidden'}}/> 
                      </div>
                    </Tooltip>
                    }
                    
                </React.Fragment>
                ) 
            }
            
            <div className="flex items-center gap-2 ">
                {(type ==='singleText') && (props.width > 150) && !isstring &&
                    (showChart ? 
                    <Button icon={ShowChart}  type='ghost' onClick={()=>{setShowChart(!showChart);props.showChart(!showChart)}} />
                    :
                    <Button icon={HideChart} type='ghost' onClick={()=>{setShowChart(!showChart);props.showChart(!showChart)}} />)
                }                    
                {(type==='bar' || type==='area' || type==='line' || type==='stackedbar') && (props.width > 150) &&
                    (!showTable ?
                    <Button icon={TableIcon} type='ghost' onClick={()=>{setShowTable(!showTable);props.showTable(!showTable)}} /> 
                    :
                    <Button icon={ChartIcon} type='ghost' onClick={()=>{setShowTable(!showTable);props.showTable(!showTable)}} />) 
                }
                {
               fromtime && totime &&  selectedDashboard &&  selectedDashboard.length > 0 && selectedDashboard[0].datepicker_type === 'widgetpicker' && !['Image',"weather",'video',"clock","Text"].includes(type) && 
                // <ToolTip title={fromtime + ' ' + "-" + ' ' + totime} placement="bottom" >
                // <Calendar />
                // </ToolTip>
             <React.Fragment>
                 <Button icon={Calendar} type="ghost" onClick={(e)=>{handleVisibleChange(e)}} />
                <Popover
                onclose={handleBulkClose}
                id={"popper-Gap"}
               anchorEl={anchorPopEl}
               Open={isBulkOpen}
               width= {'270px'}

     >
      <div className="p-2">
      <Typography variant='paragraph-xs' value={fromtime + ' ' + "-" + ' ' + totime}  />
      </div>
       </Popover>
             </React.Fragment>
              
              }
            
                {type === 'map' && markers.length > 0 &&
                <Button icon={LocationMark} type='ghost' onClick={()=>togglePopper()} />  }
                <ListNDL 
                    options={ menuOption }  
                    Open={openmap}  
                    optionChange={filterMarker}
                    keyValue={"name"}
                    keyId={"id"}
                    id={"popper-Map"}
                    onclose={(e)=>{setOpen(null);setopenmap(false)}}
                    anchorEl={open}
                    width="110px"
                />
               

                {
                  type === 'Text' || type === 'Image' ?
                    (dashEdit && !IndividualLoading) &&(
                        <Button icon={MoreVertLight} type='ghost' onClick={handleClick} />
                    )
                  :
                  !IndividualLoading && (<Button icon={MoreVertLight} stroke={cardColor} type='ghost' onClick={handleClick} />)
                }

                {(type !== 'Text' && type !== 'Image' && type !== 'clock' && IndividualLoading) && <div style={{marginTop: 5}}><CircularProgress disableShrink size={15} color="primary" /></div>}
                <ListNDL 
                    options={type === 'dataoverimage' ? menuOption : menuOption.filter((x) => x.id !== "Rearrange") }  
                    Open={openmenu}  
                    optionChange={optionChange}
                    keyValue={"name"}
                    keyId={"id"}
                    id={"popper-Menu-dash"}
                    onclose={handleClose}
                    anchorEl={anchorEl}
                    width="170px"
                    isIcon
                />
                {/* <Button icon={live ? Pause : Play} type='ghost' onClick={()=>clickGoLive()} /> */}
            </div> 
            <EditSetting details={props.detail} ref={editRef} dictkey={props.dictkey} refreshCard={props.refreshcard} AlertList={props.AlertList}/> 
        </div>
    )
})
export default DashboardCardHeader;