import React, { useEffect, useState } from "react";
import Grid from "components/Core/GridNDL";
import moment from "moment";
import KpiCards from "components/Core/KPICards/KpiCardsNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import InstrumentIcon from 'assets/neo_icons/Alarms/Instrument.svg?react';
import VInstrumentIcon from 'assets/neo_icons/Alarms/VInstrumentIcon.svg?react';
import GateWayIcon from 'assets/neo_icons/Alarms/Gateway.svg?react';
import VirInstrumentIcon from 'assets/neo_icons/Alarms/VirtualInstrument.svg?react';
import AssetIcon from 'assets/neo_icons/Alarms/Vector.svg?react';
import LightBulb from 'assets/neo_icons/Alarms/Lightbulb.svg?react';
import IconAnimate from 'assets/neo_icons/Alarms/Icon-Animate.svg?react';
import ToolIcon from 'assets/neo_icons/Equipments/circuit-motor.svg?react';
import Status from 'components/Core/Status/StatusNDL'
import Tag from "components/Core/Tags/TagNDL";
import ToolTip from "components/Core/ToolTips/TooltipNDL"
import FaultInfoModel from "./FaultInfoModel.jsx"
import TaskInfoModel from "./TaskInfoModel.jsx"
import useGetDefectDetails from "../hooks/useGetDefectDetails.jsx"
import { useRecoilState } from "recoil";
import {  themeMode } from "recoilStore/atoms";


