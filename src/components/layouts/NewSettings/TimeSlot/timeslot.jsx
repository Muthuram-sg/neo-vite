/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { useRecoilState } from "recoil";
import moment from "moment";
import { themeMode, selectedPlant, VirtualInstrumentsList, instrumentsList} from "recoilStore/atoms";

import Button from "components/Core/ButtonNDL";
import Toast from "components/Core/Toast/ToastNDL";

import EnhancedTable from "components/Table/Table";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import useAlertConfigurations from "components/layouts/Alarms/hooks/useGetAlertConfigurations.jsx"

//Hooks
import useTimeSlots from "./hooks/useTimeSlot";
import TimeslotModal from "./TimeSlotModal";
import useUpdateTimeSlot from "./hooks/useUpdateTimeSlot";
import LoadingScreenNDL from "LoadingScreenNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import useGetTheme from 'TailwindTheme';
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import Grid from "components/Core/GridNDL";

// NOSONAR start - Need the below state code
export default function Timeslot(props) {
  const { t } = useTranslation();
  const theme = useGetTheme();
  const [openSnack, setOpenSnack] = useState(false);
  const [message, setSnackMessage] = useState('');//NOSONAR
  const [type, setSnackType] = useState('');//NOSONAR
  const [isReading, setIsReading] = useState(true);//NOSONAR
  const [curTheme] = useRecoilState(themeMode);
  const [tabledata, setTableData] = useState([])//NOSONAR
  const [timeslots, setTimeSlots] = useState({});//NOSONAR
  const AddTimeslotRef = useRef();
  const [headPlant] = useRecoilState(selectedPlant);
  const [timeslotenergyasset, setTimeSlotEnergyAsset] = useState([])//NOSONAR
  const [timeslotenergynodes, setTimeSlotEnergyNodes] = useState([])//NOSONAR
  const [vInstruments] = useRecoilState(VirtualInstrumentsList);
  const [instruments] = useRecoilState(instrumentsList);
  const [,setcontractLoader] = useState(false)//NOSONAR
  const { timeslotLoading, timeslotData, timeslotError, getTimeSlots } = useTimeSlots();
  const { updatetimeslotLoading, updatetimeslotData, updatetimeslotError, getupdatetimeslot } = useUpdateTimeSlot();
  const { getAlertConfigurations } = useAlertConfigurations();
  const [page, setPage] = useState('Timeslots')
  const [, setbuttonLoader] = useState(false)//NOSONAR

// NOSONAR end

  const headCells = [
    {
      id: 'S.NO',
      numeric: false,
      disablePadding: true,
      label: t('S.NO'),
    },
    {
      id: 'Slot',
      numeric: false,
      disablePadding: true,
      label: t('Slot'),
    },
    {
      id: 'Starts At',
      numeric: false,
      disablePadding: false,
      label: t('Starts At'),
    },
    {
      id: 'Ends At',
      numeric: false,
      disablePadding: false,
      label: t('Ends At'),
    },
    {
      id: 'Std Energy(kwh)',
      numeric: false,
      disablePadding: false,
      label: t('Std Energy(kwh)'),
    },
    {
      id: 'Std Price (₹)',
      numeric: false,
      disablePadding: false,
      label: t('Std Price (₹)'),
    }
  ];

  useEffect(() => {
    if (!timeslotLoading && !timeslotError && timeslotData) {
      processedrows()
      // callseries()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeslotLoading, timeslotData, timeslotError])


  useEffect(() => {
    getTimeSlots(headPlant.id);
    getAlertConfigurations(headPlant.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant])

  
  useEffect(() => {
    if (!updatetimeslotLoading && !updatetimeslotError && updatetimeslotData) {
        if (updatetimeslotData.update_neo_skeleton_lines.affected_rows >= 1) {
          setcontractLoader(true)
          setPage("Timeslots")
              setcontractLoader(false)
              setSnackMessage(t("TimeSlot Updated"));
              setSnackType("success");
              setOpenSnack(true);
              handleActiveIndex(0)

        } else {
            setSnackMessage(t("Failed to update TimeSlots"));
            setSnackType("warning");
            setOpenSnack(true);
        }
        getTimeSlots(headPlant.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [updatetimeslotLoading, updatetimeslotData, updatetimeslotError])

  const processedrows = () => {
    let temptabledata = []
    setTimeSlots(timeslotData)
    if (!timeslotLoading && !timeslotError && timeslotData) {
      temptabledata = temptabledata.concat(timeslotData.timeslot.timeslots.map((val, index) => {
        let DST1 = moment().format(`YYYY-MM-DDT` + val.startDate) + "Z"
        if (moment(DST1).isDST()) { // Checking for Day-light Saving
            DST1 = moment(DST1).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm:ss`)
        }
        let st = new Date(DST1);
        let st1 = st.toLocaleTimeString('en-GB')
        let st2 = st1.split(":")
        let DST2 = moment().format(`YYYY-MM-DDT` + val.endDate) + "Z"
        if (moment(DST2).isDST()) {
            DST2 = moment(DST2).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm:ss`)
        }
        let et = new Date(DST2);
        let et1 = et.toLocaleTimeString('en-GB')
        let et2 = et1.split(":")
        let start = st2[0] + ":" + st2[1]
        let end = et2[0] + ":" + et2[1];
        return [val.name, start, end, val.stdenergy, val.stdrate]
      })
      )
    }
    setTableData(temptabledata.map((item, index) => [index + 1, ...item]))
    // set energy asset & nodes
    // NOSONAR start - Need this condition
    setTimeSlotEnergyAsset((timeslotData.timeslot && timeslotData.timeslot.energy_asset) ? timeslotData.timeslot.energy_asset : [])
    setTimeSlotEnergyNodes((timeslotData.timeslot && timeslotData.timeslot.nodes) ? timeslotData.timeslot.nodes : [])
    // NOSONAR end 
  }

  const handleTimeslotEdit = (id, data) => {
    setPage("form")
    // NOSONAR 
    props.handleHide(true)//NOSONAR

    AddTimeslotRef.current.handleTimeslotEdit(data);
  }

  //Nodes and energy asset are separately configured for timeslots
  const handleNodes = (e, option) => {
    // NOSONAR
    var tempnodes = []//NOSONAR
    // eslint-disable-next-line array-callback-return
    option.map((val) => {


      let matricVale1 = vInstruments.filter((data) => data.name.toLowerCase() === val.name.toLowerCase())
      if (matricVale1.length > 0) {
        tempnodes.push({ ...e, "id": matricVale1[0].id, "name": matricVale1[0].name, "vi": true })
      }
      let matricVale2 = instruments.filter((data) => data.name.toLowerCase() === val.name.toLowerCase())
      if (matricVale2.length > 0) {
        tempnodes.push({ ...e, "id": matricVale2[0].id, "name": matricVale2[0].name, "vi": false })
      }

    })

    setTimeSlotEnergyNodes(e)

  }

  const onHandleEngAsset = (e) => {
    setTimeSlotEnergyAsset(e.target.value);
  }

  
  const breadcrump = [{ id: 0, name: 'Time Slot' }, { id: 1, name: 'Edit TimeSlot' }]
  const handleActiveIndex = (index) => {
    if (index === 0) {
      setPage('Timeslots')
      // NOSONAR 
      props.handleHide(false)//NOSONAR

    }

  }

  const handleSaveShiftCalendar=()=>{
    setbuttonLoader(true)
    AddTimeslotRef.current.handleTimeslotSave();
  }
  // NOSONAR start - Design working fine
  return (
    <React.Fragment>
        {
                 timeslotLoading && <LoadingScreenNDL /> 
            }

      <Toast type={type} message={message} toastBar={openSnack}  handleSnackClose={() => setOpenSnack(false)} ></Toast>

      <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark h-[48px] px-4 py-2 flex justify-between items-center ' style={{ borderBottom: '1px solid ' + theme.colorPalette.divider, zIndex: '20', width: `calc(100% -"253px"})` }}>
        {
          page === 'Timeslots' ?
            <React.Fragment>
              <Typography value='Time Slot' variant='heading-02-xs' />
              <Button
          type="ghost"
          value={t('Edit')} onClick={(data) => { handleTimeslotEdit(data) }}
        />
            </React.Fragment>

            :
            <React.Fragment>
              <BredCrumbsNDL breadcrump={breadcrump} onActive={handleActiveIndex} />
              <div className="flex gap-2">
                <Button type="secondary" value={t('Cancel')} onClick={() => {setPage('Timeslots');props.handleHide(false)}} />
                <Button type="primary" value={t('Update')} loading={updatetimeslotLoading} onClick={() => handleSaveShiftCalendar()} />
              </div>
            </React.Fragment>
        }
      </div>
      <div >
      <div className='p-4 h-[93vh] bg-Background-bg-secondary  dark:bg-Background-bg-secondary-dark overflow-y-auto' >
      {
page === 'Timeslots' ?
<React.Fragment>
       <Grid container spacing={4}>
        <Grid item xs={4}>
        <SelectBox
            labelId="Energy-Asset"
            id="combo-box-demo-timeslot-energy-asset"
            label={t('Energy Asset')}
            auto={false}
            options={vInstruments}
            isMArray={true}
            value={timeslotenergyasset}
            keyValue="name"
            keyId="id"
            error={false}
            disabled={isReading}
            edit={false}
            onChange={(e, option) => handleNodes(e, option)}
          />
        </Grid>
        <Grid item xs={4}>
          <SelectBox
            labelId="Nodes"
            id="combo-box-demo-timeslot-nodes"
            label={t('Nodes')}
            auto={true}
            multiple={true}
            options={vInstruments.concat(instruments).filter(val => val.id !== timeslotenergyasset)}
            isMArray={true}
            value={timeslotenergynodes}
            keyValue="name"
            keyId="id"
            error={false}
            disabled={isReading}
            edit={false}
            onChange={(e, option) => onHandleEngAsset(e, option)}//NOSONAR
          />
          </Grid> 
          <Grid item xs={4}>
          
          </Grid>
       </Grid>
       <div className="mt-4" />
        <EnhancedTable
          headCells={headCells}
          data={tabledata}
          style={{ backgroundColor: curTheme === 'dark' ? "#000000" : "#ffff" }}
          rawdata={tabledata}
          hidePagination
        />
</React.Fragment>
      :
      <TimeslotModal
      ref={AddTimeslotRef}
      headPlant={headPlant}
      timeslots={timeslots}
      getTimeslotList={() => getTimeSlots(headPlant.id)}
      getupdatetimeslot={getupdatetimeslot}
    />

      }
      </div>

      </div>
    </React.Fragment>
  )
  // NOSONAR end - Design working fine
}
