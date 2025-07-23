import React, { useEffect, useState } from 'react'
import KpiCards from 'components/Core/KPICards/KpiCardsNDL'
import Typography from 'components/Core/Typography/TypographyNDL'
import HorizontalLine from 'components/Core/HorizontalLine/HorizontalLineNDL'
import Grid from 'components/Core/GridNDL'
import Breadcrumbs from 'components/Core/Bredcrumbs/BredCrumbsNDL'
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Engine from 'assets/neo_icons/newUIIcons/Entity.svg?react';
import RightArrow from 'assets/neo_icons/SettingsLine/arrow-right.svg?react';
import InstrumentIcon from 'assets/neo_icons/newUIIcons/Instrument.svg?react';
import ViIcon from 'assets/neo_icons/newUIIcons/VirtualInstrument.svg?react';
import ProfileIcon from 'assets/neo_icons/newUIIcons/User.svg?react';




import useEntity from "components/layouts/Settings/Entity/hooks/useEntity";
import { useRecoilState } from "recoil";
import { selectedPlant, userLine,settingsLoader } from "recoilStore/atoms";
import useRealInstrumentList from "components/layouts/Settings/Instrument/Hooks/useRealInstrumentList";
import useGetInstrumentFarmula from 'components/layouts/Settings/factors/VirutalInstrument/hooks/useGetInstrumentFarmula'

