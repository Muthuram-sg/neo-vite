import React, { useState, useEffect } from 'react';
import Typography from "components/Core/Typography/TypographyNDL";
import useGetTheme from 'TailwindTheme';
import Line from 'components/layouts/NewSettings/Line/index.jsx'
import License from 'components/layouts/NewSettings/License/index.jsx'
import Factor from 'components/layouts/NewSettings/Factors/index.jsx'
import ShiftCalendar from 'components/layouts/NewSettings/ShiftCalender/index.jsx'
import TimeSlot from 'components/layouts/NewSettings/TimeSlot/timeslot'
import UserComponent from 'components/layouts/NewSettings/Users'
import Channels from 'components/layouts/NewSettings/Channels'
import VirtualInstrument from 'components/layouts/NewSettings/VirtualInstrument'
import Gateway from 'components/layouts/NewSettings/Gateway'
import Metrics from 'components/layouts/NewSettings/Metrics/MetricsSetting'
import MetricsGroup from 'components/layouts/NewSettings/MetricsGroup/index.jsx'
import Instrument from 'components/layouts/NewSettings/Instrument/RealInstrument'
import Hierarchy from 'components/layouts/NewSettings/HierarchySetting/HierarchySetting.jsx'
import Assets from 'components/layouts/NewSettings/Asset'
import ToolLife from 'components/layouts/NewSettings/ToolLife'
import Node from 'components/layouts/NewSettings/Node'
import Contract from './Energy Contract';
import ProductEnergy from './Product Energy/productEnergy';
import { useRecoilState } from "recoil";
import { lineEntity, selectedPlant,user } from "recoilStore/atoms";
import LineComponent from 'components/layouts/NewSettings/Line/NewLineBI'
import Co2Emission from './Co2Emission';
// import { BIMenuList } from 'components/layouts/Settings/SubMenuBI.jsx'   
import Access from "components/layouts/NewSettings/Access"
import useGetAlarmSMSUser from "components/layouts/Alarms/hooks/useGetAlarmSMSUser";

