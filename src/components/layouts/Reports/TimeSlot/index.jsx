/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react'; 
import moment from 'moment';
import Overview from './components/Overview';
import Details from './components/Details';
import Cards from './components/Cards';
import Contributors from './components/Contributors';
import useTimeslot from './hooks/useFetchTimeslotData';
import { selectedPlant, reportProgress, customdates } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';
import Card from "components/Core/KPICards/KpiCardsNDL";
import Typography from "components/Core/Typography/TypographyNDL";

function TimeSlot() {
    const { TimeslotLoading, TimeslotData, TimeslotError, getTimeslot } = useTimeslot(); 
    const [customdatesval] = useRecoilState(customdates);
    const [headPlant] = useRecoilState(selectedPlant);
    const [, setProgress] = useRecoilState(reportProgress);
    const [KPIInfo, setKPIInfo] = useState([])
    const COLORS = ['#88B056', '#EC3B77', '#FF6C3E', '#9721B6', '#3DA3F5', '#FFD121', '#DF3B44', '#2E81FF'];
    const [uniquetimeslotdata, setuniquetimeslotdata] = useState([])
    let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
    let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    let TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight 

    

    useEffect(() => { 
        let frmDate = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss"+ TZone)
        let toDate = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss"+ TZone)
        setKPIInfo([])
        
        if (headPlant.timeslot && (headPlant.timeslot.energy_asset || headPlant.timeslot.nodes)) {
            let nodes = headPlant.timeslot.nodes.length > 0 ? [...headPlant.timeslot.nodes.map(val => val.id)] : []
            if (headPlant.timeslot.energy_asset) nodes.unshift(headPlant.timeslot.energy_asset)
            if (nodes.length > 0) {
                setProgress(true)
                getTimeslot(frmDate, toDate, nodes)
            }

        } 

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customdatesval])

     
    useEffect(() => {

        setProgress(TimeslotLoading)
        if (!TimeslotLoading && TimeslotData && !TimeslotError) {
            let KPIinfo = []
            let uniquetimeslotarr = []
            const timeslots = headPlant.timeslot.timeslots
            TimeslotData.map((asset) => {
                let uniquedata = []
                // eslint-disable-next-line array-callback-return
                asset.data.map((val) => {
                    const timeslotpresent = timeslots.findIndex(t =>  t.name === val.name)
                    if (timeslotpresent >= 0) {
                        let index = uniquedata.findIndex(p => p.day === val.day && p.name === val.name)
                        if (index >= 0) {
                            uniquedata[index].value = uniquedata[index].value + val.value
                        } else {
                            uniquedata.push(val)
                        }
                    } 

                })
                uniquetimeslotarr.push(Object.assign({}, asset, { "data": uniquedata }))
            })
            setuniquetimeslotdata(uniquetimeslotarr)
            if (headPlant.timeslot.energy_asset) {
                uniquetimeslotarr.forEach((asset) => {
                    if (asset.viid === headPlant.timeslot.energy_asset) {
                        asset.data.forEach((val, ind) => {
                            let index = KPIinfo.findIndex(s => s.name === val.name)
                            if (index >= 0) {
                                KPIinfo[index].value = KPIinfo[index].value + val.value
                                KPIinfo[index].consumption.push(val.value)
                            } else {
                                KPIinfo.push({
                                    "name": val.name, "value": val.value,
                                    "consumption": [val.value], color: COLORS[ind]
                                })

                            }
                        })
                    }

                })
            }
            let absentslot = timeslots.filter(t=>!KPIinfo.map(k=>k.name).includes(t.name))
            if(absentslot && absentslot.length>0){
                absentslot.forEach(val=>{
                    KPIinfo.push({
                        "name": val.name, "value": '-',
                        "consumption": [], color: undefined
                    })
                })
                
            }
            setKPIInfo(KPIinfo)
        } 

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TimeslotLoading, TimeslotData, TimeslotError])

     
    return (
        <div className='p-4'>
            <div style={{ display: "flex", justifyContent: "space-between"}}>
                <Card style={{ width: "75%", padding: "16px",height: '520px' }} elevation={0}>
                    <Typography
                       variant='heading-01-xs'
                       color='secondary'
                        value={"Timesolt"} />
                    <div style={{ display: "flex", padding: "16px", alignItems: "flex-start" }}>
                        <Cards slots={KPIInfo} energyasset={headPlant.timeslot.energy_asset} />
                    </div>
                    <Overview data={uniquetimeslotdata} slots={KPIInfo} energyasset={headPlant.timeslot.energy_asset} />
                </Card>
                <Contributors slots={KPIInfo} energyasset={headPlant.timeslot.energy_asset} />
            </div>
            <Details data={uniquetimeslotdata} />
        </div>
    )
}
export default TimeSlot;