export default function Card(props) {// NOSONAR

    const tasksForEntity =
    props &&
    props.TaskListData &&
    Array.isArray(props.TaskListData) &&
    props.TaskListData.length > 0
      ? props.TaskListData.filter(
          (task) => task.entity_id === props.info.id 
        )
      : [];
    const [isshowmodel, setisshowmodel] = useState(false);
    const [isshowtaskmodel, setisshowtaskmodel] = useState(false);
    const [closestElements, setclosestElements]= useState([]);
    const [finalarmdefectdata, setfinalarmdefectdata]= useState([]);
    const [CurTheme] = useRecoilState(themeMode);
    const { alarmDefectLoading, alarmDefectData, alarmDefectError, getAlarmDefects } = useGetDefectDetails();
      
    useEffect(() => {
        if (!alarmDefectLoading && alarmDefectData && !alarmDefectError && closestElements.length > 0) {
            const constructedData = closestElements.map(element => {
                const matchingDefect = alarmDefectData.find(defect => defect.defect_id === parseInt(element.defect, 10));

                if (matchingDefect) {
                    const recommendationObj = matchingDefect.fault_action_recommendeds.find(
                        action => action.severity_id === parseInt(element.severity, 10)
                    );

                    return {
                        fault: matchingDefect.defect_name,
                        recommendation: recommendationObj ? recommendationObj.action_recommended : "No recommendation available",
                        time: element.time,
                        severity: element.severity,
                        iid: element.iid
                    };
                }

                return {
                    fault: "No matching defect found",
                    recommendation: "No recommendation available",
                    time: element.time,
                    severity: element.severity,
                    iid: element.iid
                };
            });
            setfinalarmdefectdata(constructedData)
        }
    }, [alarmDefectLoading, alarmDefectData, alarmDefectError, closestElements]);    

    let statusColor = "#E0E0E0";

    if (tasksForEntity && tasksForEntity.length > 0) {
        const allCompleted = tasksForEntity.every(task => task.taskStatus.status.toLowerCase() === "completed");
        const notCompleted = tasksForEntity.every(task => task.taskStatus.status.toLowerCase() !== "completed");

        if (allCompleted) {
            statusColor = "#24a148"; 
        } else if (notCompleted) {
            statusColor = "#dc3e42"; 
        } else {
            statusColor = "#ffa057"; 
        } 
    }    

    useEffect(()=>{
       if ( props.info && !props.info.defect_name) {
            if (props.info.CriticalityType === "warning" && props.info && props.info.metric_name && props.info.metric_name.includes("acc")) {
                props.info.defect_name = "Insufficient Lubrication";
                props.info.recommendation = "Inspect Bearing for improper lubrication and monitor the bearing temperature.";
            } else if (props.info.CriticalityType === "warning" && props.info && props.info.metric_name && props.info.metric_name.includes("temp")){
                props.info.defect_name = "Insufficient Lubrication";
                props.info.recommendation = "Keep a watch on the bearing temperature and inspect lubricant condition.";
            } else if (props.info.CriticalityType === "critical" && props.info && props.info.metric_name && props.info.metric_name.includes("acc")) {
                props.info.defect_name = "Poor Lubrication"; 
                props.info.recommendation = "Inspect Bearing for improper lubrication and monitor the bearing temperature.";
            } else if (props.info.CriticalityType === "critical" && props.info && props.info.metric_name && props.info.metric_name.includes("temp")) {
                props.info.defect_name = "Poor Lubrication"; 
                props.info.recommendation = "Inspect lubricant condition and top-up new grease.";
            } else if(props.info.CriticalityType === "ok") {
                props.info.defect_name = "NA";
                props.info.recommendation = "";
            } else {
                props.info.defect_name = "No Faults"; 
                props.info.recommendation = "";
            }
        }
    },[props.info])

    useEffect(() => {
        if (props.faultInfoData && props.info && props.info.metric_name && props.info.instrumentsArr && props.info.instrumentsArr.length > 0) {
            const faultInfoData = props.faultInfoData;
            const match = props.info.metric_name.match(/_([a-z]*)_lh/);
            const searchKey = match && match.length > 0 && match[1].toUpperCase();
            
            const filteredFaultInfoData = faultInfoData
                .filter(x => props.info.instrumentsArr.some(instrumentId => instrumentId === x.iid))
                .filter(data => data.key.includes(searchKey));
            if (filteredFaultInfoData.length > 0) {
                const targetTime = moment(props.info.LastActiveAt, 'DD/MM/YYYY HH:mm:ss A').toDate().getTime();
              
                const closestElements = filteredFaultInfoData.slice(0, Math.min(filteredFaultInfoData.length, 3));
    
                closestElements.forEach(element => {
                    const elementTime = new Date(element.time).getTime();
                    const timeDiff = Math.abs(elementTime - targetTime);
                    element.timeDiff = timeDiff; 
                });
    
                closestElements.sort((a, b) => a.timeDiff - b.timeDiff);
                
                 const defects = closestElements.map(element => element.defect).filter(defect => defect);
                if (defects.length > 0) {
                    props.info.defects = defects; 
                    setclosestElements(closestElements)
                    getAlarmDefects(defects); 
                }

            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.info]);    

    function handleinfoclick(e, info) {
        e.preventDefault();
        e.stopPropagation();
        setisshowmodel(true);
    }

    function handletaskclick(e, info) {
        e.preventDefault();
        e.stopPropagation();
        setisshowtaskmodel(true);
    }

    function convertMinutesToDHM(minutes) {
        if (isNaN(minutes) || minutes < 0) {
            return "";
        }

        const days = Math.floor(minutes / (24 * 60));
        const hours = Math.floor((minutes % (24 * 60)) / 60);
        const remainingMinutes = minutes % 60;

        let result = "";

        if (days > 0) {
            result += `${days} D`;
        }

        if (hours > 0) {
            result += ` ${hours} Hr`;
        }

        if (remainingMinutes > 0 || result === "") {
            result += ` ${remainingMinutes} Min`;
        }

        return result.trim();
    }
// NOSONAR
    function IconFunc(){
        if(props.info && props.info.entity_type === 'tool'){
            return <ToolIcon stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'} width={40} height={40}/>
        }else{
            return <InstrumentIcon stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'} width={40} height={40} />
        }
    }
    
    return (
        <React.Fragment>
              <Grid item sm={3} lg={3} key={props.info && props.info.name}>
                <KpiCards style={{ cursor: "pointer" }} onClick={() => props.handleEntityCardActionInstrument(props.info, props.defect_name, props.recommendation)}>
                    <div className="flex items-center justify-between mb-1">
                    {props.info && props.info.Type === "Asset" ? <AssetIcon stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'} width={40} height={40} />
                            : props.info && props.info.Type === "Instrument" ? props.info && props.info.connectivity_type === 2 ? <GateWayIcon stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'} width={40} height={40} /> : IconFunc()
                                : props.info && props.info.Type === "VirtualInstrument" ? <VInstrumentIcon stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'} width={40} height={40} /> : ""}
                        <div className="flex gap-2 items-center">
                        <Typography value={convertMinutesToDHM(props.info && props.info.CriticalityTimediff)} mono  variant={"paragraph-xs"} color="secondary"/> 

                        {props.info && !props.info.connectivity_id &&
                                <React.Fragment>
                                    <Status  lessHeight style={{ color: "#FFFFFF", backgroundColor: props.info && props.info.LastActiveStatus ? (props.info && props.info.LastActiveStatus === "critical" ? "#ce2c31" : (props.info.LastActiveStatus === "warning" ? "#ef5f00" : (props.info.LastActiveStatus === "ok" ? "#30A46c" : ""))) : "",  textAlign: "-webkit-center" }} name={props.info.LastActiveStatus} />
                                </React.Fragment>
                            }
                             {props.info && props.info.connectivity_id &&
                                <React.Fragment>
                                      <Status  lessHeight style={{ color: "#FFFFFF", backgroundColor: props.info && props.info.CriticalityType ? (props.info && props.info.CriticalityType === "inactive" ? "#ce2c31" : (props.info.CriticalityType === "active" ? "#30A46c" : "")) : "", width: "100px", textAlign: "-webkit-center" }} name={props.info.CriticalityType} />
                                </React.Fragment>
                            }
                        </div>
                    </div>
                    <ToolTip title={props.info && props.info.name ? props.info && props.info.name : ""} placement="bottom">
                        <div className="mb-1">
                        <Typography style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", maxWidth: "270px" }} variant={"label-02-s"}  value={props.info && props.info.name ? props.info.name : ""} />

                        </div>
                    </ToolTip>
                    {props.info && !props.info.connectivity_id &&
                        <React.Fragment>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="flex items-center gap-1">
                                <Typography style={{color:"#ce2c31"}}  variant={"paragraph-xs"} value={'Critical - '} />
                                <Typography style={{color:"#ce2c31"}}  variant={"paragraph-xs"} mono value={props.info && props.info.Total_Critical ? props.info && props.info.Total_Critical : "0"} />
                                </div>
                                <div className="text-Text-text-tertiary dark:text-Text-text-tertiary-dark">|</div>
                                <div className="flex items-center gap-1">
                                <Typography style={{color:"#ef5f00"}} variant={"paragraph-xs"} value={`Warning - `} />
                                <Typography style={{color:"#ef5f00"}} variant={"paragraph-xs"} mono value={props.info && props.info.Total_Warning ? props.info && props.info.Total_Warning : "0"} />
                           </div>
                           <IconAnimate
                                 onClick={ tasksForEntity && tasksForEntity.length > 0 ? (e) => handletaskclick(e, props.info && props.info.instrumentsArr) : null}
                                 stroke={statusColor}
                            />
                            </div>
                            {props.faultInfoData && props.faultInfoData.length > 0 &&
                            (
                                (props.info && props.info.instrumentsArr && props.info && props.info.instrumentsArr.length > 0 &&
                                    props.faultInfoData.some(data => props.info && props.info.instrumentsArr.includes(data.iid))
                                ) ||
                                (props.info &&  props.info.id && 
                                    props.faultInfoData.some(data => data.iid === props.info && props.info.id)
                                )
                            ) && (
                                <div>
                                    {finalarmdefectdata && finalarmdefectdata.length > 0 && (
                                <div className="flex items-center mt-2">
                                <Tag 
                                    style={{ backgroundColor: "#E0E0E0" }} 
                                    name={
                                        (alarmDefectData && alarmDefectData[0].defect_name) ||
                                        (props.info && props.info.defect_name) ||
                                        (props.defect_name) ||
                                        "No Faults"
                                    }
                                />
                                {alarmDefectData && alarmDefectData.length > 1 &&
                                 <Tag 
                                 style={{ backgroundColor: "#E0E0E0", marginLeft: "4px"}} 
                                 noWidth="5px"
                                 name={alarmDefectData && alarmDefectData.length > 1 ? `+${alarmDefectData.length - 1}` : ""}
                              />
                             }
                              <LightBulb onClick={(e) => handleinfoclick(e, props.info && props.info.instrumentsArr)} className="ml-1" />
                            </div>    
                                    )}
                            </div>                          
                        )}
                            <div className="flex items-center gap-2 ">
                            <Typography  color="secondary" variant={"paragraph-xs"} mono value={`Last Alarm status is ${props.info && props.info.LastActiveStatus} at ${props.info.LastActiveAt ? moment(new Date(props.info.LastActiveAt)).format("DD/MM/YYYY HH:mm:ss") : ""}  `} />
                                
                               
                            </div>
                        </React.Fragment>
                    }
                       {props.info && props.info.connectivity_id &&
                        <React.Fragment>
                            <div className="flex items-center gap-2">
                            <Typography color="secondary" style={{ fontSize: "13px" }} value={`Last Active at ${props.info && props.info.LastActiveAt ? props.info && props.info.LastActiveAt : ""}  `} />
                            </div>
                        </React.Fragment>
                    }
                </KpiCards>
            </Grid>
            {isshowmodel && <FaultInfoModel onClose={() => setisshowmodel(false)} info={props.info} assetname={props.info && props.info.name} props={props} headPlant={props.headPlant} alarmDefectData={finalarmdefectdata} />}
            {isshowtaskmodel && <TaskInfoModel onClose={() => setisshowtaskmodel(false)} info={props.info && props.info} tasksForEntity={tasksForEntity} props={props} />}
        </React.Fragment>
    )
}
