import React, { useState, useEffect, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from "recoil";
import { themeMode, selectedPlant, VirtualInstrumentsList, instrumentsList } from "recoilStore/atoms";
import CustomTextField from "components/Core/InputFieldNDL";
import DatePickerNDL from "components/Core/DatepickerNDL";
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import Button from "components/Core/ButtonNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import moment from "moment";
import useTheme from "TailwindTheme";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Toast from "components/Core/Toast/ToastNDL";

//Hooks
import useAlertConfigurations from "components/layouts/Alarms/hooks/useGetAlertConfigurations.jsx"
import useDeleteAlarm from 'components/layouts/Alarms/hooks/useDeleteAlarm.jsx';
import Grid from 'components/Core/GridNDL';

const AddTimeslot = React.forwardRef((props, ref) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [addFields, setAddFields] = useState([{ field: 1 }]);
    const [timeslotname, setTimeSlot] = useState([]);
    const [timeslotstandardenergy, setTimeSlotStandardEnergy] = useState([])
    const [timeslotstandardrate, setTimeSlotStandardRate] = useState([])
    const [selectedtimestart, setSelectedtimestart] = useState([]);
    const [selectedtimeend, setSelectedtimeend] = useState([]);
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setSnackMessage] = useState('');
    const [type, setSnackType] = useState('');
    const [headPlant] = useRecoilState(selectedPlant);
    const [timeslotDialog, setTimeslotDialog] = useState(false);
    const [timeslotenergyasset, setTimeSlotEnergyAsset] = useState([])
    const [timeslotenergynodes, setTimeSlotEnergyNodes] = useState([])
    const [TimeDeleteID, setTimeDeleteID] = useState([])

    const [vInstruments] = useRecoilState(VirtualInstrumentsList);
    const [instruments] = useRecoilState(instrumentsList);
    const [curTheme] = useRecoilState(themeMode);

    const { alertConfigurationsLoading, alertConfigurationsdata, alertConfigurationserror, getAlertConfigurations } = useAlertConfigurations();
    const { getDeleteAlarm } = useDeleteAlarm()

    useEffect(() => {
        getAlertConfigurations(headPlant.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])

    useEffect(() => {
        if (props.timeslots) {
            callseries()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.timeslots])

    useImperativeHandle(ref, () =>
    (
        {
            handleTimeslotEdit: (data) => {
                setTimeslotDialog(true);
            }

        }
    ))

    const handleDialogClose = () => {
        props.handleTimeDialogClose();
        setTimeslotDialog(false);
        setTimeDeleteID([])
    }


    const callseries = () => {
        let timeslotdatas = {};
        timeslotdatas = props.timeslots
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
                    let ID = timeslotdatas.timeslot.timeslots[j].id ? timeslotdatas.timeslot.timeslots[j].id : j + 1
                    objday = { field: ID }
                    channelday.push(objday)
                    let DST1 = moment().format(`YYYY-MM-DDT` + timeslotdatas.timeslot.timeslots[j].startDate) + "Z"
                    if (moment(DST1).isDST()) { // Checking for Day-light Saving
                        DST1 = moment(DST1).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm:ss`)
                    }
                    let st = new Date(DST1);
                    // let st = new Date(moment().format(`YYYY-MM-DDT` + timeslotdatas.timeslot.timeslots[j].startDate) + 'Z');
                    let st1 = st.toLocaleTimeString('en-GB')
                    let st2 = st1.split(":")
                    let DST2 = moment().format(`YYYY-MM-DDT` + timeslotdatas.timeslot.timeslots[j].endDate) + "Z"
                    if (moment(DST2).isDST()) {
                        DST2 = moment(DST2).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm:ss`)
                    }
                    let et = new Date(DST2);
                    // let et = new Date(moment().format(`YYYY-MM-DDT` + timeslotdatas.timeslot.timeslots[j].endDate) + 'Z');
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
            // console.log(channelday,"channeldaychannelday",timeslotdatas.timeslot.timeslots,channels3day)
            setAddFields(channelday)
            setTimeSlot(ChannelArrday);
            setSelectedtimeend(channels3day)
            setSelectedtimestart(channels2day)
            setTimeSlotStandardEnergy(channels4day);
            setTimeSlotStandardRate(channels5day)

        }

    }
    //Add a new time slot
    const addnewlineitem = () => {
        let setelement = [...addFields];
        const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
        const lasttime = selectedtimeend[0][lastfield - 1]
        const lastSlot = timeslotname[0][lastfield - 1]
        setelement.push({ field: lastfield });
        if (lastSlot) {
            setAddFields(setelement);
            handletimetoChange(typeof (lasttime) === "string" ?
                new Date(moment().format(`YYYY-MM-DDT` + lasttime + `:00Z`))
                : lasttime, lastfield)
            handletimefromChange(typeof (lasttime) === "string" ?
                new Date(moment().format(`YYYY-MM-DDT` + lasttime + `:00Z`))
                : lasttime, lastfield)
        } else {
            setSnackMessage(t("PleaseSlotdetails"));
            setSnackType("warning");
            setOpenSnack(true);
        }

        console.log(setelement, "setelement", addFields, lasttime, new Date(moment().format(`YYYY-MM-DDT` + lasttime + `:00Z`)), selectedtimeend, lastfield, timeslotname)

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
        // console.log(slotname,"slotnameslotname",val,DelID)
        let removed = setelement.filter(x => x.field !== val);
        setAddFields(removed);

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
        let T1 = st1 + ":" + St2;
        return T1
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
                let filteredID = Id.filter(e => e.field === Number(key))
                const addzeros = (hrs, type) => {
                    if (moment(new Date()).isDST() && type === 'hr') {
                        // Checking for Day-light Saving
                        hrs = hrs === 23 ? 0 : hrs + 1
                    }

                    if (hrs < 10) {
                        hrs = "0" + hrs
                    }
                    return hrs
                }
                // console.log(key,"keykeykey")
                obj[key] = {
                    name: (name) ? name[key] === undefined || name[key] === '' ? "-" : name[key] : "-",
                    startDate:
                        (startDate) ?
                            startDate[key] !== null ?
                                typeof (startDate[key]) === "string" ?
                                    utchours(startDate[key])
                                    : addzeros(new Date(startDate[key]).getUTCHours(), 'hr') + ":" +
                                        new Date(startDate[key]).getMinutes() === undefined
                                        ? null
                                        : addzeros(new Date(startDate[key]).getUTCHours(), 'hr') + ":" + addzeros(new Date(startDate[key]).getUTCMinutes())
                                : null
                            : null,
                    endDate:
                        (endDate) ?
                            endDate[key] !== null ?
                                typeof (endDate[key]) === "string" ?
                                    utchours(endDate[key])
                                    : addzeros(new Date(endDate[key]).getUTCHours(), 'hr') + ":" + new Date(endDate[key]).getMinutes() === undefined
                                        ? null
                                        : addzeros(new Date(endDate[key]).getUTCHours(), 'hr') + ":" + addzeros(new Date(endDate[key]).getUTCMinutes())
                                : null
                            : null,
                    stdenergy: (stdenergy) ? stdenergy[key] === undefined || stdenergy[key] === '' ? "-" : stdenergy[key] : "-",
                    stdrate: (stdrate) ? stdrate[key] === undefined || stdrate[key] === '' ? "-" : stdrate[key] : "-",
                    startTime: typeof (startDate[key]) === "string" ? new Date(moment().format(`YYYY-MM-DDT` + startDate[key] + `:00`)) :
                        new Date(startDate[key]),
                    endTime: typeof (endDate[key]) === "string" ? new Date(moment().format(`YYYY-MM-DDT` + endDate[key] + `:00`)) :
                        new Date(endDate[key]),
                    id: filteredID.length > 0 && filteredID[0].field
                }

                datarrays.push(obj[key])
            }
            // console.log(datarrays,"datarraysdatarrays",addFields)
            for (let i = 0; i < datarrays.length; i++) {
                if (datarrays[0].startDate !== datarrays[datarrays.length - 1].endDate && selectedtimeend[0][`field${[datarrays.length]}`] !== "") {
                    selectedtimeend[0][`field${[datarrays.length]}`] = "";
                    setSelectedtimeend(selectedtimeend);

                }
            }
            let finalarray = []
            var hours = 0
            // eslint-disable-next-line array-callback-return
            addFields.map((val, i) => {

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
                props.getupdatetimeslot({ line_id: headPlant.id, timeslot: datas })
                let AlarmRule = !alertConfigurationsLoading && !alertConfigurationserror && alertConfigurationsdata ? alertConfigurationsdata.filter(e => e.alertType === "timeslot") : []
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
                // console.log(AlarmRule,"alertConfigurationsdataalertConfigurationsdata",TimeDeleteID,RuleDelete)
                handleDialogClose()

            }

        }
        catch (error) {
            console.log(error, "updatefailed")
            timeslotnotification(t("Failed to update TimeSlots"), "warning")
            //   props.getTimeslotList(headPlant.id);
        }



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
            {timeslotDialog &&
                <React.Fragment>
                    
                    <Toast type={type} message={message} toastBar={openSnack}  handleSnackClose={() => setOpenSnack(false)} ></Toast>
                    <ModalHeaderNDL>
                        <TypographyNDL variant="heading-02-xs" model value={t('Timeslot')} />
                    </ModalHeaderNDL>
                    <ModalContentNDL>
                    <Grid container spacing={3}>
                            <Grid sm={6} >
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
                                    edit={true}
                                />
                            </Grid>
                            <Grid sm={6} >
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
                                    edit={true}
                                />
                            </Grid>
                        </Grid>
                        <div  className='mt-3' />
                        {addFields.map(val => {

                            return (

                                <div className='mb-3 items-center' style={{ alignItems: "self-end", display: "flex"}}>
                                    <div style={{ marginRight: 8 }}>
                                        <CustomTextField
                                           label={t('Slot Name')}
                                            id="time-slot-name"
                                            defaultValue={timeslotname[0] ? timeslotname[0][val.field] : ''}
                                            value={timeslotname[0] ? timeslotname[0][val.field] : ""}
                                            style={{ width: '98%' }}
                                            onChange={(e) => handletimeslotChange(e, val.field)}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </div>
                                    <div style={{ marginRight: 8 }}>
                                        <div >
                                            <TypographyNDL
                                                variant="paragraph-xs"
                                                value={t("Starts At")} /></div>

                                        <DatePickerNDL
                                            id={"Time-picker-start" + val.field}
                                            onChange={(e) => {
                                                handletimefromChange(e, val.field)
                                            }}
                                            startDate={selectedtimestart && selectedtimestart[0] !== undefined ?
                                                selectedtimestart[0][val.field] === undefined ?
                                                    new Date(moment().format(`YYYY-MM-DDT` + selectedtimeend[0][val.field - 1]))
                                                    : selectedtimestart[0][val.field] !== null
                                                        ? typeof (selectedtimestart[0][val.field]) === "string"
                                                            ? new Date(moment().format(`YYYY-MM-DDT` + selectedtimestart[0][val.field]))
                                                            : new Date(selectedtimestart[0][val.field])
                                                        : new Date(moment().format(`YYYY-MM-DDT` + selectedtimeend[0][val.field - 1]))
                                                : new Date(moment().format(`YYYY-MM-DDT` + selectedtimeend[0][val.field - 1]))}
                                            showTimeSelectOnly
                                            showTimeSelect
                                            dateFormat="HH:mm"
                                            timeFormat="HH:mm:ss"
                                        />


                                    </div>
                                    <div style={{ marginRight: 8 }}>
                                        <div >
                                            <TypographyNDL
                                                variant="paragraph-xs"
                                                value={t("Ends at")} /></div>

                                        <DatePickerNDL
                                            id={"Time-picker-end" + val.field}
                                            onChange={(e) => {
                                                handletimetoChange(e, val.field)
                                            }}
                                            startDate={selectedtimeend && selectedtimeend[0] !== undefined ?
                                                selectedtimeend[0][val.field] === undefined ?
                                                    new Date(moment().format(`YYYY-MM-DDT` + selectedtimeend[0][val.field - 1]))
                                                    : selectedtimeend[0][val.field] !== null
                                                        ? typeof (selectedtimeend[0][val.field]) === "string"
                                                            ? new Date(moment().format(`YYYY-MM-DDT` + selectedtimeend[0][val.field]))
                                                            : new Date(selectedtimeend[0][val.field])
                                                        : new Date(moment().format(`YYYY-MM-DDT` + selectedtimeend[0][val.field - 1]))
                                                : new Date(moment().format(`YYYY-MM-DDT` + selectedtimeend[0][val.field - 1]))}
                                            showTimeSelectOnly
                                            showTimeSelect
                                            dateFormat="HH:mm"
                                            timeFormat="HH:mm:ss"
                                        />


                                    </div>
                                    <div style={{ marginRight: 8 }}>
                                        <div >
                                            <TypographyNDL
                                                variant="paragraph-xs"
                                                value={t('Std Energy (kwh)')} /></div>
                                        <CustomTextField
                                            id="standard-energy"
                                            defaultValue={timeslotstandardenergy[0] ? timeslotstandardenergy[0][val.field] : ''}
                                            value={timeslotstandardenergy[0] ? timeslotstandardenergy[0][val.field] : ""}
                                            style={{ width: '98%' }}
                                            onChange={(e) => handletimeslotstandardenergyChange(e, val.field)}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </div>
                                    <div >
                                        <div >
                                            <TypographyNDL
                                                variant="paragraph-xs"
                                                value={t('Std Rate (₹)')}
                                            /></div>
                                        <CustomTextField
                                            id="standard-rate"
                                            defaultValue={timeslotstandardrate[0] ? timeslotstandardrate[0][val.field] : ''}
                                            value={timeslotstandardrate[0] ? timeslotstandardrate[0][val.field] : ""}
                                            style={{ width:'98%' }}
                                            onChange={(e) => handletimeslotstandardrateChange(e, val.field)}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </div>

                                    <div className='mb-[-6px]'>
                                        {addFields.length !== 1 ? (
                                            <Button
                                                icon={Delete}
                                                stroke={"#FF0D00"}
                                                danger
                                                type={'ghost'}
                                                onClick={() => { removeChannel(val.field) }} />
                                        ) : 
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#FFFFFF" stroke-width="1.7" stroke-miterlimit="10"/>
                                        <path d="M8 8L16 16M8 16L16 8L8 16Z" stroke="#FFFFFF" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                            }
                                    </div>
                                </div>

                            )
                        })
                        }
                        {addFields.length < 8 ?
                        <div>
                            <div className='mb-3 float-right'>
                                <Button  type="tertiary" onClick={() => { addnewlineitem(addFields.field) }} value={t('Add Slot')} icon={Plus} />
                            </div>
                                {TimeDeleteID.length > 0 &&
                                <TypographyNDL value={t('TimeSlotDeleteNote')} color='danger' variant={'paragraph-xs'} />
                                    }
                        </div>
                          
                            
                            : <React.Fragment></React.Fragment>
                        }
                       
                    </ModalContentNDL>
                    <ModalFooterNDL>
                        <Button style={{ width: "100px" }} type={"secondary"}
                            onClick={() => handleDialogClose()}
                            value={t('Cancel')}
                        />
                        <Button
                            type="primary"
                            style={{ float: "right", width: "100px" }}
                            onClick={() => { addcalendervalue() }}
                            value={t('Save')} />

                    </ModalFooterNDL>
                </React.Fragment>}
        </React.Fragment>
    )
});
export default AddTimeslot;
