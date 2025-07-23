/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import  useTheme from "TailwindTheme";
import TypographyNDL from "components/Core/Typography/TypographyNDL"
import Tooltip from "components/Core/ToolTips/TooltipNDL.jsx"
import { useTranslation } from 'react-i18next';
import Expand from 'assets/neo_icons/Menu/Expanded tree.svg?react';
import Collapse from 'assets/neo_icons/Menu/Collapsed tree.svg?react';
import EyeIcon from 'assets/neo_icons/Menu/Show Connectivity Status.svg?react';
import EyeClosed from 'assets/neo_icons/Menu/Hide Connectivity Status.svg?react';
import RefreshLight from 'assets/neo_icons/Menu/refresh.svg?react';
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import ForecastModel from 'assets/neo_icons/Explore/ForecastModel.svg?react';
import Completed from 'assets/neo_icons/Explore/Completed.svg?react';
import InProgress from 'assets/neo_icons/Explore/InProgress.svg?react';
import Queued from 'assets/neo_icons/Explore/Queued.svg?react';
import Error from 'assets/neo_icons/Explore/Error.svg?react';
import { useRecoilState } from "recoil";
import {   connectstatvisible, MeterReadingStatus,themeMode,exploreRange,selectedPlant,selectedHierarchy } from "recoilStore/atoms";
import   HorizontalLine from 'components/Core/HorizontalLine/HorizontalLineNDL'
import ButtonNDL from "components/Core/ButtonNDL/index"
import MoreVertLight from 'assets/neo_icons/Menu/3_dot_vertical.svg?react';

import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import SelectBox from "components/Core/DropdownList/DropdownListNDL"; 
import Tag from "components/Core/Tags/TagNDL";

import ModalNDL from "components/Core/ModalNDL";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import useForecastBuildModels from '../hooks/useGetForecastBuildModels';
import moment from 'moment';

