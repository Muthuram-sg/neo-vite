import React, { useEffect, useState } from "react";
import Grid from "components/Core/GridNDL";
import KpiCards from "components/Core/KPICards/KpiCardsNDL";
import GateWayIcon from 'assets/neo_icons/Settings/Gateway_new.svg?react';
import Typography from "components/Core/Typography/TypographyNDL"
import Status from 'components/Core/Status/StatusNDL'
import ToolTip from "components/Core/ToolTips/TooltipNDL"
import MoreVertLight from 'assets/neo_icons/Menu/3_dot_vertical.svg?react';
import Button from "components/Core/ButtonNDL/index";
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import Pause from 'assets/neo_icons/Menu/pause_dark.svg?react';
import Edit from 'assets/neo_icons/Settings/GateWayIcons/edit.svg?react';
import Delete from 'assets/neo_icons/Settings/GateWayIcons/delete.svg?react';
import Start from 'assets/neo_icons/Settings/GateWayIcons/play.svg?react';
import Restart from 'assets/neo_icons/Settings/GateWayIcons/restart.svg?react';
import useUpdateGateWayStatus from '../hooks/useUpdateStatus'
import { useRecoilState } from "recoil";
import { themeMode,snackToggle,snackMessage,snackType } from "recoilStore/atoms";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import ModalNDL from "components/Core/ModalNDL";
import ButtonNDL from "components/Core/ButtonNDL";
import LoadingScreenNDL from "LoadingScreenNDL";


    
// import GateWayIcon from 'assets/neo_icons/Alarms/Gateway.svg?react';
export default function Card(props) {

    const [anchorEl, setAnchorEl] = useState(null);
    const [openGap,setOpenGap] = useState(false); 
    const {UpdateGateWayStatusLoading, UpdateGateWayStatusData, UpdateGateWayStatusError, UpdateGateWayStatus} = useUpdateGateWayStatus()
    const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [currTheme] = useRecoilState(themeMode);

  const [previousAction,setpreviousAction] = useState('')
  const [isStopGateway,setisStopGateway] = useState(false)
  const [isRestartGateway,setisRestartGateway] = useState(false)





    useEffect(()=>{
        if(!UpdateGateWayStatusLoading &&  UpdateGateWayStatusData  && !('error' in UpdateGateWayStatusData) &&  !UpdateGateWayStatusError){
            console.log(UpdateGateWayStatusData,"UpdateGateWayStatusData")
            setOpenSnack(true)
            SetMessage(`GateWay ${previousAction} successfully`)
            SetType('success')
            props.handleTriggerRows()
        }else if(UpdateGateWayStatusData && 'error' in UpdateGateWayStatusData){
            setOpenSnack(true)
            SetMessage(`Unable to ${previousAction} GateWay`)
            SetType('error')
        }

    },[UpdateGateWayStatusLoading, UpdateGateWayStatusData, UpdateGateWayStatusError,])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget); 
        setOpenGap(true)// Set anchor element for positioning the popper
    };

    const handleClose = () => {
        setAnchorEl(null); // Close the popper
        setOpenGap(false)
    };
    const popperOption = [
        { id:props.data.Service === "Running"?  "stop" : 'start', name: props.data.Service === "Running"?  "Stop" : 'Start', icon: props.data.Service === "Running"? Pause :Start,color:props.data.Service === "Running"? "#EF5F00" :"#0090FF",stroke: props.data.Service === "Running"? "#EF5F00" :"#0090FF", toggle: false },
        { id: "restart", name: "Restart", icon: Restart,color:"#0090FF", toggle: false },
        { id: "edit", name: "Edit", icon: Edit, toggle: false,stroke:currTheme === 'dark' ? "#eeeeee" :'#202020' },
        { id: "delete", name: "Delete", icon: Delete,color:"#CE2C31",stroke:'#CE2C31',toggle: false, },
    ]



    const handleOptionChange = (e,data)=>{
        if(e === "edit"){
            setOpenGap(!openGap)
            setAnchorEl(null)
            props.handleEditOpen(data.id,data)
    
        }
        if(e === "delete"){
            setOpenGap(!openGap)
            setAnchorEl(null)
            props.handleDetele(data.id,data,props.data.Service)
            
        }
        if(e=== "start"){
            UpdateGateWayStatus({path:data.ip_address,action:e,port:":5001/",type:"gateway"})
            setpreviousAction("Start")
            setOpenGap(!openGap)
            setAnchorEl(null)
        }
        if(e === 'stop'){
            setisStopGateway(true)
            setOpenGap(!openGap)
            setAnchorEl(null)
            
        }
        if(e=== "restart"){
            setisRestartGateway(true)
            setOpenGap(!openGap)
            setAnchorEl(null)
            

        }
    }

    const renderStatus=()=>{
        if(props.data.Service === "Running"){
            return "Active"
        }else if(props.data.Service === "Stopped"){
            return "Inactive"
        }else{
            return 'NA'
        }
    }

    const renderStatusColor=()=>{
        if(props.data.Service === "Running"){
            return "success-alt"
        }else if(props.data.Service === "Stopped"){
            return "error-alt"
        }else{
            return 'neutral-alt'
        }
    }

    const handleStop=()=>{
        UpdateGateWayStatus({path:props.data.ip_address,action:'stop',port:":5001/",type:"gateway"})
        setpreviousAction("Stoped")
        setisStopGateway(false)
       
    }

    const handleCloseDilog=()=>{
        setisStopGateway(false)
        
    }
    const handleCloseGatewayRestartDilog=()=>{
        setisRestartGateway(false)
    }
    const handleRestartGateway=()=>{
        UpdateGateWayStatus({path:props.data.ip_address,action:"restart",port:":5001/",type:"gateway"})
        setpreviousAction("Restart")
        setisRestartGateway(false)

    }

    const instrumentsMetrics = props.data.instrument_id && props.data.instrument_id.length > 0 ? props.data.instrument_id.length : 0
