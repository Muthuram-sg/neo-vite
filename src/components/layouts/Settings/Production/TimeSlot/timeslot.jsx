/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { useRecoilState } from "recoil";
import moment from "moment";
import { themeMode, selectedPlant, VirtualInstrumentsList, instrumentsList, snackToggle, snackMessage, snackType } from "recoilStore/atoms";

import Button from "components/Core/ButtonNDL";
import Toast from "components/Core/Toast/ToastNDL";
import Edit from 'assets/neo_icons/Menu/EditMenu.svg?react';

import EnhancedTable from "components/Table/Table";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import useAlertConfigurations from "components/layouts/Alarms/hooks/useGetAlertConfigurations.jsx"

//Hooks
import useTimeSlots from "./hooks/useTimeSlot";
import TimeslotModal from "./TimeSlotModal";
import useUpdateTimeSlot from "./hooks/useUpdateTimeSlot";
import LoadingScreenNDL from "LoadingScreenNDL";
export default function Timeslot() {
  const { t } = useTranslation();
  const [openSnack, setOpenSnack] = useState(false);
  const [message, setSnackMessage] = useState('');
  const [type, setSnackType] = useState('');
  const [isReading, setIsReading] = useState(true);
  const [curTheme] = useRecoilState(themeMode);
  const [tabledata, setTableData] = useState([])
  const [timeslots, setTimeSlots] = useState({});
  const AddTimeslotRef = useRef();
  const [headPlant] = useRecoilState(selectedPlant);
  const [timeslotenergyasset, setTimeSlotEnergyAsset] = useState([])
  const [timeslotenergynodes, setTimeSlotEnergyNodes] = useState([])
  const [vInstruments] = useRecoilState(VirtualInstrumentsList);
  const [instruments] = useRecoilState(instrumentsList);
  const [contractLoader,setcontractLoader] = useState(false)
  const { timeslotLoading, timeslotData, timeslotError, getTimeSlots } = useTimeSlots();
  const { updatetimeslotLoading, updatetimeslotData, updatetimeslotError, getupdatetimeslot } = useUpdateTimeSlot();
  const { getAlertConfigurations } = useAlertConfigurations();

  const headCells = [
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
          setTimeout(()=>{
              setcontractLoader(false)
              setSnackMessage(t("TimeSlot Updated"));
              setSnackType("success");
              setOpenSnack(true);
          },3000)
           
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
    var temptabledata = []
    setTimeSlots(timeslotData)
    if (!timeslotLoading && !timeslotError && timeslotData) {
      temptabledata = temptabledata.concat(timeslotData.timeslot.timeslots.map((val, index) => {
        let DST1 = moment().format(`YYYY-MM-DDT` + val.startDate) + "Z"
        if (moment(DST1).isDST()) { // Checking for Day-light Saving
            DST1 = moment(DST1).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm:ss`)
        }
        let st = new Date(DST1);
        // let st = new Date(moment().format(`YYYY-MM-DDT` + timeslotdatas.timeslot.timeslots[j].startDate) + 'Z');
        let st1 = st.toLocaleTimeString('en-GB')
        let st2 = st1.split(":")
        let DST2 = moment().format(`YYYY-MM-DDT` + val.endDate) + "Z"
        if (moment(DST2).isDST()) {
            DST2 = moment(DST2).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm:ss`)
        }
        let et = new Date(DST2);
        // let et = new Date(moment().format(`YYYY-MM-DDT` + timeslotdatas.timeslot.timeslots[j].endDate) + 'Z');
        let et1 = et.toLocaleTimeString('en-GB')
        let et2 = et1.split(":")
        let start = st2[0] + ":" + st2[1]
        let end = et2[0] + ":" + et2[1];
        return [val.name, start, end, val.stdenergy, val.stdrate]
      })
      )
    }
    setTableData(temptabledata)
    // set energy asset & nodes
    setTimeSlotEnergyAsset((timeslotData.timeslot && timeslotData.timeslot.energy_asset) ? timeslotData.timeslot.energy_asset : [])
    setTimeSlotEnergyNodes((timeslotData.timeslot && timeslotData.timeslot.nodes) ? timeslotData.timeslot.nodes : [])
  }

  const handleTimeslotEdit = (id, data) => {
    AddTimeslotRef.current.handleTimeslotEdit(data);
  }

  //Nodes and energy asset are separately configured for timeslots
  const handleNodes = (e, option) => {
    var tempnodes = []
    // eslint-disable-next-line array-callback-return
    option.map((val) => {
      // if (val.id) {
      //   tempnodes.push({ "id": val.id, "name": val.name })
      // } else {

      var matricVale1 = vInstruments.filter((data) => data.name.toLowerCase() === val.name.toLowerCase())
      if (matricVale1.length > 0) {
        tempnodes.push({ ...e, "id": matricVale1[0].id, "name": matricVale1[0].name, "vi": true })
      }
      var matricVale2 = instruments.filter((data) => data.name.toLowerCase() === val.name.toLowerCase())
      if (matricVale2.length > 0) {
        tempnodes.push({ ...e, "id": matricVale2[0].id, "name": matricVale2[0].name, "vi": false })
      }

      // }
    })

    setTimeSlotEnergyNodes(e)

  }

  const onHandleEngAsset = (e) => {
    setTimeSlotEnergyAsset(e.target.value);
  }

  return (
    <React.Fragment>
        {
                 contractLoader && <LoadingScreenNDL /> 
            }

      <Toast type={type} message={message} toastBar={openSnack}  handleSnackClose={() => setOpenSnack(false)} ></Toast>
      <div className="h-10">
        <Button
          type="ghost"
          style={{ float: "right", width: "100px"}}
          value={t('Edit')} onClick={(data) => { handleTimeslotEdit(data) }}
          //icon={Edit}
        />
</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', columnGap: '8px', padding: "16px 0px 16px 0px" }}>
        
      <div style={{ width: "100%" }}>
        <div style={{ paddingRight: 16, float: "left", width: "50%" }}>
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
        </div>
        <div style={{ float: "left", width: "50%" }}>
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
            onChange={(e, option) => onHandleEngAsset(e, option)}
          />
        </div>
      </div>
      
      </div>
      <TimeslotModal
        ref={AddTimeslotRef}
        headPlant={headPlant}
        timeslots={timeslots}
        getTimeslotList={() => getTimeSlots(headPlant.id)}
        getupdatetimeslot={getupdatetimeslot}
      />
      <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark mt-3' >
        <EnhancedTable
          headCells={headCells}
          data={tabledata}
          style={{ backgroundColor: curTheme === 'dark' ? "#000000" : "#ffff" }}
          rawdata={!timeslotLoading && !timeslotError && timeslotData ? timeslotData : []}
          hidePagination
        />
      </div>

    </React.Fragment>
  )
}