export default function BrowserHeader(props) {
    const { t } = useTranslation();
    const [headPlant] = useRecoilState(selectedPlant);
    const [curTheme]=useRecoilState(themeMode)
    const [showhierarchy, setShowHierarchy] = useState(false)
    const [showconnectstatus, setShowconnectstatus] = useRecoilState(connectstatvisible)
    const [meterreadingstatus, setMeterReadingStatus] = useRecoilState(MeterReadingStatus)
    const [emploreRangeSelected] = useRecoilState(exploreRange);
    
    const [cardColor] = useState('#101010');
    let menuOption=[]
    const [openmenu,setopenmenu] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOptions,setmenuOptions]=useState(menuOption)
    const [isForecastModel,setForecastModel]=useState(false)
    const { forecastBuildModelLoading, forecastBuildModelData, forecastBuildModelError, getForecastBuildModels } = useForecastBuildModels();
    const [forecastModels, setForecastModels] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [modelBuildStatus, setModelBuildStatus] = useState(5);
    const [selectedBrowserHierarchy, ]= useRecoilState(selectedHierarchy)
    const statusList = [
        {id:5,name:"Show All"},
        {id:3,name:"Error"},
        {id:2,name:"Completed"},
        {id:1,name:"In Progress"},
        {id:4,name:"Queued"}
    ]

    const handleModelBuildStatus = (e) =>{
        console.log(e.target.value);
        setModelBuildStatus(e.target.value)
        let finalData=[];
        if(e.target.value === 5)
            finalData = forecastModels;
        else{
            let filterBy= e.target.value !== 4 ? e.target.value : 0;
            finalData = forecastModels.filter(f => f.status === filterBy)
        }
        setFilteredData(finalData)
    }

    const handleClick = (event) => {
        setopenmenu(!openmenu)
        setAnchorEl(event.currentTarget);
        menuOption = [
            {id:"forecast",name:"Forecast Model",icon: ForecastModel, stroke:getStrokeColor(),toggle: false},
            {id:"connectivity",name:"Connectivity",icon:showconnectstatus ? EyeIcon : EyeClosed,stroke:getStrokeColor(),toggle: true,checked:showconnectstatus},
            {id:"Download",name:"Download as CSV",icon:Download,stroke: "#0F6FFF" || theme.colorPalette.primary,toggle: false,color:"#0F6FFF"},        
        ]
        setmenuOptions(menuOption)
    };
    const handleClose = () => {
        setopenmenu(false)
        setAnchorEl(null);
    };
    function toggleChange(e,opt){
        let menu = opt.map(f=> {
            if(f.id === e.id){
                if(e.id === 'connectivity'){
                    setShowconnectstatus(!e.checked)
                    return {...f,checked: !e.checked}
                }
            }else{
                return f;
            }
        })
        setmenuOptions(menu)
        
    }
    function optionChange(e){
        if(e === "Download"){
            props.download()
            handleClose()
        }
        else if(e === "forecast"){
            openForecast()
            handleClose()
        }
      }
    const theme = useTheme();

    const classes={
        headerDiv: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems:"center",
            padding:"8px 16px 8px 16px"
        },

        tooltip: {
            backgroundColor: "#0F6FFF",
            color: "#ffff"
        },
        arrow: {
            "&:before": {
                border: "1px solid #0F6FFF"
            },
            color: '#0F6FFF'
        },
        title: {
            fontSize: "24px",
            fontWeight: 500,
            color: theme.colorPalette.primary
        }
    }

    useEffect(()=>{
         setMeterReadingStatus(!meterreadingstatus) 
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[emploreRangeSelected])

    useEffect(()=>{
        if(headPlant.id !== "")
            getForecastBuildModels(headPlant.id) 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[headPlant.id])

    useEffect(()=>{
        if (!forecastBuildModelLoading && forecastBuildModelData && !forecastBuildModelError) {
            if(forecastBuildModelData.length > 0){
                // console.log(forecastBuildModelData)
                setForecastModels(forecastBuildModelData)
                setFilteredData(forecastBuildModelData)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[forecastBuildModelLoading, forecastBuildModelData, forecastBuildModelError])

        const expandAll = () => {
        props.expand()
        setShowHierarchy(true)
    }
    const collapseAll = () => {
        props.collapse()
        setShowHierarchy(false)
    }
    const getStrokeColor = () => {
        return curTheme==='dark' ? '#ffff' : '#000000';
    }

    const closeForecast = () =>{
        setForecastModel(false)
    }
    const openForecast = () => {
        setForecastModel(true)
    }

    const getStatusTag = (modelStatus) => {
        switch(modelStatus){
            case 2:
                return <Tag icon={Completed} stroke={"#ADDDC0"} bordercolor={{ border: "1px solid #ADDDC0", borderRadius: "6px" }} style={{ color: "#2B9A66", backgroundColor: "#ADDDC0", paddingLeft: '8px' }} lessHeight={true} name={`Completed`} />;

            case 3:
                return <Tag icon={Error} stroke={"#FFCDCE"} bordercolor={{ border: "1px solid #FFCDCE", borderRadius: "6px" }} style={{ color: "#CE2C31", backgroundColor: "#FFCDCE", paddingLeft: '8px' }} lessHeight={true} name={`Error`} />;

            case 1:
                return <Tag icon={InProgress} stroke={"#C2E5FF"} bordercolor={{ border: "1px solid #C2E5FF", borderRadius: "6px" }} style={{ color: "#0090FF", backgroundColor: "#C2E5FF", paddingLeft: '8px' }} lessHeight={true} name={`In Progress`} />;

            default:
                return <Tag icon={Queued} stroke={"#F0F0F0"} bordercolor={{ border: "1px solid #F0F0F0", borderRadius: "6px" }} style={{ color: "#202020", backgroundColor: "#F0F0F0", paddingLeft: '8px' }} lessHeight={true} name={`Queued`} />;
        }
    }

    return (
        <React.Fragment>
 <div style={classes.headerDiv}>

<TypographyNDL variant="heading-02-xs" value={t('Browser')} />

<div className="flex items-center gap-2">
   
    <Tooltip title={t('Refresh Meter Readings')} placement="bottom" arrow style={{ arrow: classes.arrow, tooltip: classes.tooltip }}>
        <div style={{ cursor: 'pointer' }} fontSize="small" onClick={() => { setMeterReadingStatus(!meterreadingstatus) }}>
            <RefreshLight stroke={theme.colorPalette.primary} />
        </div>
    </Tooltip>
    <Tooltip title={!showhierarchy ? 'Expand' : 'Collapse'} placement="bottom" arrow style={{ arrow: classes.arrow, tooltip: classes.tooltip }}>
        {/* <ButtonNDL type='ghost' icon={!showhierarchy ? Expand : Collapse} /> */}
        {!showhierarchy ?
            <div style={{ cursor: 'pointer' }} fontSize="small" onClick={() => { expandAll() }}>
                <Expand stroke={theme.colorPalette.primary} />
            </div>

            :
            <div style={{ cursor: 'pointer' }} fontSize="small" onClick={() => { collapseAll() }}>
                <Collapse stroke={theme.colorPalette.primary} />
            </div>
        }
    </Tooltip>
        {selectedBrowserHierarchy !== "metricgroup" && (
            <>
                <ButtonNDL 
                    icon={MoreVertLight} 
                    stroke={cardColor} 
                    type="ghost" 
                    onClick={handleClick} 
                />
                <ListNDL
                    options={menuOptions}
                    Open={openmenu}
                    optionChange={optionChange}
                    keyValue={"name"}
                    keyId={"id"}
                    id={"popper-Menu"}
                    onclose={handleClose}
                    anchorEl={anchorEl}
                    width="220px"
                    IconButton
                    isIcon
                    toggleChange={toggleChange}
                />
            </>
        )}
</div>
</div>
<HorizontalLine variant='divider1' />
    <ModalNDL open={isForecastModel} >
        <ModalHeaderNDL>
          <TypographyNDL variant="heading-02-xs" value={t("Forecast Models")} />
        </ModalHeaderNDL>
        <ModalContentNDL>
            {forecastModels.length > 0 && 
            <React.Fragment>
                <div className="items-center gap-2">
                    <div className="mb-3" style={{width:"180px"}}>
                        <SelectBox
                            id='select-metric-category'
                            value={modelBuildStatus}
                            onChange={handleModelBuildStatus}
                            auto={false}
                            options={statusList}
                            keyId={"id"}
                            keyValue={"name"}
                        >
                        </SelectBox>
                    </div>
                    {filteredData.length > 0 ?
                    (
                        filteredData.map((model,index) => {
                            let build_at = model.created_ts !== null ? moment(model.created_ts).format("HH:mm:ss DD/MM/YYYY") : "-";
                            return (
                                <>
                                    <div className="flex border-b border-Border-border-50 dark:border-Border-border-dark-50" style={{padding:"2px 0px",flexDirection:"row",justifyContent:"space-between"}}>
                                        <div className="items-center gap-2">
                                            <TypographyNDL variant="label-01-s" style={{lineHeight:"24px"}} value={t(model.instruments_metric.metric.title)} />
                                            <TypographyNDL color="secondary" style={{lineHeight:"24px"}} variant="paragraph-s" value={t(model.instruments_metric.instrument.name)} />
                                            <TypographyNDL style={{color:"#8D8D8D",lineHeight:"24px"}} variant="paragraph-xs" value={t(build_at)} />
                                        </div>
                                        <div className="items-center gap-2 pt-4">
                                            {getStatusTag(model.status)}
                                        </div>
                                    </div>
                                </>
                            )
                        })
                    )
                    :
                    <React.Fragment>
                        <TypographyNDL variant="label-01-s" style={{lineHeight:"24px",textAlign:"center"}} value={t("No items")} />
                    </React.Fragment>
                    }
                
                </div>
            </React.Fragment>
            }
            {
                forecastModels.length === 0 && 
                <React.Fragment>
                        <TypographyNDL variant="label-01-s" style={{lineHeight:"24px",textAlign:"center"}} value={t("No models running at the moment. Please configure the instrument in settings to enable forecasting.")} />
                </React.Fragment>
            }
        </ModalContentNDL>
        <ModalFooterNDL>
          <ButtonNDL
          type='secondary'
            value={t("Close")}
            onClick={closeForecast}
          />
        </ModalFooterNDL>
    </ModalNDL>
        </React.Fragment>
       

    );
}
