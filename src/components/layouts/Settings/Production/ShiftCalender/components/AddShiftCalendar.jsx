import React, { useState, useEffect, useImperativeHandle } from 'react'
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL'
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL'
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL'
import TypographyNDL from 'components/Core/Typography/TypographyNDL'
import Grid from "components/Core/GridNDL";
import RadioNDL from 'components/Core/RadioButton/RadioButtonNDL';
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import moment from 'moment';
import DatePickerNDL from "components/Core/DatepickerNDL";
import ParagraphText from 'components/Core/Typography/TypographyNDL';
import CustomTextField from "components/Core/InputFieldNDL";
import Button from 'components/Core/ButtonNDL'
import Toast from "components/Core/Toast/ToastNDL";
import { useTranslation } from "react-i18next";
import Chart from "react-apexcharts";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';


const AddShiftCalendar = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [openSnack, setOpenSnack] = useState(false);
  const [message, setSnackMessage] = useState('');
  const [type, setSnackType] = useState('');

  const [shiftDialog, setShiftDialog] = useState(false);
  const [isReading, setIsReading] = useState(true);
  const [addFields, setAddFields] = useState([{ field: 1 }]);
  const [addsun, setAddsun] = useState([{ field: 1 }]);
  const [addmon, setAddmon] = useState([{ field: 1 }]);
  const [addtue, setAddtue] = useState([{ field: 1 }]);
  const [addwed, setAddwed] = useState([{ field: 1 }]);
  const [addthu, setAddthu] = useState([{ field: 1 }]);
  const [addfri, setAddfri] = useState([{ field: 1 }]);
  const [addsat, setAddsat] = useState([{ field: 1 }]);
  const [selectedtimestart, setSelectedtimestart] = useState([]);
  const [selectedtimeend, setSelectedtimeend] = useState([]);
  const [sundaytimestart, setSundaytimestart] = useState([]);
  const [sundaytimend, setSundaytimend] = useState([]);
  const [montimend, setMontimend] = useState([]);
  const [montimestart, setMontimestart] = useState([]);
  const [shiftnameday, setShiftnameday] = useState([]);
  const [shiftnamesun, setShiftnamesun] = useState([]);
  const [shiftnamemon, setShiftnamemon] = useState([]);
  const [shiftnametue, setShiftnametue] = useState([]);
  const [tuetimend, setTuetimend] = useState([]);
  const [tuetimestart, setTuetimestart] = useState([]);
  const [shiftnamewed, setShiftnamewed] = useState([]);
  const [wedtimend, setWedtimend] = useState([]);
  const [wedtimestart, setWedtimestart] = useState([]);
  const [shiftnamethu, setShiftnamethu] = useState([]);
  const [thutimend, setThutimend] = useState([]);
  const [thutimestart, setThutimestart] = useState([]);
  const [shiftnamefri, setShiftnamefri] = useState([]);
  const [fritimend, setFritimend] = useState([]);
  const [fritimestart, setFritimestart] = useState([]);
  const [shiftnamesat, setShiftnamesat] = useState([]);
  const [sattimend, setSattimend] = useState([]);
  const [sattimestart, setSattimestart] = useState([]);
  const [series, setSeries] = useState([])
  const [dayslistval,] = useState([{ "0": "Sunday", "1": "Monday", "2": "Tuesday", "3": "Wednesday", "4": "Thursday", "5": "Friday", "6": "Saturday" }])
  const [dailydata,] = useState({
    "shifts": {
      "0": [
        {
          "name": "sunday shift 1",
          "endDate": "6:00",
          "startDate": "12:00"
        },
        {
          "name": "sunday shift 2",
          "endDate": "12:00",
          "startDate": "23:00"
        }
      ],
      "1": [
        {
          "name": "monday ",
          "endDate": "18:00",
          "startDate": "06:00"
        }
      ],
      "2": [
        {
          "name": "Tuesday ",
          "endDate": "18:00",
          "startDate": "09:9"
        }
      ],
      "3": [
        {
          "name": "Wednesday",
          "endDate": "18:00",
          "startDate": "09:00"
        }
      ],
      "4": [
        {
          "name": "Thusrday",
          "endDate": "18:00",
          "startDate": "09:00"
        }
      ],
      "5": [
        {
          "name": "Friday",
          "endDate": "18:00",
          "startDate": "09:00"
        }
      ],
      "6": [
        {
          "name": "Saturday",
          "endDate": "18:00",
          "startDate": "09:00"
        }
      ]
    },
    "Noofshift": 4
  })


  // const { updateshiftwithoutIDLoading, updateshiftwithoutIDData, updateshiftwithoutIDError, getupdateshiftwithoutID } = useUpdateShift()

  const handleReading = () => {
    setIsReading(!isReading);
  }
  useEffect(() => {
    if(props.shiftData)
      callseries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.shiftData])

  
  useImperativeHandle(ref, () =>
  (
    {
      handleShiftEdit: (data) => {
        setShiftDialog(true);
      }

    }
  ))

  const callseries = () => {
    let shitdatas = {}; 
    if (props.shiftData) {
      shitdatas = props.shiftData

      if (shitdatas.shift && shitdatas.shift.shifts) {
        if (shitdatas.shift.ShiftType === "Weekly") {
          setIsReading(true);
          for (let i = 0; i < Object.keys(shitdatas.shift.shifts).length; i++) {
            if (Object.keys(shitdatas.shift.shifts)[i] === '0') {
              var ChannelArrsun = [];
              let channelsun = [];
              let channels2sun = [];
              let channels3sun = [];
              let objsun = {};
              let obj1sun = {};
              let obj2sun = {};
              let obj3sun = {};
              for (let j = 0; j < shitdatas.shift.shifts[i].length; j++) {
                obj1sun = { field: j + 1 }
                channelsun.push(obj1sun)
                setAddsun(channelsun)
                let DST1 = moment().format(`YYYY-MM-DDT` + shitdatas.shift.shifts[i][j].startDate) + 'Z'
                if (moment(DST1).isDST()) { // Checking for Day-light Saving
                  DST1 = moment(DST1).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                }
                let st = new Date(DST1);
                let st1 = st.toLocaleTimeString('en-GB');
                let st2 = st1.split(":")

                let DST2 = moment().format(`YYYY-MM-DDT` + shitdatas.shift.shifts[i][j].endDate) + 'Z'
                if (moment(DST2).isDST()) {
                  DST2 = moment(DST2).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                }
                let et = new Date(DST2);
                let et1 = et.toLocaleTimeString('en-GB')
                let et2 = et1.split(":")
                objsun[j + 1] = shitdatas.shift.shifts[i][j].name;
                let T1 = st2[0] + ":" + st2[1];
                // let st1= T1.split(":")
                let c1 = et2[0] + ":" + et2[1];
                obj2sun[j + 1] = T1;
                obj3sun[j + 1] = c1;
                ChannelArrsun.push(objsun);
                channels2sun.push(obj2sun);
                channels3sun.push(obj3sun);
                setSundaytimend(channels3sun)
                setSundaytimestart(channels2sun)
                setShiftnamesun(ChannelArrsun);
              }

            }
            else if (Object.keys(shitdatas.shift.shifts)[i] === '1') {
              let ChannelArrmon = [];
              let channelmon = [];
              let channels2mon = [];
              let channels3mon = [];
              let objmon = {};
              let obj1mon = {};
              let obj2mon = {};
              let obj3mon = {};
              for (let j = 0; j < shitdatas.shift.shifts[i].length; j++) {
                objmon = { field: j + 1 }
                channelmon.push(objmon)
                setAddmon(channelmon)
                let DST1 = moment().format(`YYYY-MM-DDT` + shitdatas.shift.shifts[i][j].startDate) + 'Z'
                if (moment(DST1).isDST()) { // Checking for Day-light Saving
                  DST1 = moment(DST1).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                }
                let st = new Date(DST1);
                let st1 = st.toLocaleTimeString('en-GB');
                let st2 = st1.split(":")
                let DST2 = moment().format(`YYYY-MM-DDT` + shitdatas.shift.shifts[i][j].endDate) + 'Z'
                if (moment(DST2).isDST()) {
                  DST2 = moment(DST2).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                }
                let et = new Date(DST2);
                let et1 = et.toLocaleTimeString('en-GB')
                let et2 = et1.split(":")
                obj1mon[j + 1] = shitdatas.shift.shifts[i][j].name;
                let T1 = st2[0] + ":" + st2[1];
                // let st1= T1.split(":")
                let c1 = et2[0] + ":" + et2[1];
                obj2mon[j + 1] = T1;
                obj3mon[j + 1] = c1;
                ChannelArrmon.push(obj1mon);
                channels2mon.push(obj2mon);
                channels3mon.push(obj3mon);
                setMontimend(channels3mon)
                setMontimestart(channels2mon)
                setShiftnamemon(ChannelArrmon);
              }

            }
            else if (Object.keys(shitdatas.shift.shifts)[i] === '2') {
              let ChannelArrtue = [];
              let channeltue = [];
              let channels2tue = [];
              let channels3tue = [];
              let objtue = {};
              let obj1tue = {};
              let obj2tue = {};
              let obj3tue = {};
              for (let j = 0; j < shitdatas.shift.shifts[i].length; j++) {
                objtue = { field: j + 1 }
                channeltue.push(objtue)
                setAddtue(channeltue)
                let DST1 = moment().format(`YYYY-MM-DDT` + shitdatas.shift.shifts[i][j].startDate) + 'Z'
                if (moment(DST1).isDST()) { // Checking for Day-light Saving
                  DST1 = moment(DST1).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                }
                let st = new Date(DST1);
                let st1 = st.toLocaleTimeString('en-GB');
                let st2 = st1.split(":")
                let DST2 = moment().format(`YYYY-MM-DDT` + shitdatas.shift.shifts[i][j].endDate) + 'Z'
                if (moment(DST2).isDST()) {
                  DST2 = moment(DST2).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                }
                let et = new Date(DST2);
                let et1 = et.toLocaleTimeString('en-GB')
                let et2 = et1.split(":")
                obj1tue[j + 1] = shitdatas.shift.shifts[i][j].name;
                let T1 = st2[0] + ":" + st2[1];
                let c1 = et2[0] + ":" + et2[1];
                obj2tue[j + 1] = T1;
                obj3tue[j + 1] = c1;
                ChannelArrtue.push(obj1tue);
                channels2tue.push(obj2tue);
                channels3tue.push(obj3tue);
                setTuetimend(channels3tue)
                setTuetimestart(channels2tue)
                setShiftnametue(ChannelArrtue);
              }

            }
            else if (Object.keys(shitdatas.shift.shifts)[i] === '3') {
              let ChannelArrwed = [];
              let channelwed = [];
              let channels2wed = [];
              let channels3wed = [];
              let objwed = {};
              let obj1wed = {};
              let obj2wed = {};
              let obj3wed = {};
              for (let j = 0; j < shitdatas.shift.shifts[i].length; j++) {
                objwed = { field: j + 1 }
                channelwed.push(objwed)
                setAddwed(channelwed)
                let DST1 = moment().format(`YYYY-MM-DDT` + shitdatas.shift.shifts[i][j].startDate) + 'Z'
                if (moment(DST1).isDST()) { // Checking for Day-light Saving
                  DST1 = moment(DST1).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                }
                let st = new Date(DST1);
                let st1 = st.toLocaleTimeString('en-GB');
                let st2 = st1.split(":")
                let DST2 = moment().format(`YYYY-MM-DDT` + shitdatas.shift.shifts[i][j].endDate) + 'Z'
                if (moment(DST2).isDST()) {
                  DST2 = moment(DST2).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                }
                let et = new Date(DST2);
                let et1 = et.toLocaleTimeString('en-GB')
                let et2 = et1.split(":")
                obj1wed[j + 1] = shitdatas.shift.shifts[i][j].name;
                let T1 = st2[0] + ":" + st2[1];
                let c1 = et2[0] + ":" + et2[1];
                obj2wed[j + 1] = T1;
                obj3wed[j + 1] = c1;
                ChannelArrwed.push(obj1wed);
                channels2wed.push(obj2wed);
                channels3wed.push(obj3wed);
                setWedtimend(channels3wed)
                setWedtimestart(channels2wed)
                setShiftnamewed(ChannelArrwed);
              }

            }
            else if (Object.keys(shitdatas.shift.shifts)[i] === '4') {
              let ChannelArrthu = [];
              let channelthu = [];
              let channels2thu = [];
              let channels3thu = [];
              let objthu = {};
              let obj1thu = {};
              let obj2thu = {};
              let obj3thu = {};
              for (let j = 0; j < shitdatas.shift.shifts[i].length; j++) {
                objthu = { field: j + 1 }
                channelthu.push(objthu)
                setAddthu(channelthu)
                let DST1 = moment().format(`YYYY-MM-DDT` + shitdatas.shift.shifts[i][j].startDate) + 'Z'
                if (moment(DST1).isDST()) { // Checking for Day-light Saving
                  DST1 = moment(DST1).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                }
                let st = new Date(DST1);
                let st1 = st.toLocaleTimeString('en-GB');
                let st2 = st1.split(":")
                let DST2 = moment().format(`YYYY-MM-DDT` + shitdatas.shift.shifts[i][j].endDate) + 'Z'
                if (moment(DST2).isDST()) {
                  DST2 = moment(DST2).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                }
                let et = new Date(DST2);
                let et1 = et.toLocaleTimeString('en-GB')
                let et2 = et1.split(":")
                obj1thu[j + 1] = shitdatas.shift.shifts[i][j].name;
                let T1 = st2[0] + ":" + st2[1];
                let c1 = et2[0] + ":" + et2[1];
                obj2thu[j + 1] = T1;
                obj3thu[j + 1] = c1;
                ChannelArrthu.push(obj1thu);
                channels2thu.push(obj2thu);
                channels3thu.push(obj3thu);
                setThutimend(channels3thu)
                setThutimestart(channels2thu)
                setShiftnamethu(ChannelArrthu);
              }

            }
            else if (Object.keys(shitdatas.shift.shifts)[i] === '5') {
              let ChannelArrfri = [];
              let channelfri = [];
              let channels2fri = [];
              let channels3fri = [];
              let objfri = {};
              let obj1fri = {};
              let obj2fri = {};
              let obj3fri = {};
              for (let j = 0; j < shitdatas.shift.shifts[i].length; j++) {
                objfri = { field: j + 1 }
                channelfri.push(objfri)
                setAddfri(channelfri)
                let DST1 = moment().format(`YYYY-MM-DDT` + shitdatas.shift.shifts[i][j].startDate) + 'Z'
                if (moment(DST1).isDST()) { // Checking for Day-light Saving
                  DST1 = moment(DST1).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                }
                let st = new Date(DST1);
                let st1 = st.toLocaleTimeString('en-GB');
                let st2 = st1.split(":")
                let DST2 = moment().format(`YYYY-MM-DDT` + shitdatas.shift.shifts[i][j].endDate) + 'Z'
                if (moment(DST2).isDST()) {
                  DST2 = moment(DST2).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                }
                let et = new Date(DST2);
                let et1 = et.toLocaleTimeString('en-GB')
                let et2 = et1.split(":")
                obj1fri[j + 1] = shitdatas.shift.shifts[i][j].name;
                let T1 = st2[0] + ":" + st2[1];
                let c1 = et2[0] + ":" + et2[1];
                obj2fri[j + 1] = T1;
                obj3fri[j + 1] = c1;
                ChannelArrfri.push(obj1fri);
                channels2fri.push(obj2fri);
                channels3fri.push(obj3fri);
                setFritimend(channels3fri)
                setFritimestart(channels2fri)
                setShiftnamefri(ChannelArrfri);
              }

            }
            else if (Object.keys(shitdatas.shift.shifts)[i] === '6') {
              let ChannelArrsat = [];
              let channelsat = [];
              let channels2sat = [];
              let channels3sat = [];
              let objsat = {};
              let obj1sat = {};
              let obj2sat = {};
              let obj3sat = {};
              for (let j = 0; j < shitdatas.shift.shifts[i].length; j++) {
                objsat = { field: j + 1 }
                channelsat.push(objsat)
                setAddsat(channelsat)
                let DST1 = moment().format(`YYYY-MM-DDT` + shitdatas.shift.shifts[i][j].startDate) + 'Z'
                if (moment(DST1).isDST()) { // Checking for Day-light Saving
                  DST1 = moment(DST1).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                }
                let st = new Date(DST1);
                let st1 = st.toLocaleTimeString('en-GB');
                let st2 = st1.split(":")
                let DST2 = moment().format(`YYYY-MM-DDT` + shitdatas.shift.shifts[i][j].endDate) + 'Z'
                if (moment(DST2).isDST()) {
                  DST2 = moment(DST2).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                }
                let et = new Date(DST2);
                let et1 = et.toLocaleTimeString('en-GB')
                let et2 = et1.split(":")
                obj1sat[j + 1] = shitdatas.shift.shifts[i][j].name;
                let T1 = st2[0] + ":" + st2[1];
                let c1 = et2[0] + ":" + et2[1];
                obj2sat[j + 1] = T1;
                obj3sat[j + 1] = c1;
                ChannelArrsat.push(obj1sat);
                channels2sat.push(obj2sat);
                channels3sat.push(obj3sat);
                setSattimend(channels3sat)
                setSattimestart(channels2sat)
                setShiftnamesat(ChannelArrsat);
              }

            }
          }
        } else {
          setIsReading(true);
          for (let i = 0; i < Object.keys(shitdatas.shift.shifts).length; i++) {


            var ChannelArrday = [];
            let channelday = [];
            let channels2day = [];
            let channels3day = [];
            let objday = {};
            let obj1day = {};
            let obj2day = {};
            let obj3day = {};

            for (let j = 0; j < shitdatas.shift.shifts.length; j++) {

              try {

                objday = { field: j + 1 }
                channelday.push(objday)
                setAddFields(channelday)
                // console.log(shitdatas.shift.shifts,"shitdatas.shift.shifts") 
                let DST1 = moment().format(`YYYY-MM-DDT` + shitdatas.shift.shifts[j].startDate) + 'Z'
                if (moment(DST1).isDST()) { // Checking for Day-light Saving
                  DST1 = moment(DST1).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                }
                let st = new Date(DST1);

                let st1 = st.toLocaleTimeString('en-GB')
                let st2 = st1.split(":")
                let DST2 = moment().format(`YYYY-MM-DDT` + shitdatas.shift.shifts[j].endDate) + 'Z'
                if (moment(DST2).isDST()) {
                  DST2 = moment(DST2).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                }
                let et = new Date(DST2);
                let et1 = et.toLocaleTimeString('en-GB')
                let et2 = et1.split(":")
                obj1day[j + 1] = shitdatas.shift.shifts[j].name;
                let T1 = st2[0] + ":" + st2[1]
                let c1 = et2[0] + ":" + et2[1];
                obj2day[j + 1] = T1;
                obj3day[j + 1] = c1;
                if (ChannelArrday.length !== 0) {
                  setShiftnameday(ChannelArrday);
                  setSelectedtimeend(channels3day)
                  setSelectedtimestart(channels2day)
                }
                else {
                  ChannelArrday.push(obj1day);
                  channels2day.push(obj2day);
                  channels3day.push(obj3day);
                  setShiftnameday(ChannelArrday);
                  setSelectedtimeend(channels3day)
                  setSelectedtimestart(channels2day)
                }
                console.log(ChannelArrday)
              }
              catch (err) {
                console.log("error at shiftcalendar", err)
              }

            }
          }


        }

        let array = []
        let obj = {}
        if (isReading === true) {
          for (let j = 0; j < Object.keys(dayslistval[0]).length; j++) {
            for (let i = 0; i < shitdatas.shift.shifts.length; i++) {
              //let labels=Object.keys(dailydata.shifts)[j]
              try {
                let s1;
                let s2;
                let e1;
                let e2;
                let T1 = shitdatas.shift.shifts[i].startDate
                let st1 = T1.split(":")
                let c1 = shitdatas.shift.shifts[i].endDate
                let ct1 = c1.split(":")
                if (ct1[0].length === 1) {
                  e1 = "0" + ct1[0]
                } else {
                  e1 = ct1[0]
                }
                if (ct1[1].length === 1) {
                  e2 = "0" + ct1[1]
                } else {
                  e2 = ct1[1]
                }
                if (st1[0].length === 1) {
                  s1 = "0" + st1[0]
                } else {
                  s1 = st1[0]
                }
                if (st1[1].length === 1) {
                  s2 = "0" + st1[1]
                } else {
                  s2 = st1[1]
                }

                obj = {
                  "name": shitdatas.shift.shifts[i].name,
                  "data": [{
                    "x": dayslistval[0][j], "y": [new Date(moment().format(`YYYY-MM-DDT` + s1 + ":" + s2 + `Z`)).getTime(),
                    new Date(moment().format(`YYYY-MM-DDT` + e1 + ":" + e2 + `Z`)).getTime()]
                  }]
                }

                array.push(obj);
              } catch (err) {
                console.log("error at shitcalendar", err)
              }
              setSeries(array)
              //console.log(array)
            }

          }

        } else {
          for (let j = 0; j < Object.keys(dailydata.shifts).length; j++) {
            for (let i = 0; i < dailydata.shifts[j].length; i++) {
              let labels = Object.keys(dailydata.shifts)[j]
              let s1;
              let s2;
              let e1;
              let e2;
              let T1 = dailydata.shifts[j][i].startDate
              let st1 = T1.split(":")
              let c1 = dailydata.shifts[j][i].endDate
              let ct1 = c1.split(":")
              if (ct1[0].length === 1) {
                e1 = "0" + ct1[0]
              } else {
                e1 = ct1[0]
              }
              if (ct1[1].length === 1) {
                e2 = "0" + ct1[1]
              } else {
                e2 = ct1[1]
              }
              if (st1[0].length === 1) {
                s1 = "0" + st1[0]
              } else {
                s1 = st1[0]
              }
              if (st1[1].length === 1) {
                s2 = "0" + st1[1]
              } else {
                s2 = st1[1]
              }

              obj = {
                "name": dailydata.shifts[j][i].name,
                "data": [{
                  "x": labels === "0" ? "Sunday" : labels === "1" ? "Monday" : labels === "2" ? "Tuesday" : labels === "3" ? "Wednesday" : labels === "4" ? "Thurday" : labels === "5" ? "Friday" : labels === "6" ? "Saturday" : "0", "y": [new Date(moment().format(`YYYY-MM-DDT` + s1 + ":" + s2 + `Z`)).getTime(),
                  new Date(moment().format(`YYYY-MM-DDT` + e1 + ":" + e2 + `Z`)).getTime()]
                }]
              }
              array.push(obj);
            }
            setSeries(array)

          }
        }
      }

    }
  }
  const options = {

    chart: {
      height: 350,
      type: 'rangeBar'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '50%',
        rangeBarGroupRows: true
      }
    },
    colors: [
      "#008FFB", "#00E396", "#FEB019"

    ],
    fill: {
      type: 'solid'
    },
    xaxis: {
      type: 'datetime'
    },

    tooltip: {
      custom: function (opts) {
        //const fromYear = new Date(opts.y1).getFullYear()
        //const toYear = new Date(opts.y2).getFullYear()
        const values = opts.ctx.rangeBar.getTooltipValues(opts)

        return (

          "Shift start time: " + new Date(values.start) + "  Shift end time: " + new Date(values.end)

        )
      }
    }
  }
  const handleSnackOpen = () => {
    setOpenSnack(true);
  };

  const handleshiftChange = (e, field) => {
    var ChannelArr = [...shiftnameday];
    if (ChannelArr.length === 0) {
      let obj = {};
      //obj[`field${field}`] = e.target.value;
      obj[field] = e.target.value;
      ChannelArr.push(obj);
      setShiftnameday(ChannelArr);
    } else {
      ChannelArr[0][field] = e.target.value;
      //ChannelArr[0][`field${field}`] = e.target.value;
      setShiftnameday(ChannelArr);
    }
  }

  const handletimefromChange = (e, field) => {
    // console.log("e",e,"field",field)
    let timestart = [...selectedtimestart];
    let timeto = [...selectedtimeend];
    let val = new Date(e).toISOString().split('T');
    let fromval = moment(val[0] + ' ' + val[1]).format('HH:mm');
    let isval = new Date().toISOString().split('T').shift();
    if (field > 1) {
      if (e.getTime() < new Date(isval + ' ' + timeto[0][field - 1]).getTime()) {
        setSnackMessage(t("Should be greater than previos End period"));
        setSnackType("warning");
        handleSnackOpen();
        return false
      }
    }

    if (timestart.length === 0) {
      let obj = {};
      obj[field] = fromval;
      //obj[`field${field}`] = fromval;
      timestart.push(obj);
      setSelectedtimestart(timestart);
    } else {

      //timestart[0][`field${field}`] = fromval;
      timestart[0][field] = fromval;
      setSelectedtimestart(timestart);
      if (field === 1) {
        timeto[0][addFields[addFields.length - 1].field] = fromval;
        setSelectedtimeend(timeto);
      }
    }

  };

  const handletimetoChange = (e, field) => {
    let timeto = [...selectedtimeend];
    let timestart = [...selectedtimestart];
    let val = new Date(e).toISOString().split('T');
    let toval = moment(val[0] + ' ' + val[1]).format('HH:mm');
    let isval = new Date().toISOString().split('T').shift();

    if (field > 1) {
      let Ftime = new Date(isval + ' ' + timestart[0][1]).getTime()
      let Ctime = new Date(isval + ' ' + timeto[0][field - 1]).getTime()
      // console.log(e.getTime(),new Date(isval+' '+timestart[0][1]).getTime(),"new Date(isval+' '+timestart[0][1]).getTime()",Ctime,Ftime,timeto,timeto[0][field-1])
      if (new Date(isval + ' ' + toval).getTime() > Ftime) {
        // console.log("greater")
        if (e.getTime() < Ctime) {
          setSnackMessage(t("Should be greater than start period"));
          setSnackType("warning");
          handleSnackOpen();
          return false
        }
        if (Ftime > Ctime) {
          setSnackMessage(t("Should be lesser than or equal to start period"));
          setSnackType("warning");
          handleSnackOpen();
          return false
        }
      } else {
        // console.log("lesser")
        if (Ftime < Ctime) {
          if (new Date(isval + ' ' + toval).getTime() > Ftime) {
            setSnackMessage(t("Should be lesser than or equal to start period"));
            setSnackType("warning");
            handleSnackOpen();
            return false
          }
        } else {
          if (e.getTime() < Ctime) {
            setSnackMessage(t("Should be greater than start period"));
            setSnackType("warning");
            handleSnackOpen();
            return false
          }
          if (new Date(isval + ' ' + toval).getTime() > Ftime) {
            setSnackMessage(t("Should be lesser than or equal to start period"));
            setSnackType("warning");
            handleSnackOpen();
            return false
          }
        }
      }
    }
    if (timeto.length === 0) {
      let obj = {};
      obj[field] = e;
      //obj[`field${field}`] = e;
      timeto.push(obj);
      //timestart[0][`field${field+1}`] = e;
      timestart[0][field + 1] = toval;
      setSelectedtimestart(timestart)
      setSelectedtimeend(timeto);
    } else {
      //timestart[0][`field${field+1}`] = e;
      // timeto[0][`field${field}`] = e;
      timestart[0][field + 1] = toval;
      timeto[0][field] = toval;
      setSelectedtimestart(timestart)
      setSelectedtimeend(timeto);
    }

  };
  const handlesunday = (e, field) => {
    var ChannelArr = [...shiftnamesun];
    if (ChannelArr.length === 0) {
      let obj = {};
      obj[field] = e.target.value;
      //obj[`field${field}`] = e.target.value;
      ChannelArr.push(obj);
      setShiftnamesun(ChannelArr);
    } else {
      //ChannelArr[0][`field${field}`] = e.target.value;
      ChannelArr[0][field] = e.target.value;
      setShiftnamesun(ChannelArr);
    }
  }
  const handleshiftChangetue = (e, field) => {
    var ChannelArr = [...shiftnametue];
    if (ChannelArr.length === 0) {
      let obj = {};
      obj[field] = e.target.value;
      //obj[`field${field}`] = e.target.value;
      ChannelArr.push(obj);
      setShiftnametue(ChannelArr);
    } else {
      //ChannelArr[0][`field${field}`] = e.target.value;
      ChannelArr[0][field] = e.target.value;
      setShiftnametue(ChannelArr);
    }
  }
  const handleshiftChangewed = (e, field) => {
    var ChannelArr = [...shiftnamewed];
    if (ChannelArr.length === 0) {
      let obj = {};
      obj[field] = e.target.value;
      //obj[`field${field}`] = e.target.value;
      ChannelArr.push(obj);
      setShiftnamewed(ChannelArr);
    } else {
      //ChannelArr[0][`field${field}`] = e.target.value;
      ChannelArr[0][field] = e.target.value;
      setShiftnamewed(ChannelArr);
    }
  }
  const handleshiftChangethu = (e, field) => {
    var ChannelArr = [...shiftnamethu];
    if (ChannelArr.length === 0) {
      let obj = {};
      obj[field] = e.target.value;
      //obj[`field${field}`] = e.target.value;
      ChannelArr.push(obj);
      setShiftnamethu(ChannelArr);
    } else {
      //ChannelArr[0][`field${field}`] = e.target.value;
      ChannelArr[0][field] = e.target.value;
      setShiftnamethu(ChannelArr);
    }
  }
  const handleshiftChangefri = (e, field) => {
    var ChannelArr = [...shiftnamefri];
    if (ChannelArr.length === 0) {
      let obj = {};
      obj[field] = e.target.value;
      //obj[`field${field}`] = e.target.value;
      ChannelArr.push(obj);
      setShiftnamefri(ChannelArr);
    } else {
      //ChannelArr[0][`field${field}`] = e.target.value;
      ChannelArr[0][field] = e.target.value;
      setShiftnamefri(ChannelArr);
    }
  }
  const handleshiftChangesat = (e, field) => {
    var ChannelArr = [...shiftnamesat];
    if (ChannelArr.length === 0) {
      let obj = {};
      obj[field] = e.target.value;
      //obj[`field${field}`] = e.target.value;
      ChannelArr.push(obj);
      setShiftnamesat(ChannelArr);
    } else {
      //ChannelArr[0][`field${field}`] = e.target.value;
      ChannelArr[0][field] = e.target.value;
      setShiftnamesat(ChannelArr);
    }
  }

  const handlesundaytimefromChange = (e, field) => {
    // console.log(e instanceof Date,"iso")
    if (Object.prototype.toString.call(e) === "[object Date]") {
      if (!isNaN(e.getTime())) {
        let timestart = [...sundaytimestart];
        let timeto = [...sundaytimend];
        let val = new Date(e).toISOString().split('T');
        let fromval = moment(val[0] + ' ' + val[1]).format('HH:mm');
        let isval = new Date().toISOString().split('T').shift();
        // console.log(timestart,isval,"handlesundaytimefromCh",sundaytimend,sundaytimend[0][field],field-1,new Date(isval+' '+sundaytimend[0][field]).getTime(),"e.getTime()",e.getTime())
        if (field > 1) {
          if (e.getTime() < new Date(isval + ' ' + timeto[0][field - 1]).getTime()) {
            setSnackMessage(t("Should be greater than previos End period"));
            setSnackType("warning");
            handleSnackOpen();
            return false
          }
        }
        if (timestart.length === 0) {
          let obj = {};
          obj[field] = fromval;
          obj[`field${field}`] = fromval
          timestart.push(obj);
          setSundaytimestart(timestart);
        } else {
          timestart[0][field] = fromval
          setSundaytimestart(timestart);
          timeto[0][field] = fromval;
          setSundaytimend(timeto);
        }
      }
    }
  };
  const handlesundaytimetoChange = (e, field) => {
    if (Object.prototype.toString.call(e) === "[object Date]") {
      if (!isNaN(e.getTime())) {
        let timeto = [...sundaytimend];
        let timestart = [...sundaytimestart];
        let val = new Date(e).toISOString().split('T');
        let toval = moment(val[0] + ' ' + val[1]).format('HH:mm');
        let isval = new Date().toISOString().split('T').shift();

        if (field > 1) {
          let Ftime = new Date(isval + ' ' + timestart[0][1]).getTime()
          let Ctime = new Date(isval + ' ' + timeto[0][field - 1]).getTime()
          // console.log(e.getTime(),new Date(isval+' '+timestart[0][1]).getTime(),"new Date(isval+' '+timestart[0][1]).getTime()")
          if (new Date(isval + ' ' + toval).getTime() > Ftime) {
            // console.log("greater")
            if (e.getTime() < Ctime) {
              setSnackMessage(t("Should be greater than start period"));
              setSnackType("warning");
              handleSnackOpen();
              return false
            }
            if (Ftime > Ctime) {
              setSnackMessage(t("Should be lesser than or equal to start period"));
              setSnackType("warning");
              handleSnackOpen();
              return false
            }
          } else {
            // console.log("lesser")
            if (Ftime < Ctime) {
              if (new Date(isval + ' ' + toval).getTime() > Ftime) {
                setSnackMessage(t("Should be lesser than or equal to start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
            } else {
              if (e.getTime() < Ctime) {
                setSnackMessage(t("Should be greater than start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
              if (new Date(isval + ' ' + toval).getTime() > Ftime) {
                setSnackMessage(t("Should be lesser than or equal to start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
            }
          }
        }
        // console.log(timestart,"handlesundaytimetoChange",timeto,Object.keys(timeto[0]).length,field)
        if (timeto.length === 0) {
          let obj = {};
          obj[field] = toval;
          timeto.push(obj);
          timestart[0][field + 1] = toval;
          setSundaytimestart(timestart)
          setSundaytimend(timeto);
        } else {
          timestart[0][field + 1] = toval;
          timeto[0][field] = toval;
          setSundaytimestart(timestart)
          setSundaytimend(timeto);
        }
      }
    }
  };
  const removeChannelSun = (val) => {
    let setelement = [...addsun];
    //let removedshiftname = shiftnamesun.filter(x => x !== val);
    let removed = setelement.filter(x => x.field !== val);

    setAddsun(removed);
  }
  const addnewlineitemsun = () => {
    let setelement = [...addsun];
    const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1; console.log(sundaytimestart)
    if (sundaytimestart[0][1] !== sundaytimend[0][lastfield - 1]) {
      setelement.push({ field: lastfield });
      setAddsun(setelement);
      let timestart = [...sundaytimestart];
      let timeto = [...sundaytimend];
      timeto[0][lastfield] = timestart[0][1];
      setSundaytimend(timeto);
    } else {
      setSnackMessage(t("24 hours Reached"));
      setSnackType("warning");
      handleSnackOpen();
    }
  }

  const handleshiftChangemon = (e, field) => {
    var ChannelArr = [...shiftnamemon];
    if (ChannelArr.length === 0) {
      let obj = {};
      obj[field] = e.target.value;
      //obj[`field${field}`] = e.target.value;
      ChannelArr.push(obj);
      setShiftnamemon(ChannelArr);
    } else {
      //ChannelArr[0][`field${field}`] = e.target.value;
      ChannelArr[0][field] = e.target.value;
      setShiftnamemon(ChannelArr);
    }
  }
  const handletimefromChangeMon = (e, field) => {
    if (Object.prototype.toString.call(e) === "[object Date]") {
      if (!isNaN(e.getTime())) {
        let timestart = [...montimestart];
        let timeto = [...montimend];
        let val = new Date(e).toISOString().split('T');
        let fromval = moment(val[0] + ' ' + val[1]).format('HH:mm');
        let isval = new Date().toISOString().split('T').shift();
        // console.log(timestart,isval,"handlesundaytimefromCh",sundaytimend,sundaytimend[0][field],field-1,new Date(isval+' '+sundaytimend[0][field]).getTime(),"e.getTime()",e.getTime())
        if (field > 1) {
          if (e.getTime() < new Date(isval + ' ' + timeto[0][field - 1]).getTime()) {
            setSnackMessage(t("Should be greater than previos End period"));
            setSnackType("warning");
            handleSnackOpen();
            return false
          }
        }
        if (timestart.length === 0) {
          let obj = {};
          obj[field] = fromval;
          obj[`field${field}`] = fromval;
          timestart.push(obj);
          setMontimestart(timestart);
        } else {
          timestart[0][`field${field}`] = fromval;
          timestart[0][field] = fromval;
          setMontimestart(timestart);
          timeto[0][field] = fromval;
          setMontimend(timeto);
        }
      }
    }


  };
  const handletimetoChangeMon = (e, field) => {
    if (Object.prototype.toString.call(e) === "[object Date]") {
      if (!isNaN(e.getTime())) {
        let timeto = [...montimend];
        let timestart = [...montimestart];
        let val = new Date(e).toISOString().split('T');
        let toval = moment(val[0] + ' ' + val[1]).format('HH:mm');
        let isval = new Date().toISOString().split('T').shift();

        if (field > 1) {
          let Ftime = new Date(isval + ' ' + timestart[0][1]).getTime()
          let Ctime = new Date(isval + ' ' + timeto[0][field - 1]).getTime()
          // console.log(e.getTime(),new Date(isval+' '+timestart[0][1]).getTime(),"new Date(isval+' '+timestart[0][1]).getTime()")
          if (new Date(isval + ' ' + toval).getTime() > Ftime) {
            // console.log("greater")
            if (e.getTime() < Ctime) {
              setSnackMessage(t("Should be greater than start period"));
              setSnackType("warning");
              handleSnackOpen();
              return false
            }
            if (Ftime > Ctime) {
              setSnackMessage(t("Should be lesser than or equal to start period"));
              setSnackType("warning");
              handleSnackOpen();
              return false
            }
          } else {
            // console.log("lesser")
            if (Ftime < Ctime) {
              if (new Date(isval + ' ' + toval).getTime() > Ftime) {
                setSnackMessage(t("Should be lesser than or equal to start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
            } else {
              if (e.getTime() < Ctime) {
                setSnackMessage(t("Should be greater than start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
              if (new Date(isval + ' ' + toval).getTime() > Ftime) {
                setSnackMessage(t("Should be lesser than or equal to start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
            }
          }
        }
        if (timeto.length === 0) {
          let obj = {};
          obj[field] = toval;
          // obj[`field${field}`] = toval;
          timeto.push(obj);
          timestart[0][field + 1] = toval;
          setMontimestart(timestart)
          setMontimend(timeto);
        } else {
          timestart[0][`field${field + 1}`] = toval;
          timeto[0][`field${field}`] = toval;
          timestart[0][field + 1] = toval;
          timeto[0][field] = toval;
          setMontimestart(timestart)
          setMontimend(timeto);
        }
      }
    }
  };
  const handletimefromChangeTue = (e, field) => {
    if (Object.prototype.toString.call(e) === "[object Date]") {
      if (!isNaN(e.getTime())) {
        let timestart = [...tuetimestart];
        let timeto = [...tuetimend];
        let val = new Date(e).toISOString().split('T');
        let fromval = moment(val[0] + ' ' + val[1]).format('HH:mm');
        let isval = new Date().toISOString().split('T').shift();
        // console.log(timestart,isval,"handlesundaytimefromCh",sundaytimend,sundaytimend[0][field],field-1,new Date(isval+' '+sundaytimend[0][field]).getTime(),"e.getTime()",e.getTime())
        if (field > 1) {
          if (e.getTime() < new Date(isval + ' ' + timeto[0][field - 1]).getTime()) {
            setSnackMessage(t("Should be greater than previos End period"));
            setSnackType("warning");
            handleSnackOpen();
            return false
          }
        }
        if (timestart.length === 0) {
          let obj = {};
          obj[field] = fromval;
          obj[`field${field}`] = fromval;
          timestart.push(obj);
          setTuetimestart(timestart);
        } else {
          timestart[0][`field${field}`] = fromval;
          timestart[0][field] = fromval;
          setTuetimestart(timestart);
          timeto[0][field] = fromval;
          setTuetimend(timeto);
        }
      }
    }
  };
  const handletimetoChangeTue = (e, field) => {
    if (Object.prototype.toString.call(e) === "[object Date]") {
      if (!isNaN(e.getTime())) {
        let timeto = [...tuetimend];
        let timestart = [...tuetimestart];
        let val = new Date(e).toISOString().split('T');
        let toval = moment(val[0] + ' ' + val[1]).format('HH:mm');
        let isval = new Date().toISOString().split('T').shift();

        if (field > 1) {
          let Ftime = new Date(isval + ' ' + timestart[0][1]).getTime()
          let Ctime = new Date(isval + ' ' + timeto[0][field - 1]).getTime()
          // console.log(e.getTime(),new Date(isval+' '+timestart[0][1]).getTime(),"new Date(isval+' '+timestart[0][1]).getTime()")
          if (new Date(isval + ' ' + toval).getTime() > Ftime) {
            // console.log("greater")
            if (e.getTime() < Ctime) {
              setSnackMessage(t("Should be greater than start period"));
              setSnackType("warning");
              handleSnackOpen();
              return false
            }
            if (Ftime > Ctime) {
              setSnackMessage(t("Should be lesser than or equal to start period"));
              setSnackType("warning");
              handleSnackOpen();
              return false
            }
          } else {
            // console.log("lesser")
            if (Ftime < Ctime) {
              if (new Date(isval + ' ' + toval).getTime() > Ftime) {
                setSnackMessage(t("Should be lesser than or equal to start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
            } else {
              if (e.getTime() < Ctime) {
                setSnackMessage(t("Should be greater than start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
              if (new Date(isval + ' ' + toval).getTime() > Ftime) {
                setSnackMessage(t("Should be lesser than or equal to start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
            }
          }
        }
        if (timeto.length === 0) {
          let obj = {};
          obj[field] = e;
          //obj[`field${field}`] = toval;
          timeto.push(obj);
          timestart[0][field + 1] = toval;
          setTuetimestart(timestart)
          setTuetimend(timeto);
        } else {
          timestart[0][`field${field + 1}`] = toval;
          timeto[0][`field${field}`] = toval;
          timestart[0][field + 1] = toval;
          timeto[0][field] = toval;
          setTuetimestart(timestart)
          setTuetimend(timeto);
        }
      }
    }
  };
  const handletimefromChangewed = (e, field) => {

    if (Object.prototype.toString.call(e) === "[object Date]") {
      if (!isNaN(e.getTime())) {
        let timestart = [...wedtimestart];
        let timeto = [...wedtimend];
        let val = new Date(e).toISOString().split('T');
        let fromval = moment(val[0] + ' ' + val[1]).format('HH:mm');
        let isval = new Date().toISOString().split('T').shift();
        // console.log(timestart,isval,"handlesundaytimefromCh",sundaytimend,sundaytimend[0][field],field-1,new Date(isval+' '+sundaytimend[0][field]).getTime(),"e.getTime()",e.getTime())
        if (field > 1) {
          if (e.getTime() < new Date(isval + ' ' + timeto[0][field - 1]).getTime()) {
            setSnackMessage(t("Should be greater than previos End period"));
            setSnackType("warning");
            handleSnackOpen();
            return false
          }
        }
        if (timestart.length === 0) {
          let obj = {};
          obj[field] = fromval;
          obj[`field${field}`] = fromval;
          timestart.push(obj);
          setWedtimestart(timestart);
        } else {
          timestart[0][`field${field}`] = fromval;
          timestart[0][field] = fromval;
          setWedtimestart(timestart);
          timeto[0][field] = fromval;
          setWedtimend(timeto);
        }
      }
    }

  };
  const handletimetoChangewed = (e, field) => {
    if (Object.prototype.toString.call(e) === "[object Date]") {
      if (!isNaN(e.getTime())) {
        let timeto = [...wedtimend];
        let timestart = [...wedtimestart];
        let val = new Date(e).toISOString().split('T');
        let toval = moment(val[0] + ' ' + val[1]).format('HH:mm');
        let isval = new Date().toISOString().split('T').shift();

        if (field > 1) {
          let Ftime = new Date(isval + ' ' + timestart[0][1]).getTime()
          let Ctime = new Date(isval + ' ' + timeto[0][field - 1]).getTime()
          // console.log(e.getTime(),new Date(isval+' '+timestart[0][1]).getTime(),"new Date(isval+' '+timestart[0][1]).getTime()")
          if (new Date(isval + ' ' + toval).getTime() > Ftime) {
            // console.log("greater")
            if (e.getTime() < Ctime) {
              setSnackMessage(t("Should be greater than start period"));
              setSnackType("warning");
              handleSnackOpen();
              return false
            }
            if (Ftime > Ctime) {
              setSnackMessage(t("Should be lesser than or equal to start period"));
              setSnackType("warning");
              handleSnackOpen();
              return false
            }
          } else {
            // console.log("lesser")
            if (Ftime < Ctime) {
              if (new Date(isval + ' ' + toval).getTime() > Ftime) {
                setSnackMessage(t("Should be lesser than or equal to start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
            } else {
              if (e.getTime() < Ctime) {
                setSnackMessage(t("Should be greater than start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
              if (new Date(isval + ' ' + toval).getTime() > Ftime) {
                setSnackMessage(t("Should be lesser than or equal to start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
            }
          }
        }
        if (timeto.length === 0) {
          let obj = {};
          obj[field] = toval;
          //obj[`field${field}`] = toval;
          timeto.push(obj);
          timestart[0][field + 1] = toval;
          setWedtimestart(timestart)
          setWedtimend(timeto);
        } else {
          timestart[0][`field${field + 1}`] = toval;
          timeto[0][`field${field}`] = toval;
          timestart[0][field + 1] = toval;
          timeto[0][field] = toval;
          setWedtimestart(timestart)
          setWedtimend(timeto);
        }
      }
    }

  };
  const handletimefromChangethu = (e, field) => {
    if (Object.prototype.toString.call(e) === "[object Date]") {
      if (!isNaN(e.getTime())) {
        let timestart = [...thutimestart];
        let timeto = [...thutimend];
        let val = new Date(e).toISOString().split('T');
        let fromval = moment(val[0] + ' ' + val[1]).format('HH:mm');
        let isval = new Date().toISOString().split('T').shift();
        // console.log(timestart,isval,"handlesundaytimefromCh",sundaytimend,sundaytimend[0][field],field-1,new Date(isval+' '+sundaytimend[0][field]).getTime(),"e.getTime()",e.getTime())
        if (field > 1) {
          if (e.getTime() < new Date(isval + ' ' + timeto[0][field - 1]).getTime()) {
            setSnackMessage(t("Should be greater than previos End period"));
            setSnackType("warning");
            handleSnackOpen();
            return false
          }
        }
        if (timestart.length === 0) {
          let obj = {};
          obj[field] = fromval;
          obj[`field${field}`] = fromval;
          timestart.push(obj);
          setThutimestart(timestart);
        } else {
          timestart[0][`field${field}`] = fromval;
          timestart[0][field] = fromval;
          setThutimestart(timestart);
          timeto[0][field] = fromval;
          setThutimend(timeto);
        }
      }
    }

  };
  const handletimetoChangethu = (e, field) => {
    if (Object.prototype.toString.call(e) === "[object Date]") {
      if (!isNaN(e.getTime())) {
        let timeto = [...thutimend];
        let timestart = [...thutimestart];
        let val = new Date(e).toISOString().split('T');
        let toval = moment(val[0] + ' ' + val[1]).format('HH:mm');
        let isval = new Date().toISOString().split('T').shift();

        if (field > 1) {
          let Ftime = new Date(isval + ' ' + timestart[0][1]).getTime()
          let Ctime = new Date(isval + ' ' + timeto[0][field - 1]).getTime()
          // console.log(e.getTime(),new Date(isval+' '+timestart[0][1]).getTime(),"new Date(isval+' '+timestart[0][1]).getTime()")
          if (new Date(isval + ' ' + toval).getTime() > Ftime) {
            // console.log("greater")
            if (e.getTime() < Ctime) {
              setSnackMessage(t("Should be greater than start period"));
              setSnackType("warning");
              handleSnackOpen();
              return false
            }
            if (Ftime > Ctime) {
              setSnackMessage(t("Should be lesser than or equal to start period"));
              setSnackType("warning");
              handleSnackOpen();
              return false
            }
          } else {
            // console.log("lesser")
            if (Ftime < Ctime) {
              if (new Date(isval + ' ' + toval).getTime() > Ftime) {
                setSnackMessage(t("Should be lesser than or equal to start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
            } else {
              if (e.getTime() < Ctime) {
                setSnackMessage(t("Should be greater than start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
              if (new Date(isval + ' ' + toval).getTime() > Ftime) {
                setSnackMessage(t("Should be lesser than or equal to start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
            }
          }
        }
        if (timeto.length === 0) {
          let obj = {};
          obj[field] = toval;
          timeto.push(obj);
          timestart[0][field + 1] = toval;
          setThutimestart(timestart)
          setThutimend(timeto);
        } else {
          timestart[0][`field${field + 1}`] = toval;
          timeto[0][`field${field}`] = toval;
          timestart[0][field + 1] = toval;
          timeto[0][field] = toval;
          setThutimestart(timestart)
          setThutimend(timeto);
        }
      }
    }

  };
  const handletimefromChangefri = (e, field) => {
    if (Object.prototype.toString.call(e) === "[object Date]") {
      if (!isNaN(e.getTime())) {
        let timestart = [...fritimestart];
        let timeto = [...fritimend];
        let val = new Date(e).toISOString().split('T');
        let fromval = moment(val[0] + ' ' + val[1]).format('HH:mm');
        let isval = new Date().toISOString().split('T').shift();
        if (field > 1) {
          if (e.getTime() < new Date(isval + ' ' + timeto[0][field - 1]).getTime()) {
            setSnackMessage(t("Should be greater than previos End period"));
            setSnackType("warning");
            handleSnackOpen();
            return false
          }
        }
        if (timestart.length === 0) {
          let obj = {};
          obj[field] = fromval;
          obj[`field${field}`] = fromval;
          timestart.push(obj);
          setFritimestart(timestart);
        } else {
          timestart[0][`field${field}`] = fromval;
          timestart[0][field] = fromval;
          setFritimestart(timestart);
          timeto[0][field] = fromval;
          setFritimend(timeto);
        }
      }
    }

  };
  const handletimetoChangefri = (e, field) => {
    if (Object.prototype.toString.call(e) === "[object Date]") {
      if (!isNaN(e.getTime())) {
        var timeto = [...fritimend];
        var timestart = [...fritimestart];
        let val = new Date(e).toISOString().split('T');
        let toval = moment(val[0] + ' ' + val[1]).format('HH:mm');
        let isval = new Date().toISOString().split('T').shift();

        if (field > 1) {
          let Ftime = new Date(isval + ' ' + timestart[0][1]).getTime()
          let Ctime = new Date(isval + ' ' + timeto[0][field - 1]).getTime()
          // console.log(e.getTime(),new Date(isval+' '+timestart[0][1]).getTime(),"new Date(isval+' '+timestart[0][1]).getTime()")
          if (new Date(isval + ' ' + toval).getTime() > Ftime) {
            // console.log("greater")
            if (e.getTime() < Ctime) {
              setSnackMessage(t("Should be greater than start period"));
              setSnackType("warning");
              handleSnackOpen();
              return false
            }
            if (Ftime > Ctime) {
              setSnackMessage(t("Should be lesser than or equal to start period"));
              setSnackType("warning");
              handleSnackOpen();
              return false
            }
          } else {
            // console.log("lesser")
            if (Ftime < Ctime) {
              if (new Date(isval + ' ' + toval).getTime() > Ftime) {
                setSnackMessage(t("Should be lesser than or equal to start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
            } else {
              if (e.getTime() < Ctime) {
                setSnackMessage(t("Should be greater than start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
              if (new Date(isval + ' ' + toval).getTime() > Ftime) {
                setSnackMessage(t("Should be lesser than or equal to start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
            }
          }
        }
        if (timeto.length === 0) {
          let obj = {};
          obj[field] = toval;
          timeto.push(obj);
          timestart[0][field + 1] = toval;
          setFritimestart(timestart)
          setFritimend(timeto);
        } else {
          timestart[0][`field${field + 1}`] = toval;
          timeto[0][`field${field}`] = toval;
          timestart[0][field + 1] = toval;
          timeto[0][field] = toval;
          setFritimestart(timestart)
          setFritimend(timeto);
        }
      }
    }

  };
  const handletimefromChangesat = (e, field) => {
    if (Object.prototype.toString.call(e) === "[object Date]") {
      if (!isNaN(e.getTime())) {
        let timestart = [...sattimestart];
        let timeto = [...sattimend];
        let val = new Date(e).toISOString().split('T');
        let fromval = moment(val[0] + ' ' + val[1]).format('HH:mm');
        let isval = new Date().toISOString().split('T').shift();
        if (field > 1) {
          if (e.getTime() < new Date(isval + ' ' + timeto[0][field - 1]).getTime()) {
            setSnackMessage(t("Should be greater than previos End period"));
            setSnackType("warning");
            handleSnackOpen();
            return false
          }
        }
        if (timestart.length === 0) {
          let obj = {};
          obj[field] = fromval;
          obj[`field${field}`] = fromval;
          timestart.push(obj);
          setSattimestart(timestart);
        } else {
          timestart[0][`field${field}`] = fromval;
          timestart[0][field] = fromval;
          setSattimestart(timestart);
          timeto[0][`field${field}`] = fromval;
          setSattimend(timeto);
        }
      }
    }

  };
  const handletimetoChangesat = (e, field) => {
    if (Object.prototype.toString.call(e) === "[object Date]") {
      if (!isNaN(e.getTime())) {
        let timeto = [...sattimend];
        let timestart = [...sattimestart];
        let val = new Date(e).toISOString().split('T');
        let toval = moment(val[0] + ' ' + val[1]).format('HH:mm');
        let isval = new Date().toISOString().split('T').shift();

        if (field > 1) {
          let Ftime = new Date(isval + ' ' + timestart[0][1]).getTime()
          let Ctime = new Date(isval + ' ' + timeto[0][field - 1]).getTime()
          if (new Date(isval + ' ' + toval).getTime() > Ftime) {
            // console.log("greater")
            if (e.getTime() < Ctime) {
              setSnackMessage(t("Should be greater than start period"));
              setSnackType("warning");
              handleSnackOpen();
              return false
            }
            if (Ftime > Ctime) {
              setSnackMessage(t("Should be lesser than or equal to start period"));
              setSnackType("warning");
              handleSnackOpen();
              return false
            }
          } else {
            // console.log("lesser")
            if (Ftime < Ctime) {
              if (new Date(isval + ' ' + toval).getTime() > Ftime) {
                setSnackMessage(t("Should be lesser than or equal to start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
            } else {
              if (e.getTime() < Ctime) {
                setSnackMessage(t("Should be greater than start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
              if (new Date(isval + ' ' + toval).getTime() > Ftime) {
                setSnackMessage(t("Should be lesser than or equal to start period"));
                setSnackType("warning");
                handleSnackOpen();
                return false
              }
            }
          }
        }
        if (timeto.length === 0) {
          let obj = {};
          obj[field] = toval;
          timeto.push(obj);
          timestart[0][field + 1] = toval;
          setSattimestart(timestart)
          setSattimend(timeto);
        } else {
          timestart[0][`field${field + 1}`] = toval;
          timestart[0][field + 1] = toval;
          timeto[0][field] = toval;
          timeto[0][`field${field}`] = toval;
          setSattimestart(timestart)
          setSattimend(timeto);
        }
      }
    }
  };
  const addnewlineitem = () => {
    // console.log(moment(new Date(moment().format(`YYYY-MM-DDT` + selectedtimestart[0][addFields[0].field]))).diff(new Date(moment().format(`YYYY-MM-DDT` + selectedtimeend[0][addFields[addFields.length-1].field])), 'days'),"addFieldsaddFields")

    let setelement = [...addFields];
    const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
    if (selectedtimestart[0][1] !== selectedtimeend[0][lastfield - 1]) {
      setelement.push({ field: lastfield });
      setAddFields(setelement);
    } else {
      setSnackMessage(t("24 hours Reached"));
      setSnackType("warning");
      handleSnackOpen();
    }
  }
  const removeChannel = (val) => {
    let setelement = [...addFields];
    let removed = setelement.filter(x => x.field !== val);
    setAddFields(removed);
  }
  const removeChannelMon = (val) => {
    let setelement = [...addmon];
    let removed = setelement.filter(x => x.field !== val);
    setAddmon(removed);
  }
  const addnewlineitemMon = () => {
    let setelement = [...addmon];
    const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
    if (montimestart[0][1] !== montimend[0][lastfield - 1]) {
      setelement.push({ field: lastfield });
      setAddmon(setelement);
      let timestart = [...montimestart];
      let timeto = [...montimend];
      timeto[0][lastfield] = timestart[0][1];
      setMontimend(timeto);
    } else {
      setSnackMessage(t("24 hours Reached"));
      setSnackType("warning");
      handleSnackOpen();
    }

  }

  const addnewlineitemTue = () => {
    let setelement = [...addtue];
    const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
    if (tuetimestart[0][1] !== tuetimend[0][lastfield - 1]) {
      setelement.push({ field: lastfield });
      setAddtue(setelement);
      let timestart = [...tuetimestart];
      let timeto = [...tuetimend];
      timeto[0][lastfield] = timestart[0][1];
      setTuetimend(timeto);
    } else {
      setSnackMessage(t("24 hours Reached"));
      setSnackType("warning");
      handleSnackOpen();
    }
  }
  const removeChannelTue = (val) => {
    let setelement = [...addtue];
    let removed = setelement.filter(x => x.field !== val);
    setAddtue(removed);
  }
  const addnewlineitemWed = () => {
    let setelement = [...addwed];
    const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
    if (wedtimestart[0][1] !== wedtimend[0][lastfield - 1]) {
      setelement.push({ field: lastfield });
      setAddwed(setelement);
      let timestart = [...wedtimestart];
      let timeto = [...wedtimend];
      timeto[0][lastfield] = timestart[0][1];
      setWedtimend(timeto);
    } else {
      setSnackMessage(t("24 hours Reached"));
      setSnackType("warning");
      handleSnackOpen();
    }
  }
  const removeChannelWed = (val) => {
    let setelement = [...addwed];
    let removed = setelement.filter(x => x.field !== val);
    setAddwed(removed);

  }
  const addnewlineitemThu = () => {
    let setelement = [...addthu];
    const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
    if (thutimestart[0][1] !== thutimend[0][lastfield - 1]) {
      setelement.push({ field: lastfield });
      setAddthu(setelement);
      let timestart = [...thutimestart];
      let timeto = [...thutimend];
      timeto[0][lastfield] = timestart[0][1];
      setThutimend(timeto);
    } else {
      setSnackMessage(t("24 hours Reached"));
      setSnackType("warning");
      handleSnackOpen();
    }

  }
  const removeChannelThu = (val) => {
    let setelement = [...addthu];
    let removed = setelement.filter(x => x.field !== val);
    setAddthu(removed);

  }
  const addnewlineitemFri = () => {
    let setelement = [...addfri];
    const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
    if (fritimestart[0][1] !== fritimend[0][lastfield - 1]) {
      setelement.push({ field: lastfield });
      setAddfri(setelement);
      let timestart = [...fritimestart];
      let timeto = [...fritimend];
      timeto[0][lastfield] = timestart[0][1];
      setFritimend(timeto);
    } else {
      setSnackMessage(t("24 hours Reached"));
      setSnackType("warning");
      handleSnackOpen();
    }
  }
  const removeChannelFri = (val) => {
    let setelement = [...addfri];
    let removed = setelement.filter(x => x.field !== val);
    setAddfri(removed);

  }
  const addnewlineitemSat = () => {
    let setelement = [...addsat];
    const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
    if (sattimestart[0][1] !== sattimend[0][lastfield - 1]) {
      setelement.push({ field: lastfield });
      setAddsat(setelement);
      let timestart = [...sattimestart];
      let timeto = [...sattimend];
      timeto[0][lastfield] = timestart[0][1];
      setSattimend(timeto);
    } else {
      setSnackMessage(t("24 hours Reached"));
      setSnackType("warning");
      handleSnackOpen();
    }
  }
  const removeChannelSat = (val) => {
    let setelement = [...addsat];
    let removed = setelement.filter(x => x.field !== val);
    setAddsat(removed);

  }


  const addcalendervalue = () => {
    if (isReading === true) {
      let finalobjs = [...[shiftnameday[0]], ...[selectedtimestart[0]], ...[selectedtimeend[0]]];

      const obj = {};
      let datarrays = [];

      for (let key in finalobjs[2]) {
        const name = finalobjs[0]
        const startDate = finalobjs[1];
        const endDate = finalobjs[2];

        const addzeros = (hrs, type) => {
          if (moment(new Date()).isDST() && type === 'hr') { // Checking for Day-light Saving
            hrs = hrs === 23 ? 0 : hrs + 1
          }
          if (hrs < 10) {
            hrs = "0" + hrs
          }

          return hrs
        }
        const utchours = (e) => {
          let DST = moment.utc().format(`YYYY-MM-DDT` + e);

          let st = new Date(DST);
          let st1 = st.getUTCHours();
          if (moment(DST).isDST()) { // Checking for Day-light Saving
            st1 = st.getUTCHours() === 23 ? 0 : st.getUTCHours() + 1;
          }
          // console.log(moment(DST).isDST(),"DSTSSSS",st1,st.getUTCHours())

          if (st1 < 10) {
            st1 = "0" + st1
          }
          let St2 = st.getUTCMinutes();
          if (St2 < 10) {
            St2 = "0" + St2
          }
          let T1 = st1 + ":" + St2;
          return T1
        }
        // console.log(startDate,"startDatestartDate")

        obj[key] = {
          name: (name) ? name[key] === undefined || name[key] === '' ? "-" : name[key] : "-",
          startDate: (startDate) ? (startDate[key] !== null ? startDate[key].getUTCHours === undefined ? utchours(startDate[key]) : addzeros(startDate[key].getUTCHours(), 'hr') + ":" + startDate[key].getMinutes === undefined ? null : addzeros(startDate[key].getUTCHours(), 'hr') + ":" + addzeros(startDate[key].getUTCMinutes()) : null) : null,
          endDate: (endDate) ? endDate[key] !== null ? endDate[key].getUTCHours === undefined ? utchours(endDate[key]) : addzeros(endDate[key].getUTCHours(), 'hr') + ":" + endDate[key].getMinutes === undefined ? null : addzeros(endDate[key].getUTCHours(), 'hr') + ":" + addzeros(endDate[key].getUTCMinutes()) : null : null,
          isDST: moment(new Date()).isDST()
        }

        datarrays.push(obj[key])
      }
      // console.log(datarrays,"datarrays")
      for (let i = 0; i < datarrays.length; i++) {
        if (datarrays[0].startDate !== datarrays[datarrays.length - 1].endDate && selectedtimeend[0][`field${[datarrays.length]}`] !== "") {

          selectedtimeend[0][`field${[datarrays.length]}`] = "";
          setSelectedtimeend(selectedtimeend);

        }
      }
      let finalarray = []

      for (let i = 0; i < addFields.length; i++) {
        if (datarrays[i] !== undefined) {
          if (datarrays[i].startDate !== "" && datarrays[i].startDate !== null && datarrays[i].endDate !== "" && datarrays[i].endDate !== null) {
            finalarray.push(datarrays[addFields[i].field - 1])
          }
        }
      }
      if (finalarray.length === 0) {
        finalarray = [{ "name": '', startDate: '00:00', endDate: "00:00" }];
      }
      const hasNaN = hasNaNStartTime(finalarray);
   
      // console.log(finalarray,"finalarray")
      let datas = { "shifts": finalarray, "Noofshift": finalarray.length, "ShiftType": (isReading === true ? "Daily" : "Weekly") }
      if(hasNaN){
        setSnackMessage('Starting Or Ending Period cannot be empty')
        setSnackType("warning")
        setOpenSnack(true)
        return false
      }else{
        props.getupdateshiftwithoutID({ line_id: props.headPlant.id, shift: datas })
      }
      //UpdateShitTimings({ variables: { line_id: headPlant.id, shift: datas } })

    } else {
      const obj1 = {};
      let datarrays1 = [];
      const obj2 = {};
      let datarrays2 = [];
      const obj3 = {};
      let datarrays3 = [];
      const obj4 = {};
      let datarrays4 = [];
      const obj5 = {};
      let datarrays5 = [];
      const obj6 = {};
      let datarrays6 = [];
      const obj7 = {};
      let datarrays7 = [];
      let finalarray1 = []
      let finalarray2 = []
      let finalarray3 = []
      let finalarray4 = []
      let finalarray5 = []
      let finalarray6 = []
      let finalarray7 = []
      // const addzeros = (hrs) => {
      //   if (hrs < 10) {
      //     hrs = "0" + hrs
      //   }
      //   return hrs
      // }
      const utchours = (e) => {
        let st = new Date(moment.utc().format(`YYYY-MM-DDT` + e));
        let st1 = st.getUTCHours();
        if (moment(st).isDST()) { // Checking for Day-light Saving
          st1 = st.getUTCHours() === 23 ? 0 : st.getUTCHours() + 1;
        }
        if (st1 < 10) {
          st1 = "0" + st1
        }
        let St2 = st.getUTCMinutes();
        if (St2 < 10) {
          St2 = "0" + St2
        }
        let T1 = st1 + ":" + St2;
        return T1
      }
      let sunobj = [...[shiftnamesun[0]], ...[sundaytimestart[0]], ...[sundaytimend[0]]];

      for (let key in sunobj[2]) {
        const name = sunobj[0]
        const startDate = sunobj[1];
        const endDate = sunobj[2];

        obj1[key] = {
          name: (name) ? name[key] === undefined || name[key] === '' ? "-" : name[key] : "-",
          startDate: (startDate) ? startDate[key] !== null ? utchours(startDate[key]) : null : null,
          endDate: (endDate) ? (endDate[key] !== null ? utchours(endDate[key]) : null) : null,
          isDST: moment(new Date()).isDST()
        }
        datarrays1.push(obj1[key])
      }
      for (let i = 0; i < addsun.length; i++) {
        if (datarrays1[i] !== undefined) {
          if (datarrays1[i].startDate !== "" && datarrays1[i].startDate !== null && datarrays1[i].endDate !== "" && datarrays1[i].endDate !== null) {
            finalarray1.push(datarrays1[addsun[i].field - 1])
          }
        }

      }
      let monobj = [...[shiftnamemon[0]], ...[montimestart[0]], ...[montimend[0]]];
      for (let key in monobj[2]) {
        const name = monobj[0]
        const startDate = monobj[1];
        const endDate = monobj[2];

        obj2[key] = {
          name: (name) ? name[key] === undefined || name[key] === '' ? "-" : name[key] : "-",
          startDate: (startDate) ? (startDate[key] && startDate[key] !== null ? utchours(startDate[key]) : null) : null,
          endDate: (endDate) ? (endDate[key] !== null ? utchours(endDate[key]) : null) : null,
          isDST: moment(new Date()).isDST()
        }
        datarrays2.push(obj2[key])
      }
      for (let i = 0; i < addmon.length; i++) {
        if (datarrays2[i] !== undefined) {
          if (datarrays2[i].startDate !== "" && datarrays2[i].startDate !== null && datarrays2[i].endDate !== "" && datarrays2[i].endDate !== null) {
            finalarray2.push(datarrays2[addmon[i].field - 1])
          }
        }
      }
      let tueobj = [...[shiftnametue[0]], ...[tuetimestart[0]], ...[tuetimend[0]]];
      for (let key in tueobj[2]) {
        const name = tueobj[0]
        const startDate = tueobj[1];
        const endDate = tueobj[2];

        obj3[key] = {
          name: (name) ? name[key] === undefined || name[key] === '' ? "-" : name[key] : "-",
          startDate: (startDate) ? (startDate[key] !== null ? utchours(startDate[key]) : null) : null,
          endDate: (endDate) ? (endDate[key] !== null ? utchours(endDate[key]) : null) : null,
          isDST: moment(new Date()).isDST()
        }
        datarrays3.push(obj3[key])
      }
      for (let i = 0; i < addtue.length; i++) {
        if (datarrays3[i] !== undefined) {
          if (datarrays3[i].startDate !== "" && datarrays3[i].startDate !== null && datarrays3[i].endDate !== "" && datarrays3[i].endDate !== null) {
            finalarray3.push(datarrays3[addtue[i].field - 1])
          }
        }
      }
      let wedobj = [...[shiftnamewed[0]], ...[wedtimestart[0]], ...[wedtimend[0]]];

      for (let key in wedobj[2]) {
        const name = wedobj[0]
        const startDate = wedobj[1];
        const endDate = wedobj[2];

        obj4[key] = {
          name: (name) ? name[key] === undefined || name[key] === '' ? "-" : name[key] : "-",
          startDate: (startDate) ? (startDate[key] !== null ? utchours(startDate[key]) : null) : null,
          endDate: (endDate) ? (endDate[key] !== null ? utchours(endDate[key]) : null) : null,
          isDST: moment(new Date()).isDST()
        }
        datarrays4.push(obj4[key])
      }
      for (let i = 0; i < addwed.length; i++) {
        if (datarrays4[i] !== undefined) {
          if (datarrays4[i].startDate !== "" && datarrays4[i].startDate !== null && datarrays4[i].endDate !== "" && datarrays4[i].endDate !== null) {
            finalarray4.push(datarrays4[addwed[i].field - 1])
          }
        }
      }
      let thuobj = [...[shiftnamethu[0]], ...[thutimestart[0]], ...[thutimend[0]]];
      for (let key in thuobj[2]) {
        const name = thuobj[0]
        const startDate = thuobj[1];
        const endDate = thuobj[2];

        obj5[key] = {
          name: (name) ? name[key] === undefined || name[key] === '' ? "-" : name[key] : "-",
          startDate: (startDate) ? (startDate[key] !== null ? utchours(startDate[key]) : null) : null,
          endDate: (endDate) ? (endDate[key] !== null ? utchours(endDate[key]) : null) : null,
          isDST: moment(new Date()).isDST()
        }
        datarrays5.push(obj5[key])
      }
      for (let i = 0; i < addthu.length; i++) {
        if (datarrays5[i] !== undefined) {
          if (datarrays5[i].startDate !== "" && datarrays5[i].startDate !== null && datarrays5[i].endDate !== "" && datarrays5[i].endDate !== null) {
            finalarray5.push(datarrays5[addthu[i].field - 1])
          }
        }
      }
      let friobj = [...[shiftnamefri[0]], ...[fritimestart[0]], ...[fritimend[0]]];
      for (let key in friobj[2]) {
        const name = friobj[0]
        const startDate = friobj[1];
        const endDate = friobj[2];

        obj6[key] = {
          name: (name) ? name[key] === undefined || name[key] === '' ? "-" : name[key] : "-",
          startDate: (startDate) ? (startDate[key] !== null ? utchours(startDate[key]) : null) : null,
          endDate: (endDate) ? (endDate[key] !== null ? utchours(endDate[key]) : null) : null,
          isDST: moment(new Date()).isDST()
        }
        datarrays6.push(obj6[key])
      }
      for (let i = 0; i < addfri.length; i++) {
        if (datarrays6[i] !== undefined) {
          if (datarrays6[i].startDate !== "" && datarrays6[i].startDate !== null && datarrays6[i].endDate !== "" && datarrays6[i].endDate !== null) {
            finalarray6.push(datarrays6[addfri[i].field - 1])
          }
        }
      }
      let satobj = [...[shiftnamesat[0]], ...[sattimestart[0]], ...[sattimend[0]]];
      for (let key in satobj[2]) {
        const name = satobj[0]
        const startDate = satobj[1];
        const endDate = satobj[2];

        obj7[key] = {
          name: (name) ? name[key] === undefined || name[key] === '' ? "-" : name[key] : "-",
          startDate: (startDate) ? (startDate[key] !== null ? utchours(startDate[key]) : null) : null,
          endDate: (endDate) ? (endDate[key] !== null ? utchours(endDate[key]) : null) : null,
          isDST: moment(new Date()).isDST()
        }
        datarrays7.push(obj7[key])
      }
      for (let i = 0; i < addsat.length; i++) {
        if (datarrays7[i] !== undefined) {
          if (datarrays7[i].startDate !== "" && datarrays7[i].startDate !== null && datarrays7[i].endDate !== "" && datarrays7[i].endDate !== null) {
            finalarray7.push(datarrays7[addsat[i].field - 1])
          }
        }
      }


      if (finalarray1.length === 0) {
        finalarray1 = [{ "name": '', startDate: utchours('00:00'), endDate: utchours('00:00') }];
      } if (finalarray2.length === 0) {
        finalarray2 = [{ "name": '', startDate: utchours('00:00'), endDate: utchours('00:00') }];
      } if (finalarray3.length === 0) {
        finalarray3 = [{ "name": '', startDate: utchours('00:00'), endDate: utchours('00:00') }];
      } if (finalarray4.length === 0) {
        finalarray4 = [{ "name": '', startDate: utchours('00:00'), endDate: utchours('00:00') }];
      } if (finalarray5.length === 0) {
        finalarray5 = [{ "name": '', startDate: utchours('00:00'), endDate: utchours('00:00') }];
      } if (finalarray6.length === 0) {
        finalarray6 = [{ "name": '', startDate: utchours('00:00'), endDate: utchours('00:00') }];
      } if (finalarray7.length === 0) {
        finalarray7 = [{ "name": '', startDate: utchours('00:00'), endDate: utchours('00:00') }];
      }

    
      let weeklyobjt = [...finalarray1, ...finalarray2, ...finalarray3, ...finalarray4, ...finalarray5, ...finalarray6, ...finalarray7];
      const hasNaN = hasNaNStartTime(weeklyobjt);
      if(hasNaN){
        setSnackMessage('Starting Or Ending Period cannot be empty')
        setSnackType("warning")
        setOpenSnack(true)
        return false
      }else{
        let datas = { "shifts": { 0: finalarray1, 1: finalarray2, 2: finalarray3, 3: finalarray4, 4: finalarray5, 5: finalarray6, 6: finalarray7 }, "Noofshift": weeklyobjt.length, "ShiftType": (isReading === true ? "Daily" : "Weekly") }
        props.getupdateshiftwithoutID({ line_id: props.headPlant.id, shift: datas })
  
      }
     
      //UpdateShitTimings({ variables: { line_id: headPlant.id, shift: datas } })

    }
    handleDialogClosefn()
  }

  function hasNaNStartTime(arr) {
    return arr.some(obj => obj.startDate === 'NaN:NaN' || obj.startDate  === 'NaN:NaN');
}
  const handleDialogClosefn = () => {
    props.handleDialogClose();
  }
  
  return (
    <React.Fragment>
      {shiftDialog &&
        <React.Fragment>
          <Toast type={type} message={message} toastBar={openSnack}  handleSnackClose={() => setOpenSnack(false)} ></Toast>
          <ModalHeaderNDL>
            <TypographyNDL variant="heading-02-xs"  value={"Shift Calendar"} />
          </ModalHeaderNDL>
          <ModalContentNDL>
            {/* <CalenderView/> */}
            <Grid item xs={12} >
              <Grid container spacing={3}>
                {/* <Grid item xs={3} style={{ display: 'flex', alignItems: 'center' }}>
                  <ParagraphText variant="body2" value={t('Frequency')} />
                </Grid>
                <Grid item xs={9}>
                  <div style={{ display: 'flex' }}>
                    <RadioNDL name={t('Daily')} labelText={t('Daily')} id={"daily"} checked={isReading} onChange={() => handleReading()} />
                    <RadioNDL name={t('Weekly')} labelText={t('Weekly')} id={"Weekly"} checked={!isReading} onChange={() => handleReading()} />
                  </div>
                </Grid> */}
                <Grid item xs={5} style={{ justifyContent: "center", display: "flex" }}>{isReading === true ? <ParagraphText variant="body2" value={t('Name')} /> : ''}</Grid>
                <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}>{isReading === true ? <ParagraphText variant="body2" value={t("Starting Period")} /> : ''}</Grid>
                <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}> {isReading === true ? <ParagraphText variant="body2" value={t("Ending Period")} /> : ''} </Grid>
                <Grid item xs={12}>
                  {/* Daily shift */}
                  {isReading === true ?
                    addFields.map(val => {
                      return <Grid container style={{ alignItems: "center", padding: 8 }} spacing={3}>
                        <Grid item xs={5}>
                          <CustomTextField id="line-plant" defaultValue={shiftnameday[0] ? shiftnameday[0][val.field] : ''} value={shiftnameday[0] ? shiftnameday[0][val.field] : ""} onChange={(e) => handleshiftChange(e, val.field)} size="small" variant="outlined" />
                        </Grid>


                        <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}>
                          <DatePickerNDL
                            id={"Time-picker-form" + val.field}
                            onChange={(e) => {
                              console.log(e)
                              handletimefromChange(e, val.field)
                            }}
                            startDate={selectedtimestart[0] !== undefined ? selectedtimestart[0][val.field] === undefined ? selectedtimestart[0][val.field] : selectedtimestart[0][val.field] !== null ? selectedtimestart[0][val.field].getHours !== undefined ? new Date(selectedtimestart[0][val.field]) : new Date(moment().format(`YYYY-MM-DDT` + selectedtimestart[0][val.field])) : null : null}
                            showTimeSelectOnly
                            showTimeSelect
                            dateFormat="HH:mm"
                            timeFormat="HH:mm:ss"
                          />

                        </Grid>
                        <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}>
                          <DatePickerNDL
                            id={"Time-picker" + val.field}
                            onChange={(e) => {
                              handletimetoChange(e, val.field)
                            }}
                            startDate={selectedtimeend[0] !== undefined ? selectedtimeend[0][val.field] === undefined ? selectedtimeend[0][val.field] : selectedtimeend[0][val.field] !== null ? selectedtimeend[0][val.field].getHours !== undefined ? new Date(selectedtimeend[0][val.field]) : new Date(moment().format(`YYYY-MM-DDT` + selectedtimeend[0][val.field])) : null : null}
                            showTimeSelectOnly
                            showTimeSelect
                            dateFormat="HH:mm"
                            timeFormat="HH:mm:ss"
                          />
                        </Grid>
                        <Grid item xs={1} style={{marginBottom:"-6px" }}>
                          {addFields.length !== 1 ? (
                             <Button
                             icon={Delete}
                             stroke={"#FF0D00"}
                             danger
                             type={'ghost'} onClick={() => { removeChannel(val.field) }} />
                          ) : ''}
                        </Grid>
                      </Grid>
                    })
                    :
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <ParagraphText variant="body2" value={t('mon')} />
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={1}>
                          <Grid item xs={5} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Shifts")} /></Grid>
                          <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Starting Period")} /></Grid>
                          <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Ending Period")} /></Grid>
                          <Grid item xs={12}>
                            {addsun.map(val => {
                              {console.log(val,"mondayVal")}
                              return <Grid container style={{ padding: 4 }} spacing={3}>

                                <Grid item xs={5}>
                                  <CustomTextField id="line-plant" defaultValue={shiftnamesun[0] ? shiftnamesun[0][val.field] : ''} value={addsun[0] ? addsun[0][`field${val.field}`] : "test"} onChange={(e) => handlesunday(e, val.field)} size="small" variant="outlined" dynamic={addsun} />
                                </Grid>
                                <Grid item xs={3}>
                                  <DatePickerNDL
                                    id={"Time-picker-form-sun" + val.field}
                                    onChange={(e) => {
                                      handlesundaytimefromChange(e, val.field)
                                    }}
                                    startDate={sundaytimestart[0] !== undefined ? sundaytimestart[0][val.field] === undefined ? sundaytimestart[0][val.field] : sundaytimestart[0][val.field] !== null ? sundaytimestart[0][val.field].getHours !== undefined ? new Date(sundaytimestart[0][val.field]) : new Date(moment().format(`YYYY-MM-DDT` + sundaytimestart[0][val.field])) : null : null}
                                    showTimeSelectOnly
                                    showTimeSelect
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm:ss"
                                  />

                                </Grid>
                                <Grid item xs={3}>
                                  <DatePickerNDL
                                    id={"Time-picker-sun" + val.field}
                                    onChange={(e) => {
                                      handlesundaytimetoChange(e, val.field)
                                    }}
                                    startDate={sundaytimend[0] !== undefined ? sundaytimend[0][val.field] === undefined ? sundaytimend[0][val.field] : sundaytimend[0][val.field] !== null ? sundaytimend[0][val.field].getHours !== undefined ? new Date(sundaytimend[0][val.field]) : new Date(moment().format(`YYYY-MM-DDT` + sundaytimend[0][val.field])) : null : null}
                                    showTimeSelectOnly
                                    showTimeSelect
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm:ss"
                                  />

                                </Grid>

                                <Grid item xs={1} style={{ cursor: "pointer" }}>
                                  {val.field !== 1 ? (
                                    <Delete stroke={'#DA1E28'} onClick={() => { removeChannelSun(val.field) }} />
                                  ) : ''}
                                </Grid>
                              </Grid>
                            })
                            }
                          </Grid>
                          <Grid item xs={12}>
                            <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
                              <Button type="ghost" onClick={() => { addnewlineitemsun(addsun.field) }} value={t('AddField')} />
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                      {/* monday */}
                      <Grid item xs={12}>
                        <ParagraphText variant="body2" value={t('tue')} />
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={3}>
                          <Grid item xs={5} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Shifts")} /></Grid>
                          <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Starting Period")} /></Grid>
                          <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Ending Period")} /></Grid>
                          <Grid item xs={12}>
                            {addmon.map(val => {
                              return <Grid container style={{ padding: 4 }} spacing={3}>
                                <Grid item xs={5}>
                                  <CustomTextField id="line-plant" defaultValue={shiftnamemon[0] ? shiftnamemon[0][val.field] : ''} value={addmon[0] ? addmon[0][`field${val.field}`] : ""} onChange={(e) => handleshiftChangemon(e, val.field)} size="small" variant="outlined" dynamic={addmon} />
                                </Grid>
                                <Grid item xs={3}>
                                  <DatePickerNDL
                                    id={"Time-picker-form-mon" + val.field}
                                    onChange={(e) => {
                                      handletimefromChangeMon(e, val.field)
                                    }}
                                    startDate={montimestart[0] !== undefined ? montimestart[0][val.field] === undefined ? montimestart[0][val.field] : montimestart[0][val.field] !== null ? montimestart[0][val.field].getHours !== undefined ? new Date(montimestart[0][val.field]) : new Date(moment().format(`YYYY-MM-DDT` + montimestart[0][val.field])) : null : null}
                                    showTimeSelectOnly
                                    showTimeSelect
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm:ss"

                                  />

                                </Grid>
                                <Grid item xs={3}>
                                  <DatePickerNDL
                                    id={"Time-picker-mon" + val.field}
                                    onChange={(e) => {
                                      handletimetoChangeMon(e, val.field)
                                    }}
                                    startDate={montimend[0] !== undefined ? montimend[0][val.field] === undefined ? montimend[0][val.field] : montimend[0][val.field] !== null ? montimend[0][val.field].getHours !== undefined ? new Date(montimend[0][val.field]) : new Date(moment().format(`YYYY-MM-DDT` + montimend[0][val.field])) : null : null}
                                    showTimeSelectOnly
                                    showTimeSelect
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm:ss"

                                  />

                                </Grid>



                                <Grid item xs={1} style={{ cursor: "pointer" }}>
                                  {val.field !== 1 ? (
                                    <Delete stroke={'#DA1E28'} onClick={() => { removeChannelMon(val.field) }} />
                                  ) : ''}
                                </Grid>
                              </Grid>
                            })
                            }
                          </Grid>

                          <Grid item xs={12}>
                            <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
                              <Button type="ghost" onClick={() => { addnewlineitemMon(addmon.field) }} value={t('AddField')} />
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <ParagraphText variant="body2" value={t('wed')} />
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={3}>
                          <Grid item xs={5} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Shifts")} /></Grid>
                          <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Starting Period")} /></Grid>
                          <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Ending Period")} /></Grid>
                          <Grid item xs={12}>
                            {addtue.map(val => {
                              return <Grid container style={{ padding: 4 }} spacing={3}>
                                {/* Tuesday */}
                                <Grid item xs={5}>
                                  <CustomTextField id="line-plant" defaultValue={shiftnametue[0] ? shiftnametue[0][val.field] : ''} value={addtue[0] ? addtue[0][`field${val.field}`] : ""} onChange={(e) => handleshiftChangetue(e, val.field)} size="small" variant="outlined" dynamic={addtue} />
                                </Grid>
                                <Grid item xs={3}>
                                  <DatePickerNDL
                                    id={"Time-picker-form-tue" + val.field}
                                    onChange={(e) => {
                                      handletimefromChangeTue(e, val.field)
                                    }}
                                    startDate={tuetimestart[0] !== undefined ? tuetimestart[0][val.field] === undefined ? tuetimestart[0][val.field] : tuetimestart[0][val.field] !== null ? tuetimestart[0][val.field].getHours !== undefined ? new Date(tuetimestart[0][val.field]) : new Date(moment().format(`YYYY-MM-DDT` + tuetimestart[0][val.field])) : null : null}
                                    showTimeSelectOnly
                                    showTimeSelect
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm:ss"

                                  />

                                </Grid>
                                <Grid item xs={3}>
                                  <DatePickerNDL
                                    id={"Time-picker-tue" + val.field}
                                    onChange={(e) => {
                                      handletimetoChangeTue(e, val.field)
                                    }}
                                    startDate={tuetimend[0] !== undefined ? tuetimend[0][val.field] === undefined ? tuetimend[0][val.field] : tuetimend[0][val.field] !== null ? tuetimend[0][val.field].getHours !== undefined ? new Date(tuetimend[0][val.field]) : new Date(moment().format(`YYYY-MM-DDT` + tuetimend[0][val.field])) : null : null}
                                    showTimeSelectOnly
                                    showTimeSelect
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm:ss"

                                  />

                                </Grid>



                                <Grid item xs={1} style={{ cursor: "pointer" }}>
                                  {val.field !== 1 ? (
                                    <Delete  stroke={'#DA1E28'}onClick={() => { removeChannelTue(val.field) }} />
                                  ) : ''}
                                </Grid>
                              </Grid>
                            })
                            }
                          </Grid>

                          <Grid item xs={12}>
                            <div style={{ width: "100%", display: "flex", justifyContent: "end", marginRight: "85px" }}>
                              <Button type="ghost" onClick={() => { addnewlineitemTue(addtue.field) }} value={t('AddField')} />
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <ParagraphText variant="body2" value={t('thu')} />
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={3}>
                          <Grid item xs={5} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Shifts")} /></Grid>
                          <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Starting Period")} /></Grid>
                          <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Ending Period")} /></Grid>
                          <Grid item xs={12}>
                            {addwed.map(val => {
                              return <Grid container style={{ padding: 4 }} spacing={3}>
                                {/* Wednesday */}
                                <Grid item xs={5}>
                                  <CustomTextField id="line-plant" defaultValue={shiftnamewed[0] ? shiftnamewed[0][val.field] : ''} value={addwed[0] ? addwed[0][`field${val.field}`] : ""} onChange={(e) => handleshiftChangewed(e, val.field)} size="small" variant="outlined" dynamic={addwed} />
                                </Grid>
                                <Grid item xs={3}>
                                  <DatePickerNDL
                                    id={"Time-picker-from-wed" + val.field}
                                    onChange={(e) => { handletimefromChangewed(e, val.field) }}
                                    startDate={wedtimestart[0] !== undefined ? wedtimestart[0][val.field] === undefined ? wedtimestart[0][val.field] : wedtimestart[0][val.field] !== null ? wedtimestart[0][val.field].getHours !== undefined ? new Date(wedtimestart[0][val.field]) : new Date(moment().format(`YYYY-MM-DDT` + wedtimestart[0][val.field])) : null : null}
                                    showTimeSelectOnly
                                    showTimeSelect
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm:ss"

                                  />

                                </Grid>
                                <Grid item xs={3}>
                                  <DatePickerNDL
                                    id={"Time-picker-wed" + val.field}
                                    onChange={(e) => {
                                      handletimetoChangewed(e, val.field)
                                    }}
                                    startDate={wedtimend[0] !== undefined ? wedtimend[0][val.field] === undefined ? wedtimend[0][val.field] : wedtimend[0][val.field] !== null ? wedtimend[0][val.field].getHours !== undefined ? new Date(wedtimend[0][val.field]) : new Date(moment().format(`YYYY-MM-DDT` + wedtimend[0][val.field])) : null : null}
                                    showTimeSelectOnly
                                    showTimeSelect
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm:ss"

                                  />

                                </Grid>



                                <Grid item xs={1} style={{ cursor: "pointer" }}>
                                  {val.field !== 1 ? (
                                    <Delete  stroke={'#DA1E28'} onClick={() => { removeChannelWed(val.field) }} />
                                  ) : ''}
                                </Grid>
                              </Grid>
                            })
                            }
                          </Grid>

                          <Grid item xs={12}>
                            <div style={{ width: "100%", display: "flex", justifyContent: "end", marginRight: "85px" }}>
                              <Button type="ghost" onClick={() => { addnewlineitemWed(addwed.field) }} value={t('AddField')} />
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <ParagraphText variant="body2" value={t('fri')} />
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={3}>
                          <Grid item xs={5} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Shifts")} /></Grid>
                          <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Starting Period")} /></Grid>
                          <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Ending Period")} /></Grid>
                          <Grid item xs={12}>
                            {addthu.map(val => {
                              return <Grid container style={{ padding: 4 }} spacing={3}>
                                {/* Thurday */}
                                <Grid item xs={5}>
                                  <CustomTextField id="line-plant" defaultValue={shiftnamethu[0] ? shiftnamethu[0][val.field] : ''} value={addthu[0] ? addthu[0][`field${val.field}`] : ""} onChange={(e) => handleshiftChangethu(e, val.field)} size="small" variant="outlined" dynamic={addthu} />
                                </Grid>
                                <Grid item xs={3}>
                                  <DatePickerNDL
                                    id={"Time-picker-thu-from" + val.field}
                                    onChange={(e) => {
                                      handletimefromChangethu(e, val.field)
                                    }}
                                    startDate={thutimestart[0] !== undefined ? thutimestart[0][val.field] === undefined ? thutimestart[0][val.field] : thutimestart[0][val.field] !== null ? thutimestart[0][val.field].getHours !== undefined ? new Date(thutimestart[0][val.field]) : new Date(moment().format(`YYYY-MM-DDT` + thutimestart[0][val.field])) : null : null}
                                    showTimeSelectOnly
                                    showTimeSelect
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm:ss"

                                  />

                                </Grid>
                                <Grid item xs={3}>
                                  <DatePickerNDL
                                    id={"Time-picker-thu" + val.field}
                                    onChange={(e) => {
                                      handletimetoChangethu(e, val.field)
                                    }}
                                    startDate={thutimend[0] !== undefined ? thutimend[0][val.field] === undefined ? thutimend[0][val.field] : thutimend[0][val.field] !== null ? thutimend[0][val.field].getHours !== undefined ? new Date(thutimend[0][val.field]) : new Date(moment().format(`YYYY-MM-DDT` + thutimend[0][val.field])) : null : null}
                                    showTimeSelectOnly
                                    showTimeSelect
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm:ss"

                                  />

                                </Grid>

                                <Grid item xs={1} style={{ cursor: "pointer" }}>
                                  {val.field !== 1 ? (
                                    <Delete stroke={'#DA1E28'} onClick={() => { removeChannelThu(val.field) }} />
                                  ) : ''}
                                </Grid>
                              </Grid>
                            })
                            }
                          </Grid>

                          <Grid item xs={12}>
                            <div style={{ width: "100%", display: "flex", justifyContent: "end", marginRight: "85px" }}>
                              <Button type="ghost" onClick={() => { addnewlineitemThu(addthu.field) }} value={t('AddField')} />
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <ParagraphText variant="body2" value={t('sat')} />
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={3}>
                          <Grid item xs={5} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Shifts")} /></Grid>
                          <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Starting Period")} /></Grid>
                          <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="body2" value={t("Ending Period")} /></Grid>
                          <Grid item xs={12}>
                            {addfri.map(val => {
                              return <Grid container style={{ padding: 4 }} spacing={3}>
                                {/* Friday */}
                                <Grid item xs={5}>
                                  <CustomTextField id="line-plant" defaultValue={shiftnamefri[0] ? shiftnamefri[0][val.field] : ''} value={addfri[0] ? addfri[0][`field${val.field}`] : ""} onChange={(e) => handleshiftChangefri(e, val.field)} size="small" variant="outlined" dynamic={addfri} />
                                </Grid>
                                <Grid item xs={3}>
                                  <DatePickerNDL
                                    id={"Time-picker-fri-from" + val.field}
                                    onChange={(e) => {
                                      handletimefromChangefri(e, val.field)
                                    }}
                                    startDate={fritimestart[0] !== undefined ? fritimestart[0][val.field] === undefined ? fritimestart[0][val.field] : fritimestart[0][val.field] !== null ? fritimestart[0][val.field].getHours !== undefined ? new Date(fritimestart[0][val.field]) : new Date(moment().format(`YYYY-MM-DDT` + fritimestart[0][val.field])) : null : null}
                                    showTimeSelectOnly
                                    showTimeSelect
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm:ss"

                                  />

                                </Grid>
                                <Grid item xs={3}>
                                  <DatePickerNDL
                                    id={"Time-picker-fri" + val.field}
                                    onChange={(e) => {
                                      handletimetoChangefri(e, val.field)
                                    }}
                                    startDate={fritimend[0] !== undefined ? fritimend[0][val.field] === undefined ? fritimend[0][val.field] : fritimend[0][val.field] !== null ? fritimend[0][val.field].getHours !== undefined ? new Date(fritimend[0][val.field]) : new Date(moment().format(`YYYY-MM-DDT` + fritimend[0][val.field])) : null : null}
                                    showTimeSelectOnly
                                    showTimeSelect
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm:ss"

                                  />

                                </Grid>



                                <Grid item xs={1} style={{ cursor: "pointer" }}>
                                  {val.field !== 1 ? (
                                    <Delete stroke={'#DA1E28'} onClick={() => { removeChannelFri(val.field) }} />
                                  ) : ''}
                                </Grid>
                              </Grid>
                            })
                            }
                          </Grid>

                          <Grid item xs={12}>
                            <div style={{ width: "100%", display: "flex", justifyContent: "end", marginRight: "85px" }}>
                              <Button type="ghost" onClick={() => { addnewlineitemFri(addfri.field) }} value={t('AddField')} />
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <ParagraphText variant="body2" value={t('sun')} />
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={3}>
                          <Grid item xs={5} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="label-02-xs" value={t("Shifts")} /></Grid>
                          <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="label-02-xs" value={"Starts At"} /></Grid>
                          <Grid item xs={3} style={{ justifyContent: "center", display: "flex" }}><ParagraphText variant="label-02-xs" value={"Ends At"} /></Grid>
                          <Grid item xs={12}>
                            {addsat.map(val => {
                              return <Grid container style={{ padding: 4 }} spacing={3}>
                                {/* Saturday */}
                                <Grid item xs={5}>
                                  <CustomTextField id="line-plant" defaultValue={shiftnamesat[0] ? shiftnamesat[0][val.field] : ''} value={addsat[0] ? addsat[0][`field${val.field}`] : ""} onChange={(e) => handleshiftChangesat(e, val.field)} size="small" variant="outlined" dynamic={addsat} />
                                </Grid>
                                <Grid item xs={3}>
                                  <DatePickerNDL
                                    id={"Time-picker-sat-from" + val.field}
                                    onChange={(e) => {
                                      handletimefromChangesat(e, val.field)
                                    }}
                                    startDate={sattimestart[0] !== undefined ? sattimestart[0][val.field] === undefined ? sattimestart[0][val.field] : sattimestart[0][val.field] !== null ? sattimestart[0][val.field].getHours !== undefined ? new Date(sattimestart[0][val.field]) : new Date(moment().format(`YYYY-MM-DDT` + sattimestart[0][val.field])) : null : null}
                                    showTimeSelectOnly
                                    showTimeSelect
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm:ss"

                                  />

                                </Grid>
                                <Grid item xs={3}>
                                  <DatePickerNDL
                                    id={"Time-picker-sat" + val.field}
                                    onChange={(e) => {
                                      handletimetoChangesat(e, val.field)
                                    }}
                                    startDate={sattimend[0] !== undefined ? sattimend[0][val.field] === undefined ? sattimend[0][val.field] : sattimend[0][val.field] !== null ? sattimend[0][val.field].getHours !== undefined ? new Date(sattimend[0][val.field]) : new Date(moment().format(`YYYY-MM-DDT` + sattimend[0][val.field])) : null : null}
                                    showTimeSelectOnly
                                    showTimeSelect
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm:ss"

                                  />

                                </Grid>



                                <Grid item xs={1} style={{ cursor: "pointer" }}>
                                  {val.field !== 1 ? (
                                    <Delete stroke={'#DA1E28'} onClick={() => { removeChannelSat(val.field) }} />
                                  ) : ''}
                                </Grid>
                              </Grid>
                            })
                            }
                          </Grid>

                          <Grid item xs={12}>
                            <div style={{ width: "100%", display: "flex", justifyContent: "end", marginRight: "85px" }}>
                              <Button type="tertiary" onClick={() => { addnewlineitemSat(addsat.field) }} icon={Plus} value={t('Add Shift')} />
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>

                    </Grid>


                  }
                </Grid>
                <Grid item xs={8}></Grid>

                <Grid item xs={4}>
                  {isReading === true ? <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
                    <Button type="tertiary" onClick={() => { addnewlineitem(addFields.field) }} icon={Plus} value={t('Add Shift')} />
                  </div> : ''}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ display: "none" }}>
              <Chart options={options} type="rangeBar" series={series} width="80%" />
            </Grid>
          </ModalContentNDL>
          <ModalFooterNDL>
            <Button type="secondary" value={t('Cancel')}  onClick={() => handleDialogClosefn()} />

            <Button type="primary"  value={t('Update')} onClick={() => addcalendervalue()} />


          </ModalFooterNDL>
        </React.Fragment >
      }
    </React.Fragment>
  )
});

export default AddShiftCalendar
