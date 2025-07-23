/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import useGetTheme from 'TailwindTheme';
import EnhancedTable from "components/Table/Table";
import useTimeSlot from "Hooks/useTimeSlot";
import { selectedPlant, VirtualInstrumentsList, instrumentsList } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Typography from "components/Core/Typography/TypographyNDL";
import SelectBox from 'components/Core/DropdownList/DropdownListNDL';

function Details(props) {
    const { t } = useTranslation();
    const { outshiftLoading, outshiftData, outshiftError, gettimeslot } = useTimeSlot();
    const [timeSlot, setTimeSlot] = useState([])
    const [timeSlotData, setTimeSlotData] = useState([])
    const [headPlant] = useRecoilState(selectedPlant)
    const [childcolumns, setchildcolumns] = useState([])
    const [vInstruments] = useRecoilState(VirtualInstrumentsList);
    const [headCells, setheadCells] = useState([])
    const [selectedcolnames, setselectedcolnames] = useState([])
    const [childheadCells, setchildHeadCells] = useState([])
    const [instruments] = useRecoilState(instrumentsList);
    const theme = useGetTheme();

    useEffect(() => {
        gettimeslot(headPlant.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setheadCells(timeSlot)
        setchildHeadCells(childcolumns)
        setselectedcolnames(timeSlot.filter(val => !val.hide))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeSlot])
    useEffect(() => {
        if (!outshiftLoading && outshiftData && !outshiftError) {
            if (outshiftData.timeslot && outshiftData.timeslot.timeslots && outshiftData.timeslot.timeslots.length > 0) {
                const slots = outshiftData.timeslot.timeslots;
                let spanRows = [
                    {
                        title: "",
                        dataIndex: "Date",
                        key: "date"
                    },
                    {
                        title: "",
                        dataIndex: "Entity",
                        key: "entity"
                    },
                ];
                const formatColumn = slots.map((x, index) => {
                    let column = {
                        id: x.name.replaceAll(' ', ''),
                        numeric: true,
                        disablePadding: true,
                        label: x.name,
                        subLabel: x.stdRate,
                        colSpan:2
                    }
                    spanRows.push(
                        {
                            title: "Energy (kwh)",
                            dataIndex: "Energy (kwh)",
                            key: x.name.replaceAll(' ', '') + "-energy"
                        },
                        {
                            title: "Rate (₹)",
                            dataIndex: "Rate (₹)",
                            key: x.name.replaceAll(' ', '') + "-rate"
                        }
                    )

                    return column
                }) 
                if (formatColumn.length > 0) {
                    const firstColumn = [
                        {
                            id: 'date',
                            numeric: false,
                            disablePadding: true,
                            label: t('Date'),
                        },
                        {
                            id: 'entity',
                            numeric: false,
                            disablePadding: true,
                            label: t('Entity'),
                        },]

                    const lastColumn = [{
                        id: 'total',
                        numeric: false,
                        disablePadding: true,
                        label: t('Daywise Total'),
                        colSpan:2
                    }]
                    spanRows.push(
                        {
                            title: "Energy (kwh)",
                            dataIndex: "Energy (kwh)",
                            key: "total-energy"
                        },
                        {
                            title: "Rate (₹)",
                            dataIndex: "Rate (₹)",
                            key: "total-rate"
                        }
                    )
                    const concatColumn = [...firstColumn, ...formatColumn, ...lastColumn];
                    setTimeSlot(concatColumn);

                } else {
                    setTimeSlot([]);
                }
                setchildcolumns(spanRows)
            } else {
                setTimeSlot([]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outshiftLoading, outshiftData, outshiftError])

    useEffect(() => {
        const data = props.data;
        let formatData = [];
        let lastRow = {};
        let timeslots = headPlant.timeslot.timeslots
        if (data && Array.isArray(data) && data.length > 0) {
            data.forEach(y => {
                const viname = vInstruments.filter(v => v.id === y.viid)[0]
                    ? vInstruments.filter(v => v.id === y.viid)[0].name
                    : instruments.filter(v => v.id === y.viid)[0]
                        && instruments.filter(v => v.id === y.viid)[0].name
                        
                const viid = y.viid
                      // eslint-disable-next-line array-callback-return
                y.data && y.data.forEach((x) => {
                    let slot = {};
                    const date = x.day;
                    const column = x.name && x.name.replaceAll(' ', '');
                    const value = x.value ? x.value : 0
                    const exist = formatData.findIndex(f => (f.date === date) && (f.viid === viid));
                    const timeslotindex = timeslots.findIndex(ts => ts.name === x.name)
                    const stdrate = timeslotindex >= 0 && timeslots[timeslotindex].stdrate && isNaN(Number(timeslots[timeslotindex].stdrate)) ? '' : Number(timeslots[timeslotindex].stdrate) 
                    const lrObjExist = Object.keys(lastRow).length > 0 ? Object.keys(lastRow).find(z => z === column + "-energy") : false;
                    if (lrObjExist) {
                        const existVal = Number(lastRow[column + "-energy"]);
                        lastRow[column + "-energy"] = (existVal + value).toFixed(2);
                        lastRow[column + "-rate"] = stdrate ? ((existVal + value) * stdrate).toFixed(2) : '-';
                        lastRow['total-energy'] = (existVal + value).toFixed(2);
                        lastRow['total-rate'] = stdrate ? ((existVal + value) * stdrate).toFixed(2) : lastRow['total-rate']
                    } else {
                        lastRow['date'] = 'Total Consumption(kwh)';
                        lastRow['entity'] = ''
                        lastRow['viid'] = viid
                        lastRow[column + "-energy"] = value.toFixed(2);
                        lastRow[column + "-rate"] = stdrate ? (value * stdrate).toFixed(2) : '-';
                        lastRow['total-energy'] = value.toFixed(2);
                        lastRow['total-rate'] = stdrate ? (value * stdrate).toFixed(2) : '-'
                    }
                    if (exist >= 0) {

                        let existObj = { ...formatData[exist] };
                        let totalenergy = Number(existObj["total-energy"]);
                        let totalrate = Number(existObj["total-rate"]);
                        slot[column + "-energy"] = value.toFixed(2);
                        slot[column + "-rate"] = stdrate ? (value * stdrate).toFixed(2) : '-';
                        slot['total-energy'] = (totalenergy + value).toFixed(2);
                        slot['total-rate'] = stdrate ? (totalrate + (value * stdrate)).toFixed(2) : existObj['total-rate']
                        formatData[exist] = { ...existObj, ...slot };
                    } else {
                        slot['date'] = date;
                        slot['entity'] = viname
                        slot['viid'] = viid
                        slot[column + "-energy"] = value.toFixed(2);
                        slot[column + "-rate"] = stdrate ? (value * stdrate).toFixed(2) : '-'
                        slot['total-energy'] = value.toFixed(2);
                        slot['total-rate'] = stdrate ? (value * stdrate).toFixed(2) : '-'
                        formatData.push(slot);
                    }
                })

            })
        }
        if (formatData.length > 0) {
            const constotalenergy = formatData.map(item => item["total-energy"]).reduce((prev, next) => (Number(prev) ? Number(prev) : 0)
                + (Number(next) ? Number(next) : 0));
            const constotalrate = formatData.map(item => item["total-rate"]).reduce((prev, next) => (Number(prev) ? Number(prev) : 0)
                + (Number(next) ? Number(next) : 0));
            lastRow['total-energy'] = constotalenergy && constotalenergy !== undefined ? parseFloat(constotalenergy).toFixed(2) : 0;
            lastRow['total-rate'] = constotalrate && constotalrate !== undefined ? parseFloat(constotalrate).toFixed(2) : 0;
            formatData.push(lastRow);
        }
        processedrows(formatData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])
    const processedrows = (data) => {
        if (data && data.length > 0 && childcolumns && childcolumns.length > 0) {
            let temptabledata = []
            temptabledata = temptabledata.concat(
                data.map((val, index) => {
                    if (val) {
                        let arr = [];
                        childcolumns.forEach(x => {
                            arr.push(val[x.key] ? val[x.key] : '-')
                        })
                        return arr;
                    }
                    else return []
                })
            )
            setTimeSlotData(temptabledata)
        } else {
            setTimeSlotData([])
        }
    }


    const handleColChange = (e) => {
        const value = e;
        let tempcolnames = []
        let newCell = []
        let newChildCell = []
        timeSlot.forEach(p => {
            let index = value.findIndex(v => p.id === v.id)
            if (index >= 0) {
                tempcolnames.push(p)
                newCell.push({ ...p, display: 'block' })
            } else {
                newCell.push({ ...p, display:  'none' })
            }
        })

        childcolumns.forEach(c => {

            let index = value.findIndex(v => (c.key === v.id.replaceAll(' ', '') + '-energy') || (c.key === v.id.replaceAll(' ', '') + '-rate') || (c.key === v.id))
            if (index >= 0) {

                newChildCell.push({ ...c, display: 'block' })
            } else {
                newChildCell.push({ ...c, display: 'none' })
            }
        })
        setheadCells(newCell)
        setchildHeadCells(newChildCell)
        setselectedcolnames(tempcolnames);
    }
    
    return (
            <div style={{ height: "400px", marginTop: 16 }}>
            <div style={{ float: "left",padding:"16px" }} >
                <Typography 
                    variant='heading-01-xs'
                    color='secondary'
                     value={t("Timeslot Details")} />
            </div> 
                <div style={{ float: "right", marginTop:"10px", marginRight:"10px" }}>
                    <SelectBox
                        labelId="filter-column-alarm-rules"
                        id="filter"
                        placeholder={t("Select column")}
                        disabledName={t("FilterColumn")}
                        auto={false}
                        edit={true}
                        options={timeSlot.filter(c => !c.hide)}
                        keyValue={"label"}
                        keyId={"id"}
                        value={selectedcolnames}
                        multiple={true}
                        isMArray={true}
                        onChange={(e) => handleColChange(e)}
                        checkbox={true}
                        selectAll={true}
                        selectAllText={"Select All"}
                    />

                </div>
                {
                    timeSlot.length > 0 && 
                        <React.Fragment>
                            {
                                timeSlotData.length > 0 ? (
                                    <EnhancedTable
                                        headCells={headCells}
                                        colSpan={2}
                                        spanRows={childheadCells}
                                        multitable={true}
                                        data={timeSlotData}
                                        rawdata={timeSlotData}
                                        search={true}
                                        download={true}
                                        total={true}
                                        spanIndex={1}
                                    />
                                ) : (
                                    <React.Fragment>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br>

                                        <Typography style={{ color: theme.colorPalette.primary, textAlign: 'center' }}
                                            value="No Data"> </Typography>
                                    </React.Fragment>
                  
                                )
                            }
                        </React.Fragment>
                     }
                    { timeSlot.length === 0 &&
                        <Typography value={t("Please Add Timeslot")} />
                    

                    }
            </div>
    )
}
export default Details;