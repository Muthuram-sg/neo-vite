/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Typography  from "components/Core/Typography/TypographyNDL";
import { useTranslation } from 'react-i18next';
import useTheme from "TailwindTheme";
import { useRecoilState } from "recoil";
import { themeMode, selectedPlant, VirtualInstrumentsList, instrumentsList,snackToggle,snackMessage,snackType } from "recoilStore/atoms";
import CustomTextField from "components/Core/InputFieldNDL"; 
import DatePickerNDL from "components/Core/DatepickerNDL";
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import Button from "components/Core/ButtonNDL";
import Plus from 'assets/plus.svg?react';
import Edit from 'assets/neo_icons/Menu/EditMenu.svg?react';

import moment from "moment";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import useAlertConfigurations from "components/layouts/Alarms/hooks/useGetAlertConfigurations.jsx"
import useDeleteAlarm from 'components/layouts/Alarms/hooks/useDeleteAlarm.jsx';

//Hooks
import useUpdateTimeSlot from "./hooks/useUpdateTimeSlot";
import useTimeSlots from "./hooks/useTimeSlot";

export default function Gateway() {
  const { t } = useTranslation();
  const [isReading, setIsReading] = useState(true);
  const [curTheme] = useRecoilState(themeMode);
  const [addFields, setAddFields] = useState([{ field: 1 }]);
  const [timeslotname, setTimeSlot] = useState([]);
  const [timeslotstandardenergy, setTimeSlotStandardEnergy] = useState([])
  const [timeslotstandardrate, setTimeSlotStandardRate] = useState([])
  const [selectedtimestart, setSelectedtimestart] = useState([]);
  const [selectedtimeend, setSelectedtimeend] = useState([]);
  const [headPlant] = useRecoilState(selectedPlant);
  const theme = useTheme();
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setSnackType] = useRecoilState(snackType);
  const [timeslotenergyasset, setTimeSlotEnergyAsset] = useState([])
  const [timeslotenergynodes, setTimeSlotEnergyNodes] = useState([])
  const [vInstruments] = useRecoilState(VirtualInstrumentsList);
  const [instruments] = useRecoilState(instrumentsList);
  const [TimeDeleteID, setTimeDeleteID] = useState([])

  const { updatetimeslotLoading, updatetimeslotData, updatetimeslotError, getupdatetimeslot } = useUpdateTimeSlot();
  const { timeslotLoading, timeslotData, timeslotError, getTimeSlots } = useTimeSlots();
  const { alertConfigurationsLoading, alertConfigurationsdata, alertConfigurationserror, getAlertConfigurations } = useAlertConfigurations();
  const { getDeleteAlarm } = useDeleteAlarm()


  useEffect(() => {
    if (!updatetimeslotLoading && !updatetimeslotError && updatetimeslotData) {
      if (updatetimeslotData.update_neo_skeleton_lines.affected_rows >= 1) {
        let AlarmRule = !alertConfigurationsLoading && !alertConfigurationserror && alertConfigurationsdata ? alertConfigurationsdata.filter(e=> e.alertType ==="timeslot") : []
        let RuleDelete = []
        // eslint-disable-next-line array-callback-return
        AlarmRule.map(v => {
          if (TimeDeleteID.includes(v.time_slot_id)) {
            RuleDelete.push(v.id)
          }
        })
        if (RuleDelete.length > 0) {
          getDeleteAlarm(RuleDelete)
        }
      
        setSnackMessage(t("TimeSlot Updated"));
        setSnackType("success");
        setOpenSnack(true);
      } else {
        setSnackMessage(t("Failed to update TimeSlots"));
        setSnackType("warning");
        setOpenSnack(true);
      }
    }
    getTimeSlots(headPlant.id);
    setIsReading(true)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatetimeslotLoading, updatetimeslotData, updatetimeslotError])

  useEffect(() => {
    if (!timeslotLoading && !timeslotError && timeslotData) {
      callseries()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeslotLoading, timeslotData, timeslotError])


  useEffect(() => {
    getTimeSlots(headPlant.id);
    getAlertConfigurations(headPlant.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant])

  const callseries = () => {
    let timeslotdatas = {};
    timeslotdatas = timeslotData
    setTimeSlotEnergyAsset((timeslotdatas.timeslot && timeslotdatas.timeslot.energy_asset) ? timeslotdatas.timeslot.energy_asset : [])
    setTimeSlotEnergyNodes((timeslotdatas.timeslot && timeslotdatas.timeslot.nodes) ? timeslotdatas.timeslot.nodes : [])
    if (timeslotdatas.timeslot && timeslotdatas.timeslot.timeslots) {
      var ChannelArrday = [];
      let channelday = [];
      let channels2day = [];
      let channels3day = [];
      let channels4day = [];
      let channels5day = [];
      let objday = {};
      let obj1day = {};
      let obj2day = {};
      let obj3day = {};
      let obj4day = {};
      let obj5day = {}

      for (let j = 0; j < timeslotdatas.timeslot.timeslots.length; j++) {

        try {
          let ID = timeslotdatas.timeslot.timeslots[j].id ? timeslotdatas.timeslot.timeslots[j].id : j+1
          objday = { field: ID }  
          channelday.push(objday)
          let DST1 = moment().format(`YYYY-MM-DDT` + timeslotdatas.timeslot.timeslots[j].startDate) + "Z"
          if (moment(DST1).isDST()) { // Checking for Day-light Saving
            DST1 = moment(DST1).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm:ss`)
          }
          let st = new Date(DST1);
          let st1 = st.toLocaleTimeString('en-GB')
          let st2 = st1.split(":")
          let DST2 = moment().format(`YYYY-MM-DDT` + timeslotdatas.timeslot.timeslots[j].endDate) + "Z"
          if (moment(DST2).isDST()) {
            DST2 = moment(DST2).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm:ss`)
          }
          let et = new Date(DST2);
          let et1 = et.toLocaleTimeString('en-GB')
          let et2 = et1.split(":")
          obj1day[ID] = timeslotdatas.timeslot.timeslots[j].name;
          let T1 = st2[0] + ":" + st2[1]
          let c1 = et2[0] + ":" + et2[1];
          obj2day[ID] = T1;
          obj3day[ID] = c1;
          obj4day[ID] = timeslotdatas.timeslot.timeslots[j].stdenergy;
          obj5day[ID] = timeslotdatas.timeslot.timeslots[j].stdrate;
          ChannelArrday.push(obj1day);
          channels2day.push(obj2day);
          channels3day.push(obj3day);
          channels4day.push(obj4day);
          channels5day.push(obj5day);
        }
        catch (err) {
          console.log("error at TimeSlot", err)
        }

      }
      
      setAddFields(channelday)
      setTimeSlot(ChannelArrday);
      setSelectedtimeend(channels3day)
      setSelectedtimestart(channels2day)
      setTimeSlotStandardEnergy(channels4day);
      setTimeSlotStandardRate(channels5day)

    }

  }
  //Add a new time slot
  const addnewlineitem = (val) => {
    let setelement = [...addFields];
    const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field)+1 : 1;
    const lasttime = selectedtimeend[0][lastfield - 1]
    const lastSlot = timeslotname[0][lastfield - 1]
    setelement.push({ field: lastfield });
    if(lastSlot){
      setAddFields(setelement);
      handletimetoChange(typeof (lasttime) === "string" ?
      new Date(moment().format(`YYYY-MM-DDT` + lasttime + `:00Z`))
      : lasttime, lastfield)
      handletimefromChange(typeof (lasttime) === "string" ?
        new Date(moment().format(`YYYY-MM-DDT` + lasttime + `:00Z`))
        : lasttime, lastfield)
    }else{
        setSnackMessage(t("PleaseSlotdetails"));
        setSnackType("warning");
        setOpenSnack(true);
    }
    
 
    
  }

  const removeChannel = (val) => {
    let setelement = [...addFields];
    let slotname = [...timeslotname];
    let energyArr = [...timeslotstandardenergy];
    let standardrateArr = [...timeslotstandardrate];
    let timeto = [...selectedtimeend];
    let timestart = [...selectedtimestart];
    let DelID = [...TimeDeleteID]
    delete slotname[0][val];
    delete energyArr[0][val];
    delete standardrateArr[0][val];
    delete timeto[0][val];
    delete timestart[0][val];
    setTimeSlot(slotname);
    setSelectedtimeend(timeto)
    setSelectedtimestart(timestart)
    setTimeSlotStandardEnergy(energyArr);
    setTimeSlotStandardRate(standardrateArr)
    DelID.push(val)
    setTimeDeleteID(DelID)
    
    let removed = setelement.filter(x => x.field !== val);
    setAddFields(removed);

  }

  const handlecancelClick = () => {
    getTimeSlots(headPlant.id)
    setIsReading(true)
    setTimeDeleteID([])
  }

  const handletimeslotChange = (e, field) => {
    var ChannelArr = [...timeslotname];
    if (ChannelArr.length === 0) {
      let obj = {};
      obj[field] = e.target.value;
      ChannelArr.push(obj);
      setTimeSlot(ChannelArr);
    } else {
      ChannelArr[0][field] = e.target.value;
      setTimeSlot(ChannelArr);
    }
  }

  const handletimeslotstandardenergyChange = (e, field) => {
    var ChannelArr = [...timeslotstandardenergy];
    if (ChannelArr.length === 0) {
      let obj = {};
      obj[field] = e.target.value;
      ChannelArr.push(obj);
      setTimeSlotStandardEnergy(ChannelArr);
    } else {
      ChannelArr[0][field] = e.target.value;
      setTimeSlotStandardEnergy(ChannelArr);
    }
  }


  const handletimeslotstandardrateChange = (e, field) => {
    var ChannelArr = [...timeslotstandardrate];
    if (ChannelArr.length === 0) {
      let obj = {};
      obj[field] = e.target.value;
      ChannelArr.push(obj);
      setTimeSlotStandardRate(ChannelArr);
    } else {
      ChannelArr[0][field] = e.target.value;
      setTimeSlotStandardRate(ChannelArr);
    }
  }
  const utchours = (e) => {
    let st = new Date(moment().utc().format(`YYYY-MM-DDT` + e));
    let st1 = st.getUTCHours();
    if (moment(new Date()).isDST()) { // Checking for Day-light Saving
      st1 = st1 === 23 ? 0 : st.getUTCHours() + 1;
    }
    if (st1 < 10) {
      st1 = "0" + st1
    }
    let St2 = st.getUTCMinutes();
    if (St2 < 10) {
      St2 = "0" + St2
    }
    return  st1 + ":" + St2;
   
  }

  const handletimetoChange = (e, field) => {
    var timeto = [...selectedtimeend];
    var timestart = [...selectedtimestart];
    if (timeto.length === 0) {
      let obj = {};
      obj[field] = e;
      timeto.push(obj);
      timestart[0][field + 1] = e;
      setSelectedtimestart(timestart)
      setSelectedtimeend(timeto);
    } else {
      timestart[0][field + 1] = e;
      timeto[0][field] = e;
      setSelectedtimestart(timestart)
      setSelectedtimeend(timeto);
    }
  };

  const handletimefromChange = (e, field) => {
    let timestart = [...selectedtimestart];
    if (timestart.length === 0) {
      let obj = {};
      obj[field] = e;
      timestart.push(obj);
      setSelectedtimestart(timestart);
    } else {
      timestart[0][field] = e;
      setSelectedtimestart(timestart);
    }

  };

  const timeslotnotification = (message, type) => {
    setSnackMessage(message);
    setSnackType(type);
    setOpenSnack(true);
  }

  const addcalendervalue = () => {
    var flag = 0
    try {
      let finalobjs = [...[timeslotname[0]], ...[selectedtimestart[0]], ...[selectedtimeend[0]], ...[timeslotstandardenergy[0]],
      ...[timeslotstandardrate[0]]];
      const obj = {};
      let datarrays = [];
      for (let key in finalobjs[2]) {
        const name = finalobjs[0]
        const startDate = finalobjs[1];
        const endDate = finalobjs[2];
        const stdenergy = finalobjs[3]
        const stdrate = finalobjs[4]
        let Id = addFields
        let filteredID = Id.filter(e=> e.field === Number(key))
        const addzeros = (hrs, type) => {
          if(moment(new Date()).isDST() && type === 'hr'){ 
            // Checking for Day-light Saving
            hrs = hrs === 23 ? 0 : hrs + 1
          }

          if (hrs < 10) {
            hrs = "0" + hrs
          }
          return hrs
        }
       
        let extractedValue;

          if (name) {
              extractedValue = (name[key] === undefined || name[key] === '') ? "-" : name[key];
          } else {
              extractedValue = "-";
          }

          let extractedStartDate;

              if (startDate) {
                  if (startDate[key] !== null) {
                      if (typeof startDate[key] === "string") {
                        extractedStartDate = utchours(startDate[key]);
                      } else {
                          const Hours = addzeros(new Date(startDate[key]).getUTCHours(), 'hr');
                          const minutes = addzeros(new Date(startDate[key]).getUTCMinutes());

                          extractedStartDate = Hours + ":" + (minutes !== undefined ? minutes : null);
                      }
                  } else {
                    extractedStartDate = null;
                  }
              } else {
                extractedStartDate = null;
              }

          let extractedEndDate;

          if (endDate) {
              if (endDate[key] !== null) {
                  if (typeof endDate[key] === "string") {
                    extractedEndDate = utchours(endDate[key]);
                  } else {
                      const Hours = addzeros(new Date(endDate[key]).getUTCHours(), 'hr');
                      const minutes = addzeros(new Date(endDate[key]).getUTCMinutes());

                      extractedEndDate = Hours + ":" + (minutes !== undefined ? minutes : null);
                  }
              } else {
                extractedEndDate = null;
              }
          } else {
            extractedEndDate = null;
          }

          let extractedStdRate;

              if (stdrate) {
                  if (stdrate[key] === undefined || stdrate[key] === '') {
                    extractedStdRate = "-";
                  } else {
                    extractedStdRate = stdrate[key];
                  }
              } else {
                extractedStdRate = "-";
              }
              let stdEnergyValue;

              if (stdenergy) {
                if (stdenergy[key] === undefined || stdenergy[key] === '') {
                  stdEnergyValue = "-";
                } else {
                  stdEnergyValue = stdenergy[key];
                }
              }
              



        obj[key] = {
          name: extractedValue,
          startDate: extractedStartDate,
          endDate: extractedEndDate,
          stdenergy:stdEnergyValue,
          stdrate:extractedStdRate,
          startTime: typeof (startDate[key]) === "string" ? new Date(moment().format(`YYYY-MM-DDT` + startDate[key] + `:00`)) :
            new Date(startDate[key]),
          endTime: typeof (endDate[key]) === "string" ? new Date(moment().format(`YYYY-MM-DDT` + endDate[key] + `:00`)) :
            new Date(endDate[key]),
            id: filteredID.length > 0 && filteredID[0].field  
        } 
        
        datarrays.push(obj[key]) 
      }
     
      if (datarrays.length > 0) {
        if (datarrays[0].startDate !== datarrays[datarrays.length - 1].endDate && selectedtimeend[0][`field${[datarrays.length]}`] !== "") {
          setSelectedtimeend(prevSelectedTimeEnd => {
            const newSelectedTimeEnd = [...prevSelectedTimeEnd]; // Create a new array to trigger re-render
            newSelectedTimeEnd[0][`field${[datarrays.length]}`] = "";
            return newSelectedTimeEnd;
          });
        }
      }
      
      let finalarray = []
      var hours = 0
      // eslint-disable-next-line array-callback-return
      addFields.forEach((val, i) => {
        if (val.field && datarrays[i] !== undefined) {
          if (datarrays[i].startDate && datarrays[i].endDate) {
            const currslotstart = datarrays[i].startTime
            const currslotend = datarrays[i].endTime
            const slotname = datarrays[i].name
            var duration = currslotstart.getTime() > currslotend.getTime() ?
              moment.duration(moment(currslotend).add(1, 'day').diff(moment(currslotstart)))
              : moment.duration(moment(currslotend).diff(moment(currslotstart)))
            hours = hours + duration.asHours();
            var overlap = finalarray.findIndex(s => {
              return (
                (s.startTime.getTime() <= currslotstart.getTime() && currslotstart.getTime() < s.endTime.getTime()) ||
                (currslotend.getTime() > s.startTime.getTime() && currslotend.getTime() < s.endTime.getTime())
              )
            })
            var duplicaterecords = finalarray.filter(s => s.name.replaceAll(' ', '').toLowerCase() === slotname.replaceAll(' ', '').toLowerCase())
            if (currslotstart.getTime() === currslotend.getTime()) {
              timeslotnotification(t("StartTime and EndTime can not be the same"), "warning")
              flag = 1;
            }
            if (overlap >= 0) {
              timeslotnotification(t("Timeslots can not overlap"), "warning")
              flag = 1
            }
            if (hours > 24) {
              timeslotnotification(t("Overall duration can not exceed 24 hours"), "warning")
              flag = 1
            }
            if (duplicaterecords.length > 0) {
              timeslotnotification(t("Duplicate slotnames are not allowed"), "warning")
              flag = 1
            }
            finalarray.push(datarrays[i])
          }
        }
      })
      
      if (finalarray.length === 0) {
        finalarray = [{ "name": '', startDate: '00:00', endDate: "00:00", stdenergy: '', stdrate: '' }];
      }
      let datas = {
        "timeslots": finalarray,
        "Nooftimeslots": finalarray.length,
        "nodes": timeslotenergynodes,
        "energy_asset": timeslotenergyasset
      }
      if (flag === 0) {
        getupdatetimeslot({ line_id: headPlant.id, timeslot: datas })

      }

    }
    catch (error) {
      console.log(error, "updatefailed")
      timeslotnotification(t("Failed to update TimeSlots"), "warning")
      getTimeSlots(headPlant.id);
      setIsReading(true)
    }



  }

  //Nodes and energy asset are separately configured for timeslots
  const handleNodes = (e, option) => {
   

    setTimeSlotEnergyNodes(e)

  }



  const onHandleEngAsset = (e,option) => {
    setTimeSlotEnergyAsset(e.target.value);
  }

  

  return (
    <React.Fragment> 
      <div  style={{display: 'flex',justifyContent: 'flex-end',columnGap: '8px',padding:"16px 16px 0px 16px"}}>
      {isReading ?
        <Button
          type="ghost"
          style={{ float: "right",width:"100px" }}
          value={t('Edit')} onClick={() => { setIsReading(false); }}
          icon={Edit}
        />
        :
        <React.Fragment> 

          
          <Button
            type="secondary"
            style={{ float: "right", marginRight: "4px",width:"100px" }}
            onClick={() => { handlecancelClick() }}
            value={t('Cancel')} />

            <Button
            type="primary"
            style={{ float: "right",width:"100px" }}
            onClick={() => { addcalendervalue() }}
            
            value={t('Save')} />
        </React.Fragment>
        
      }
      </div>
      {addFields.map(val => {

let initialStartDate1;

if (
  selectedtimestart &&
  selectedtimestart.length > 0 &&
  selectedtimestart[0] !== undefined &&
  selectedtimestart[0][val.field] !== undefined
) {
 
if (selectedtimestart[0][val.field] === null) {
  initialStartDate1 = new Date(moment().format(`YYYY-MM-DDT${selectedtimeend[0][val.field - 1]}`));
} else if (typeof selectedtimestart[0][val.field] === "string") {
  initialStartDate1 = new Date(moment().format(`YYYY-MM-DDT${selectedtimestart[0][val.field]}`));
} else {
  initialStartDate1 = new Date(selectedtimestart[0][val.field]);
}
} else if (
  selectedtimeend &&
  selectedtimeend.length > 0 &&
  selectedtimeend[0] !== undefined
) {
  initialStartDate1 = new Date(moment().format(`YYYY-MM-DDT${selectedtimeend[0][val.field - 1]}`));
} else {
  // Handle the case where both selectedtimestart and selectedtimeend are undefined or null
  initialStartDate1 = new Date(); // You might want to provide a default date or handle it differently
}

        
let initialEndDate1;

if (
  selectedtimeend &&
  selectedtimeend.length > 0 &&
  selectedtimeend[0] !== undefined &&
  selectedtimeend[0][val.field] !== undefined
) {
  if (selectedtimeend[0][val.field] === null) {
    initialEndDate1 = new Date(moment().format(`YYYY-MM-DDT${selectedtimeend[0][val.field - 1]}`));
  } else if (typeof selectedtimeend[0][val.field] === 'string') {
    initialEndDate1 = new Date(moment().format(`YYYY-MM-DDT${selectedtimeend[0][val.field]}`));
  } else {
    initialEndDate1 = new Date(selectedtimeend[0][val.field]);
  }
} else if (selectedtimeend && selectedtimeend.length > 0) {
  initialEndDate1 = new Date(moment().format(`YYYY-MM-DDT${selectedtimeend[0][val.field - 1]}`));
} else {
  // Handle the case where both selectedtimeend and selectedtimeend[0] are undefined or null
  initialEndDate1 = new Date(); // You might want to provide a default date or handle it differently
}

        let initialValue1;

            if (
              selectedtimestart &&
              selectedtimestart[0] !== undefined &&
              selectedtimestart[0][val.field] !== undefined
            ) {
              if (selectedtimestart[0][val.field] === null) {
                initialValue1 = '';
              } else if (typeof selectedtimestart[0][val.field] !== 'string') {
                initialValue1 = moment(new Date(selectedtimestart[0][val.field])).format('HH:mm');
              } else {
                initialValue1 = moment(new Date(moment().format(`YYYY-MM-DDT${selectedtimestart[0][val.field]}:00Z`))).format('HH:mm');
              }
            }
            let endValue;

                  if (
                    selectedtimeend &&
                    selectedtimeend[0] !== undefined &&
                    selectedtimeend[0][val.field] !== undefined
                  ) {
                    if (selectedtimeend[0][val.field] === null) {
                      endValue = '';
                    } else if (typeof selectedtimeend[0][val.field] !== 'string') {
                      endValue = moment(new Date(selectedtimeend[0][val.field])).format('HH:mm');
                    } else {
                      endValue = moment(new Date(moment().format(`YYYY-MM-DDT${selectedtimeend[0][val.field]}:00Z`))).format('HH:mm');
                    }
                  }

        return (

          <div key={val.field} style={{ alignItems: "self-end", display: "flex", padding: 16 }}>
            <div style={{ marginRight: 16 }}>
              <div >
                <Typography
                  className={{
                    marginTop: 10,
                    fontSize: '14px',
                    lineHeight: '24px',
                    color: curTheme === 'light' ? theme.palette.secondary : "#A6A6A6",
                    fontWeight: 600
                  }}
                  variant="heading-02-sm"
                  value={t('Slot Name')}
                /></div>
              <CustomTextField
                id="time-slot-name"
                defaultValue={timeslotname[0] ? timeslotname[0][val.field] : ''}
                value={timeslotname[0] ? timeslotname[0][val.field] : ""}
                style={{ width: '98%' }}
                onChange={(e) => handletimeslotChange(e, val.field)}
                size="small"
                variant="outlined"
                disabled={isReading}
              />
            </div>
            <div style={{ marginRight: 16 }}>
              <div >
                <Typography
                  className={{
                    marginTop: 10,
                    fontSize: '14px',
                    lineHeight: '24px',
                    color: curTheme === 'light' ? theme.palette.secondary : "#A6A6A6",
                    fontWeight: 600
                  }}
                  variant="heading-02-sm"
                  value={t('Standard Energy (kwh)')} /></div>
              <CustomTextField
                id="standard-energy"
                defaultValue={timeslotstandardenergy[0] ? timeslotstandardenergy[0][val.field] : ''}
                value={timeslotstandardenergy[0] ? timeslotstandardenergy[0][val.field] : ""}
                style={{ width: '98%' }}
                onChange={(e) => handletimeslotstandardenergyChange(e, val.field)}
                size="small"
                variant="outlined"
                disabled={isReading}
              />
            </div>
            <div style={{ marginRight: 16 }}>
              <div >
                <Typography
                  className={{
                    marginTop: 10,
                    fontSize: '14px',
                    lineHeight: '24px',
                    color: curTheme === 'light' ? theme.palette.secondary : "#A6A6A6",
                    fontWeight: 600
                  }}
                  variant="heading-02-sm"
                  value={t('Standard Rate (Rupees)')}
                /></div>
              <CustomTextField
                id="standard-rate"
                defaultValue={timeslotstandardrate[0] ? timeslotstandardrate[0][val.field] : ''}
                value={timeslotstandardrate[0] ? timeslotstandardrate[0][val.field] : ""}
                style={{ width: '98%' }}
                onChange={(e) => handletimeslotstandardrateChange(e, val.field)}
                size="small"
                variant="outlined"
                disabled={isReading}
              />
            </div>
            <div style={{ marginRight: 16 }}>
              <div >
                <Typography
                  className={{
                    marginTop: 10,
                    fontSize: '14px',
                    lineHeight: '24px',
                    color: curTheme === 'light' ? theme.palette.secondary : "#A6A6A6",
                    fontWeight: 600
                  }}
                  variant="heading-02-sm"
                  value={t("Starts At")} /></div>
              {!isReading ?
                <DatePickerNDL
                      id={"Time-picker-start"+val.field}
                      onChange={(e) => {
                        handletimefromChange(e, val.field)
                                      }} 
                      startDate={initialStartDate1}
                      showTimeSelectOnly  
                      dateFormat="HH:mm"
                      timeFormat="HH:mm:ss"
                />
                
                :
                <CustomTextField
                  id="starts-at"
                  value={initialValue1}
                  style={{ width: '98%' }}
                  size="small"
                  variant="outlined"
                  disabled={true}
                />
              }
            </div>
            <div>
              <div >
                <Typography
                  className={{
                    marginTop: 10,
                    fontSize: '14px',
                    lineHeight: '24px',
                    color: curTheme === 'light' ? theme.palette.secondary : "#A6A6A6",
                    fontWeight: 600
                  }}
                  variant="heading-02-sm"
                  value={t("Ends at")} /></div>
              {!isReading ?
                <DatePickerNDL
                      id={"Time-picker-end"+val.field}
                      onChange={(e) => {
                        handletimetoChange(e, val.field)
                                      }} 
                      startDate={initialEndDate1}
                      showTimeSelectOnly  
                      dateFormat="HH:mm"
                      timeFormat="HH:mm:ss"
                />
                
                :
                <CustomTextField
                  id="ends-at"
                  value= {endValue}
                  style={{ width: '98%', }}
                  size="small"
                  variant="outlined"
                  disabled={true}
                />
              }
            </div>
            <div style={{ cursor: "pointer" }}>
              {val.field !== 1 && !isReading ? (
                <Delete
                  stroke={"#FF0D00"}
                  onClick={() => { removeChannel(val.field) }} />
              ) : <React.Fragment></React.Fragment>}
            </div>
          </div>

        )
      })
      }
      {!isReading && addFields.length < 8 ?
        <div style={{ padding: '0 10px', width: "60%", display: "flex", justifyContent: TimeDeleteID.length > 0 ? "space-between" : "end", alignContent: "center" }}>
          {TimeDeleteID.length > 0 &&
            <span style={{ color: 'red' }}>{t('TimeSlotDeleteNote')}</span>}
          <Button type="ghost" onClick={() => { addnewlineitem(addFields.field) }} value={t('AddField')} icon={Plus} />
        </div>
        : <React.Fragment></React.Fragment>
      }
      <div style={{width: "60%"}}>
      <div style={{ padding: 16 }}>
        <SelectBox
          labelId="Energy-Asset"
          id="combo-box-demo-timeslot-energy-asset"
          label={t('Energy Asset')}
          auto={false}
          options={vInstruments}
          isMArray={true}
          value={timeslotenergyasset}
          onChange={(e, option) => onHandleEngAsset(e, option)}
          keyValue="name"
          keyId="id"
          error={false}
          disabled={isReading}
          edit={true}
        />
      </div>
      <div style={{ padding: 16 }}>
        <SelectBox
          labelId="Nodes"
          id="combo-box-demo-timeslot-nodes"
          label={t('Nodes')}
          auto={true}
          multiple={true}
          options={vInstruments.concat(instruments).filter(val => val.id !== timeslotenergyasset)}
          isMArray={true}
          value={timeslotenergynodes}
          onChange={(e, option) => handleNodes(e, option)}
          keyValue="name"
          keyId="id"
          error={false}
          disabled={isReading}
          edit={true}
        />
      </div>
      </div>
    </React.Fragment>
  )
}