// console.log(props.data.count,'props.data.count')
    const LiveInstrument = renderStatus() === "Inactive" ? 0 : props.data.count
    const LastSyned = props.data && renderStatus() === "Active"  && 'most_recent' in props.data && "differenceInMinutes" in  props.data.most_recent ? props.data.most_recent.differenceInMinutes + ' ' + 'min' : "NA"  
    return (
        <React.Fragment>
            {
                UpdateGateWayStatusLoading && <LoadingScreenNDL />
            }
            <Grid item xs={4} key="Card_name">
                <KpiCards style={{ cursor: "pointer"}} onClick={(f) => {f.stopPropagation(); props.handleGateWayClick(props.data)}}>
                    <div className="flex items-center justify-between  mb-1">
                        <GateWayIcon stroke={currTheme === 'dark' ? "#eeeeee" : "#202020"} width={40} height={40} />
                        <Status
                        colorbg={renderStatusColor()}
                        name={renderStatus()}
                        />
                    </div>
                    <ToolTip title={props.name} placement="bottom">
                        <span className="mb-0.5">
                            <Typography
                                style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", maxWidth: "270px" }}
                                variant="label-02-s"
                                value={props.name}
                            />
                        </span>
                    </ToolTip>
                    {/* Live Instruments and Last Synced */}
                    <div className="flex items-center justify-between">

                        <div className="flex flex-col gap-0.5">
                            <Typography
                                color="secondary"
                                variant="paragraph-xs"
                                mono
                                value={LiveInstrument + "/" + instrumentsMetrics  + " instruments are live"}
                            />

                            <Typography
                                color="secondary"
                                variant="paragraph-xs"
                                mono
                                value={`Last Synced ${LastSyned}`}
                            />
                        </div>
                        <Button icon={MoreVertLight} type="ghost" onClick={(e) => {e.stopPropagation(); handleClick(e);}} />
                    </div>
                </KpiCards>
            </Grid>
            <ListNDL
                options={popperOption}
                Open={openGap}
                multiple={false}
                optionChange={(e) =>handleOptionChange(e,props.data)}
                keyValue={"name"}
                keyId={"id"}
                id={"popper-dressing"}
                IconButton
                isIcon
                onclose={handleClose}
                anchorEl={anchorEl}
                width="180px"
            />
        <ModalNDL open={isStopGateway} size="lg">
        <ModalHeaderNDL>
          <Typography
            variant="heading-02-xs"
            value={`Stop Gateway`}
          />
        </ModalHeaderNDL>
        <ModalContentNDL>
          <Typography
            value={'Are you sure you want to stop the gateway? All ongoing data transfers will be paused.'}
            variant="paragraph-s"
            color='secondary'
          />
        </ModalContentNDL>
        <ModalFooterNDL>
          <ButtonNDL value={'Cancel'} type='secondary' onClick={()=>handleCloseDilog()} />
          <ButtonNDL value={'Stop'} danger onClick={()=>handleStop()} />

        </ModalFooterNDL>
      </ModalNDL>

      <ModalNDL open={isRestartGateway} size="lg">
        <ModalHeaderNDL>
          <Typography
            variant="heading-02-xs"
            value={`Restart Gateway`}
          />
        </ModalHeaderNDL>
        <ModalContentNDL>
          <Typography
            value={'Are you sure you want to restart the gateway? This action may temporarily disrupt data communication.'}
            variant="paragraph-s"
            color='secondary'
          />
        </ModalContentNDL>
        <ModalFooterNDL>
          <ButtonNDL value={'Cancel'} type='secondary' onClick={()=>handleCloseGatewayRestartDilog()} />
          <ButtonNDL value={'Restart'}  onClick={()=>handleRestartGateway()} />

        </ModalFooterNDL>
      </ModalNDL>
        </React.Fragment>

    )
}