export default function Index() {
    const theme = useGetTheme();
    const [headPlant] = useRecoilState(selectedPlant);
    const [currentPage, setcurrentPage] = useState('');
    
    const [hideSideBar, setHidesideBar] = useState(false);// NOSONAR  -  skip this line
    const [isSuperAdmin, setisSuperAdmin] = useState(false)
    const [entity] = useRecoilState(lineEntity);// NOSONAR  -  skip this line
    const [currUser] = useRecoilState(user);
    const { AlarmSMSUserLoading, AlarmSMSUserData, AlarmSMSUserError, getAlarmSMSUser } = useGetAlarmSMSUser()

    const settingsChange = (type) => {
        console.log(headPlant.type,"type",type)
        if(currentPage !== 'settings'){
            localStorage.setItem("settingsRoute", "")
            setcurrentPage(type)
        }
        localStorage.setItem("settingsRoute", type)
        setcurrentPage(type)
    } 

useEffect(()=>{
    getAlarmSMSUser()
},[headPlant])


    useEffect(()=>{
        if(!AlarmSMSUserLoading && AlarmSMSUserData  &&  !AlarmSMSUserError){
          let isAccesableUser = AlarmSMSUserData.filter(x=>x.user_id === currUser.id && x.is_enable) 
          if(isAccesableUser.length > 0){
            setisSuperAdmin(true)
          }else{
            setisSuperAdmin(false)
    
          }
    
        }
      },[AlarmSMSUserLoading,  AlarmSMSUserData , AlarmSMSUserError])



useEffect(()=>{
    if(headPlant.type === '2' ){
        setcurrentPage (localStorage.getItem("settingsRoute") || "Line Info") 
    }else{
        setcurrentPage("LineInfo")
    }
},[headPlant])

    const renderContent = (type) => {
        switch (type) {
            case "Line Info":
                return <Line />;
            case "License":
                return <License />;
            case 'Prices':
                return <Factor handleHide={(e) => { setHidesideBar(e) }} />;
            case 'Shift Calendar':
                return <ShiftCalendar handleHide={(e) => { setHidesideBar(e) }} />
            case 'Time Slot':
                return <TimeSlot handleHide={(e) => { setHidesideBar(e) }} />
            case 'Users':
                return <UserComponent />
            case 'Channels':
                return <Channels />
            case 'Access':
                    return <Access handleHide={(e) => { setHidesideBar(e) }}/> 
            case "Virtual Instrument":
                return <VirtualInstrument />
            case "Gateway":
                return <Gateway  handleHide={(e) => { setHidesideBar(e) }}  />
            case "Metrics":
                return <Metrics />
            case "Metrics Group":
                return <MetricsGroup />
            case "Instrument":
                return <Instrument handleHide={(e) => { setHidesideBar(e) }} />
            case "Hierarchy":
                return <Hierarchy />
            case "Energy Contract":
                return <Contract />
            case "Product Energy":
                return < ProductEnergy />
            case "Assets":
                return <Assets handleHide={(e) => { setHidesideBar(e) }} />
            case "Tool Life":
                return <ToolLife />
            case "Entity":
                return <Node />
            case "LineInfo":
                return <LineComponent />
            case "Co2 Factor":
                return <Co2Emission/>
            default:
                return <div>Select a tab to view the content</div>;
        }
    };

    let settingsRoutes = []
    if (headPlant.type === '2') {
        settingsRoutes = { General: ["Line Info","Shift Calendar", "Time Slot","Prices"],Manage: ["Users","Access","Channels","License"],Entity: ['Assets', 'Entity',"Hierarchy","Tool Life"], Connect: ["Gateway","Instrument", "Virtual Instrument","Metrics", "Metrics Group"], Misc: ["Product Energy", "Energy Contract","Co2 Factor"] }
    } else {
        settingsRoutes = { General: ["LineInfo", "Users"] }

    }



    return (
        <React.Fragment>
            <div className="flex w-full ">
                <div style={{ display: hideSideBar ? "none" : 'block' }} className="w-[20%] border-r border-Border-border-50 dark:border-Border-border-dark-50 ">
                    <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark h-[48px] p-3' style={{ borderBottom: '1px solid ' + theme.colorPalette.divider, zIndex: '20', width: `calc(100% -"253px"})` }}>
                        <Typography value='Settings' variant='heading-02-xs' />
                    </div>

                    <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark p-4 overflow-auto h-[95vh] '>
                        {
                            headPlant.type === '2' ?
                                <React.Fragment>
                                    <div className='py-0.5 px-2'>
                                        <Typography value='General' color="tertiary" variant="lable-01-xs" />
                                    </div>
                                    {
                                    
                                    
                                    settingsRoutes.General.map(x => {
                                        const selectedPage = currentPage === x ? 'bg-Secondary_Interaction-secondary-active dark:bg-Secondary_Interaction-secondary-active-dark' : ''

                                        return (
                                            <ul>
                                                <button class={"py-1 px-2 h-[32px] text-left justify-center hover:bg-Secondary_Interaction-secondary-hover dark:hover:bg-Secondary_Interaction-secondary-hover-dark active:bg-Secondary_Interaction-secondary-active dark:active:bg-Secondary_Interaction-secondary-active-dark focus:bg-Secondary_Interaction-secondary-active dark:focus:bg-Secondary_Interaction-secondary-active-dark flex  flex-col w-full rounded-md " + selectedPage} onClick={() => settingsChange(x)}>
                                                    <Typography variant={currentPage === x ? "label-02-s" : "lable-01-s"} value={x} />
                                                </button>

                                            </ul>
                                        )
                                    })
                                    }

                                    <div className='mt-4' />
                                    <div className='py-0.5 px-2'>

                                        <Typography value='Manage' color="tertiary" variant="lable-01-xs" />
                                    </div>
                                    {settingsRoutes.Manage.filter(x => isSuperAdmin || x !== "Access").map(x => {
                                        const selectedPage = currentPage === x ? 'bg-Secondary_Interaction-secondary-active dark:bg-Secondary_Interaction-secondary-active-dark' : ''

                                        return (
                                            <ul>
                                                <button class={"py-1 px-2 h-[32px] text-left justify-center hover:bg-Secondary_Interaction-secondary-hover dark:hover:bg-Secondary_Interaction-secondary-hover-dark active:bg-Secondary_Interaction-secondary-active dark:active:bg-Secondary_Interaction-secondary-active-dark focus:bg-Secondary_Interaction-secondary-active dark:focus:bg-Secondary_Interaction-secondary-active-dark flex  flex-col w-full rounded-md " + selectedPage} onClick={() => settingsChange(x)}>
                                                <Typography variant={currentPage === x ? "label-02-s" : "lable-01-s"} value={x} />
                                                    </button>

                                            </ul>
                                        )
                                    })
                                    }
                                    <div className='mt-4' />
                                    <div className='py-0.5 px-2'>

                                        <Typography value='Entity' color="tertiary" variant="lable-01-xs" />
                                    </div>
                                    {settingsRoutes.Entity.map(x => {
                                        const selectedPage = currentPage === x ? 'bg-Secondary_Interaction-secondary-active dark:bg-Secondary_Interaction-secondary-active-dark' : ''

                                        return (
                                            <ul>
                                                <button class={"py-1 px-2 h-[32px] text-left justify-center text-[14px] leading-[16px] font-normal font-geist-sans    dark:hover:bg-Secondary_Interaction-secondary-hover-dark active:bg-Secondary_Interaction-secondary-active dark:active:bg-Secondary_Interaction-secondary-active-dark focus:bg-Secondary_Interaction-secondary-active dark:focus:bg-Secondary_Interaction-secondary-active-dark flex  flex-col w-full rounded-md  " + selectedPage} onClick={() => settingsChange(x)}>
                                                <Typography variant={currentPage === x ? "label-02-s" : "lable-01-s"} value={x} />
                                                    </button>

                                            </ul>
                                        )
                                    })
                                    }
                                    <div className='mt-4' />
                                    <div className='py-0.5 px-2'>

                                        <Typography value='Connect' color="tertiary" variant="lable-01-xs" />
                                    </div>

                                    {settingsRoutes.Connect.map(x => {
                                        const selectedPage = currentPage === x ? 'bg-Secondary_Interaction-secondary-active dark:bg-Secondary_Interaction-secondary-active-dark' : ''


                                        return (
                                            <ul>
                                                <button class={"py-1 px-2 h-[32px] text-left justify-center text-[14px] leading-[16px] font-normal font-geist-sans   dark:hover:bg-Secondary_Interaction-secondary-hover-dark active:bg-Secondary_Interaction-secondary-active dark:active:bg-Secondary_Interaction-secondary-active-dark focus:bg-Secondary_Interaction-secondary-active dark:focus:bg-Secondary_Interaction-secondary-active-dark flex  flex-col w-full rounded-md" + selectedPage} onClick={() => settingsChange(x)}>
                                                <Typography variant={currentPage === x ? "label-02-s" : "lable-01-s"} value={x} />

                                                    </button>

                                            </ul>
                                        )
                                    })

                                    }
                                    <div className='mt-4' />
                                    <div className='py-0.5 px-2'>
                                        <Typography value='Misc' color="tertiary" variant="lable-01-xs" />
                                    </div>

                                    {settingsRoutes.Misc.map(x => {
                                        const selectedPage = currentPage === x ? 'bg-Secondary_Interaction-secondary-active dark:bg-Secondary_Interaction-secondary-active-dark' : ''
                                        return (
                                            <ul>
                                                <button class={"py-1 px-2 h-[32px] text-left justify-center  text-[14px] leading-[16px] font-normal font-geist-sans  dark:hover:bg-Secondary_Interaction-secondary-hover-dark active:bg-Secondary_Interaction-secondary-active dark:active:bg-Secondary_Interaction-secondary-active-dark focus:bg-Secondary_Interaction-secondary-active dark:focus:bg-Secondary_Interaction-secondary-active-dark flex  flex-col w-full rounded-md  " + selectedPage} onClick={() => settingsChange(x)}>
                                                <Typography variant={currentPage === x ? "label-02-s" : "lable-01-s"} value={x} />
                                                    </button>

                                            </ul>
                                        )
                                    })
                                    }
                                </React.Fragment>

                                :
                                <React.Fragment>
                                    <div className='py-0.5 px-2'>
                                        <Typography value='General' color="tertiary" variant="lable-01-xs" />
                                    </div>
                                    {settingsRoutes.General.map(x => {
                                        const selectedPage = currentPage === x ? 'bg-Secondary_Interaction-secondary-active dark:bg-Secondary_Interaction-secondary-active-dark' : ''

                                        return (
                                            <ul>
                                                <button class={"py-1 px-2 h-[32px]  text-left    dark:hover:bg-Secondary_Interaction-secondary-hover-dark active:bg-Secondary_Interaction-secondary-active dark:active:bg-Secondary_Interaction-secondary-active-dark focus:bg-Secondary_Interaction-secondary-active dark:focus:bg-Secondary_Interaction-secondary-active-dark flex  flex-col w-full rounded-md " + selectedPage} onClick={() => settingsChange(x)}>
                                                    <Typography variant={currentPage === x ? "label-02-s" : "lable-01-s"} value={x} />
                                                </button>

                                            </ul>
                                        )
                                    })
                                    }
                                </React.Fragment>

                        }

                    </div>
                </div>
                <div className={hideSideBar ? "w-full" : "w-[80%] h-screen overflow-auto"}>
                    {renderContent(currentPage)}
                   
                </div>
            </div>

        </React.Fragment>

    )// NOSONAR start -  skip 
}