import EntityComponent from 'components/layouts/Settings/Entity'
import InstrumentComponent from 'components/layouts/Settings/Instrument/RealInstrument'
import VIComponent from 'components/layouts/Settings/factors/VirutalInstrument/Index'
import UserComponent from 'components/layouts/Settings/UserSetting'
import LineComponent from 'components/layouts/Settings/Line/LineComponent'
import LicenceComponent from 'components/layouts/Settings/Line/LicenceComponent'
import CalendarComponent from 'components/layouts/Settings/Production/ShiftCalender/shiftCalendar'
import FactorsComponent from 'components/layouts/Settings/factors/Factor/factors'
import TimeSlotComponent from 'components/layouts/Settings/Production/TimeSlot/timeslot'
import Contract from 'components/layouts/Settings/EnergyContract/index';
import ProductEnergy from 'components/layouts/Settings/factors/Factor/productEnergy';
import LoadingScreenNDL from 'LoadingScreenNDL'
const NewLine = () => {
  const { EntityLoading, EntityData, EntityError, getEntity } = useEntity();
  const { realInstrumentListLoading, realInstrumentListData, realInstrumentListError, getRealInstrumentList } = useRealInstrumentList()
  const { outDTLoading, outDTData, outDTError, getInstrumentFormulaList } = useGetInstrumentFarmula();
  const [userForLineData] = useRecoilState(userLine);
  const [headPlant] = useRecoilState(selectedPlant);
  const [outDTCount, setOutDTCount] = useState('0');
  const [EntityCount, setEntityCount] = useState('0');
  const [InstrumentCount, setInstrumentCount] = useState('0')
  const [UserCount, setUserCount] = useState('0')
  const [page, setPage] = useState('Line')
  const [Component, setComponent] = useState('')
  const [listArr, setListArr] = useState([])
  const [IsLoading,setIsLoading] = useRecoilState(settingsLoader); 
  const [ShiftPlant,setShiftPlant] = useState(false)

  useEffect(() => {
    getEntity(headPlant.id);
    getRealInstrumentList(headPlant.id)
    getInstrumentFormulaList(headPlant.id);
    const count = userForLineData ? userForLineData.length : 0;
    const formattedCount = count < 10 && count !== 0 ? `0${count}` : `${count}`;
    setUserCount(formattedCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant, userForLineData])


  useEffect(() => {
    
      setTimeout(()=>{
        setIsLoading(false)
      },4000)
      
        // If the component has been loaded before, set isLoading to false
   
}, [headPlant]);

  useEffect(() => {
    const count = EntityData ? EntityData.length : 0;
    const formattedCount = count < 10 && count !== 0 ? `0${count}` : `${count}`;
    setEntityCount(formattedCount);
  }, [EntityLoading, EntityData, EntityError])

  useEffect(() => {
    const count = realInstrumentListData ? realInstrumentListData.length : 0;
    const formattedCount = count < 10 && count !== 0 ? `0${count}` : `${count}`;
    setInstrumentCount(formattedCount);
  }, [realInstrumentListLoading, realInstrumentListData, realInstrumentListError])

  useEffect(() => {
    const count = outDTData ? outDTData.length : 0;
    const formattedCount = count < 10 && count !== 0 ? `0${count}` : `${count}`;
    setOutDTCount(formattedCount);
  }, [outDTLoading, outDTData, outDTError])

  const Listarray = [
    { index: 'Line', name: 'Line' },

  ]

  const handleActiveIndex = (index) => {
    if (index === 0) {
      setPage('Line')
    }
  }
  const breadCrumbHandler = (val) => {
    setComponent(val)
    if (Listarray.length === 1) {
      Listarray.push({ index: val, name: val });
    }
    else {
      Listarray.pop()
      Listarray.push({ index: val, name: val });
    }
    setListArr(Listarray)
    setPage(val)

  }
  
  
  useEffect(()=>{
   setTimeout(()=>{
    setShiftPlant(true)
   },1000)
  },[])
  
  

  const renderComponent = () => {
    switch (Component) {
      case "Entity":
        return <EntityComponent />
      case "Instruments":
        return <InstrumentComponent />
      case "Virtual Instruments":
        return <VIComponent />
      case "Users":
        return <UserComponent />
      default:
        return null;
    }
  }

  if (page === "Line") {
    return (
      <div >
         {
            IsLoading && <LoadingScreenNDL />
          }
          {
            headPlant.type && ShiftPlant && 
            <React.Fragment>
            <div className='py-3.5 px-4 bg-Background-bg-primary dark:bg-Background-bg-primary-dark h-[48px]'>
            <TypographyNDL  value="Line" variant='heading-02-xs' />
            </div>
            <HorizontalLine variant = 'divider1'/>
            <div className='p-4 bg-Background-bg-primary dark:bg-Background-bg-primary '>
            <Grid container spacing={4} >
              <Grid item sm={3} xs={3} >
                  <KpiCards  onClick={() => breadCrumbHandler("Entity")} style={{ height: "112px",background: "#fcfcfc" ,cursor:"pointer"}}>
                    <div className='flex justify-between'>
                    <div className='flex items-center gap-3'>
                      <Engine />
                      <div className='flex flex-col gap-1'>
                      <Typography variant="display-lg" mono value={EntityCount ? EntityCount : 0} />
                      <Typography variant="lable-01-m" color='secondary'  value={"Entity"} /> 
                      </div>
                      </div>
                      <RightArrow />
                      </div>
                  </KpiCards>
                  </Grid>
              <Grid item sm={3} xs={3} >
                  <KpiCards onClick={() => breadCrumbHandler("Instruments")} style={{ height: "112px",background: "#fcfcfc" ,cursor:"pointer"}}>
                  <div className='flex justify-between'>
                    <div className='flex items-center gap-3'>
                      <InstrumentIcon />
                      <div className='flex flex-col gap-1'>
                      <Typography variant="display-lg" mono value={InstrumentCount ? InstrumentCount : 0} />
                      <Typography variant="lable-01-m" color='secondary'  value={"Instruments"} /> 
                      </div>
                      </div>
                      <RightArrow />
                      </div>
                    </KpiCards>
                    </Grid> 
                    <Grid item sm={3} xs={3} >
                  <KpiCards onClick={() => breadCrumbHandler("Virtual Instruments")} style={{ height: "112px",background: "#fcfcfc" ,cursor:"pointer" }}>
                  <div className='flex justify-between'>
                    <div className='flex items-center gap-3'>
                      <ViIcon />
                      <div className='flex flex-col gap-1'>
                      <Typography variant="display-lg" mono value={outDTCount ? outDTCount : 0} />
                      <Typography variant="lable-01-m" color='secondary'  value={"Virtual Instruments"} /> 
                      </div>
                      </div>
                      <RightArrow />
                      </div>
                    </KpiCards>
    
                    </Grid>
              <Grid item sm={3} xs={3} >
                  <KpiCards onClick={() => breadCrumbHandler("Users")} style={{ height: "112px",background: "#fcfcfc" ,cursor:"pointer" }}>
                  <div className='flex justify-between'>
                    <div className='flex items-center gap-3'>
                      <ProfileIcon />
                      <div className='flex flex-col gap-1'>
                      <Typography variant="display-lg" mono value={UserCount} />
                      <Typography variant="lable-01-m" color='secondary'  value={"Users"} /> 
                      </div>
                      </div>
                      <RightArrow />
                      </div>
                    </KpiCards>
                    </Grid>
                    </Grid>
    
            </div>
            <HorizontalLine middle variant = 'divider1'/>
            <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark'>
            <Grid container spacing={2} style={{padding:"16px"}}>
              <Grid item xs={5} sm={5} style={{ display: "flex", flexDirection: "column",gap:"8px" }}>
                <TypographyNDL variant="heading-02-xs"  model value="Line Info" />
                <TypographyNDL variant="paragraph-s" color="tertiary" model value="Personalize your factory's identity, location and business hierarchy" />
              </Grid>
              <Grid item xs={7} sm={7} style={{ paddingBottom: "20px" }}>
               <LineComponent />
              </Grid>
            </Grid>
            </div>
            <HorizontalLine middle variant="divider1" />

            <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark' >
            <Grid container spacing={2} style={{padding:"16px"}}>
              <Grid item xs={5} sm={5} style={{ display: "flex", flexDirection: "column",gap:"8px" }}>
                <TypographyNDL variant="heading-02-xs" model value="License Information" />
                <TypographyNDL variant="paragraph-s"color="tertiary" model value="Manage application license and permissions" />
              </Grid>
              <Grid item xs={7} sm={7} style={{ paddingBottom: "20px" }}>
               <LicenceComponent />
              </Grid>
            </Grid>
            </div>
            <HorizontalLine middle variant="divider1" />

            <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark'>
            <Grid container spacing={2} style={{padding:"16px"}} >
              <Grid item xs={5} sm={5} style={{ display: "flex", flexDirection: "column",gap:"8px"  }}>
                <TypographyNDL variant="heading-02-xs"  model value="Shift Calendar" />
                <TypographyNDL variant="paragraph-s" color="tertiary" model value="Streamline scheduling, oversease work hours, coordinate shift planning, and foaster seamless collabration within your industrial workflow." />
              </Grid>
              <Grid item xs={7} sm={7} style={{ paddingBottom: "20px" }}>
                <CalendarComponent />
              </Grid>
            </Grid>
            </div>
            <HorizontalLine middle variant="divider1" />
            <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark'>
            <Grid container spacing={2} style={{padding:"16px"}} >
              <Grid item xs={5} sm={5} style={{ display: "flex", flexDirection: "column",gap:"8px"  }}>
                <TypographyNDL variant="heading-02-xs"  model value="Timeslot" />
                <TypographyNDL variant="paragraph-s" color="tertiary" model value="Effctive oversee energy usage through accurate scheduling for both peak and non-peak hours." />
              </Grid>
              <Grid item xs={7} sm={7} style={{ paddingBottom: "20px" }}>
                <TimeSlotComponent />
              </Grid>
            </Grid>
            </div>
            <HorizontalLine middle variant="divider1" />
            <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark'>
            <Grid container spacing={2}  style={{padding:"16px"}}>
              <Grid item xs={5} sm={5} style={{ display: "flex", flexDirection: "column",gap:"8px"  }}>
                <TypographyNDL variant="heading-02-xs"  model value="Factors" />
                <TypographyNDL variant="paragraph-s"color="tertiary" model value="Customize parameters across different elements such as dashboard aggregation, electricity unit pricing, and primary energy assets to ensure effective monitoring and reporting." />
              </Grid>
              <Grid item xs={7} sm={7} style={{ paddingBottom: "20px" }}>
                <FactorsComponent />
              </Grid>
            </Grid>
            </div>
            <HorizontalLine middle variant="divider1" />
            <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark' >
            <Grid container spacing={2} style={{padding:"16px"}}>
              <Grid item xs={5} sm={5} style={{ display: "flex", flexDirection: "column",gap:"8px"  }}>
                <TypographyNDL variant="heading-02-xs" model value="Energy Contracts" />
                <TypographyNDL variant="paragraph-s"color="tertiary" model value="Organize your energy contracts, track usage, and stay in control of costs." />
              </Grid>
              <Grid item xs={7} sm={7} style={{ paddingBottom: "20px" }}>
                <Contract />
              </Grid>
            </Grid>
            </div>
            <HorizontalLine middle variant="divider1" />
            <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark'>
            <Grid container spacing={2} style={{padding:"16px"}} >
              <Grid item xs={5} sm={5} style={{ display: "flex", flexDirection: "column",gap:"8px"  }}>
                <TypographyNDL variant="heading-02-xs"  model value="Product Energy" />
                <TypographyNDL variant="paragraph-s" color="tertiary"model value="Energy settings of your products for efficient control and insights into energy monitoring" />
              </Grid>
              <Grid item xs={7} sm={7} style={{ paddingBottom: "20px" }}>
                <ProductEnergy />
              </Grid>
            </Grid>
            </div>
            <HorizontalLine middle variant="divider1" />
            </React.Fragment>
          }
      
      </div>

    )
  }
  else {

    return (
      <React.Fragment >
        <div className='py-[14px] px-4 h-[48px] bg-Background-bg-primary dark:bg-Background-bg-primary-dark'>
        <Breadcrumbs breadcrump={listArr} onActive={handleActiveIndex} />
        </div>
        <HorizontalLine variant={'divider1'} />
        <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark'>
         
          {renderComponent()}
        </div>
      </React.Fragment>
    )

  }

}

export default NewLine
